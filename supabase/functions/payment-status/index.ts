
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  checkRateLimitDistributed,
  getClientIP,
  verifyStatusAccessToken,
  getCorsHeaders,
  logSecurityEvent
} from '../_shared/security.ts'

// Rate limit: 30 requests per minute per IP (polling endpoint)
const RATE_LIMIT_MAX = 30
const RATE_LIMIT_WINDOW = 60000

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin, ['x-status-access-token'])

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rate limiting check
    const clientIP = getClientIP(req)
    const rateLimit = await checkRateLimitDistributed(
      supabase,
      `payment-status:${clientIP}`,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW
    )
    
    if (!rateLimit.allowed) {
      logSecurityEvent('warn', 'payment_status_rate_limited', {
        clientIP,
        retryAfterSeconds: Math.ceil(rateLimit.resetIn / 1000),
      })
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(rateLimit.resetIn / 1000)
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString()
          },
          status: 429,
        }
      )
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id') // external_reference
    const statusAccessToken =
      url.searchParams.get('status_access_token') ||
      req.headers.get('x-status-access-token')
    
    if (!id) {
       throw new Error('ID required')
    }
    if (!statusAccessToken) {
      logSecurityEvent('warn', 'payment_status_missing_access_token', { clientIP })
      return new Response(
        JSON.stringify({ error: 'Missing status access token' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Basic input validation for UUID format
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!UUID_REGEX.test(id)) {
      throw new Error('Invalid ID format')
    }
    const statusTokenSecret = Deno.env.get('STATUS_ACCESS_TOKEN_SECRET')
    if (!statusTokenSecret) {
      throw new Error('STATUS_ACCESS_TOKEN_SECRET not configured')
    }
    const isValidStatusToken = await verifyStatusAccessToken(statusAccessToken, statusTokenSecret, id)
    if (!isValidStatusToken) {
      logSecurityEvent('warn', 'payment_status_invalid_access_token', {
        clientIP,
        externalReference: id,
      })
      return new Response(
        JSON.stringify({ error: 'Invalid or expired status access token' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    const { data, error } = await supabase
      .from('payments')
      .select('status, download_token')
      .eq('external_reference', id)
      .single()

    if (error) throw error

    let downloadUrl = null
    if (data.status === 'approved' && data.download_token) {
        downloadUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/download?token=${data.download_token}`
    }

    return new Response(
      JSON.stringify({ 
          status: data.status,
          download_url: downloadUrl
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Payment status error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
