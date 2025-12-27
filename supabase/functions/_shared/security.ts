// Utility functions for Edge Functions security

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
