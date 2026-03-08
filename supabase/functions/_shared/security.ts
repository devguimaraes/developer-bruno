// Utility functions for Edge Functions security

const DEFAULT_ALLOWED_ORIGINS = [
  'https://devguimaraes.com.br',
  'https://www.devguimaraes.com.br',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
]

/**
 * Email sanitization: trim, lowercase, and validate format
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    throw new Error('Email must be a string')
  }
  
  // Trim whitespace and convert to lowercase
  const sanitized = email.trim().toLowerCase()
  
  // Remove any HTML/script tags as extra protection
  const noTags = sanitized.replace(/<[^>]*>/g, '')
  
  // Validate format
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!EMAIL_REGEX.test(noTags)) {
    throw new Error('Invalid email format')
  }
  
  // Basic domain validation (must have at least one dot after @)
  const [, domain] = noTags.split('@')
  if (!domain || !domain.includes('.')) {
    throw new Error('Invalid email domain')
  }
  
  return noTags
}

/**
 * Simple in-memory rate limiter
 * Returns true if request should be allowed, false if rate limited
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to cleanup
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }
  
  if (!record || record.resetTime < now) {
    // New window
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }
  
  if (record.count >= maxRequests) {
    // Rate limited
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now }
  }
  
  // Increment counter
  record.count++
  return { allowed: true, remaining: maxRequests - record.count, resetIn: record.resetTime - now }
}

interface RpcCapableClient {
  rpc: (
    fn: string,
    args?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message?: string } | null }>
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

interface RateLimitRpcRow {
  allowed: boolean
  remaining: number
  reset_in_seconds: number
}

export async function checkRateLimitDistributed(
  supabase: RpcCapableClient,
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000))
  const { data, error } = await supabase.rpc('check_edge_rate_limit', {
    p_identifier: identifier,
    p_window_seconds: windowSeconds,
    p_max_requests: maxRequests,
  })

  if (error) {
    throw new Error(`Distributed rate limit RPC failed: ${error.message || 'unknown error'}`)
  }

  const row = Array.isArray(data) ? (data[0] as RateLimitRpcRow | undefined) : (data as RateLimitRpcRow | null)
  if (!row || typeof row.allowed !== 'boolean') {
    throw new Error('Distributed rate limit RPC returned an invalid payload')
  }

  return {
    allowed: row.allowed,
    remaining: Math.max(0, Number(row.remaining) || 0),
    resetIn: Math.max(0, (Number(row.reset_in_seconds) || 0) * 1000),
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

export function getAllowedOrigins(): string[] {
  const configured = Deno.env.get('ALLOWED_ORIGINS')
  if (!configured) return DEFAULT_ALLOWED_ORIGINS
  const parsed = configured
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  return parsed.length > 0 ? parsed : DEFAULT_ALLOWED_ORIGINS
}

export function getCorsHeaders(
  origin: string | null,
  extraAllowedHeaders: string[] = []
): Record<string, string> {
  const allowedOrigins = getAllowedOrigins()
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  const baseHeaders = ['authorization', 'x-client-info', 'apikey', 'content-type']
  const allHeaders = [...new Set([...baseHeaders, ...extraAllowedHeaders])]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': allHeaders.join(', '),
  }
}

const SENSITIVE_FIELDS = new Set([
  'authorization',
  'token',
  'download_token',
  'status_access_token',
  'signature',
  'x-signature',
  'email',
  'body',
  'secret',
  'apikey',
])

function sanitizeForSecurityLog(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForSecurityLog(item))
  }
  if (value && typeof value === 'object') {
    const input = value as Record<string, unknown>
    const output: Record<string, unknown> = {}
    for (const [key, current] of Object.entries(input)) {
      const normalizedKey = key.toLowerCase()
      if (SENSITIVE_FIELDS.has(normalizedKey)) {
        output[key] = '[REDACTED]'
      } else {
        output[key] = sanitizeForSecurityLog(current)
      }
    }
    return output
  }
  if (typeof value === 'string' && value.length > 300) {
    return `${value.slice(0, 300)}...[truncated]`
  }
  return value
}

export function logSecurityEvent(
  level: 'info' | 'warn' | 'error',
  event: string,
  details: Record<string, unknown> = {}
): void {
  const payload = sanitizeForSecurityLog({
    event,
    timestamp: new Date().toISOString(),
    ...details,
  })
  console[level]('[security-event]', payload)
}

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
}

async function hmacSha256(secret: string, value: string): Promise<Uint8Array> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return new Uint8Array(signature)
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

interface StatusAccessPayload {
  external_reference: string
  exp: number
}

export function parsePositiveIntEnv(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}

/**
 * Creates a signed access token for payment-status polling.
 * Format: base64url(payload).base64url(signature)
 */
export async function createStatusAccessToken(
  externalReference: string,
  secret: string,
  ttlSeconds: number
): Promise<string> {
  const payload: StatusAccessPayload = {
    external_reference: externalReference,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  }
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload))
  const payloadPart = toBase64Url(payloadBytes)
  const signaturePart = toBase64Url(await hmacSha256(secret, payloadPart))
  return `${payloadPart}.${signaturePart}`
}

export async function verifyStatusAccessToken(
  token: string,
  secret: string,
  expectedExternalReference: string
): Promise<boolean> {
  if (!token || !secret) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadPart, signaturePart] = parts
  const expectedSignature = toBase64Url(await hmacSha256(secret, payloadPart))
  if (!safeEqual(signaturePart, expectedSignature)) return false

  try {
    const payloadRaw = new TextDecoder().decode(fromBase64Url(payloadPart))
    const payload = JSON.parse(payloadRaw) as StatusAccessPayload
    const now = Math.floor(Date.now() / 1000)
    if (!payload?.external_reference || typeof payload.exp !== 'number') return false
    if (payload.external_reference !== expectedExternalReference) return false
    if (payload.exp <= now) return false
    return true
  } catch {
    return false
  }
}

/**
 * Validate Mercado Pago webhook signature
 * @see https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function validateMercadoPagoSignature(
  req: Request,
  dataId: string,
  secretKey: string
): Promise<boolean> {
  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id')
  
  if (!xSignature || !xRequestId) {
    console.warn('Missing x-signature or x-request-id headers')
    return false
  }
  
  // Parse x-signature header: "ts=TIMESTAMP,v1=SIGNATURE"
  const parts = xSignature.split(',')
  let ts = ''
  let v1 = ''
  
  for (const part of parts) {
    const [key, value] = part.split('=')
    if (key === 'ts') ts = value
    if (key === 'v1') v1 = value
  }
  
  if (!ts || !v1) {
    console.warn('Invalid x-signature format')
    return false
  }
  
  // Build manifest string
  // Format: id:{data_id};request-id:{x-request-id};ts:{timestamp};
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  
  try {
    // Create HMAC SHA256
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(manifest)
    )
    
    // Convert to hex
    const hashArray = Array.from(new Uint8Array(signature))
    const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Compare signatures (constant-time comparison)
    if (calculatedHash.length !== v1.length) {
      return false
    }
    
    let result = 0
    for (let i = 0; i < calculatedHash.length; i++) {
      result |= calculatedHash.charCodeAt(i) ^ v1.charCodeAt(i)
    }
    
    return result === 0
  } catch (error) {
    console.error('Signature validation error:', error)
    return false
  }
}
