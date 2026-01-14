
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { checkRateLimit, getClientIP } from '../_shared/security.ts'

const ALLOWED_ORIGINS = [
  'https://devguimaraes.com.br',
  'https://www.devguimaraes.com.br',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
]

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

// Rate limit: 30 requests per minute per IP (polling endpoint)
const RATE_LIMIT_MAX = 30
const RATE_LIMIT_WINDOW = 60000

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req)
    const rateLimit = checkRateLimit(`payment-status:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)
    
    if (!rateLimit.allowed) {
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
    
    if (!id) {
       throw new Error('ID required')
    }

    // Basic input validation for UUID format
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!UUID_REGEX.test(id)) {
      throw new Error('Invalid ID format')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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
