
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sanitizeEmail, checkRateLimit, getClientIP } from '../_shared/security.ts'

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

// Rate limit: 5 requests per minute per IP
const RATE_LIMIT_MAX = 5
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
    const rateLimit = checkRateLimit(`create-pix:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)
    
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

    const { email: rawEmail } = await req.json()
    
    // Sanitize and validate email
    if (!rawEmail) {
      throw new Error('Email is required')
    }
    const email = sanitizeEmail(rawEmail)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured')
    }

    // 1. Create a partial record to get an ID or generate external_reference
    const external_reference = crypto.randomUUID()
    const amount = Number(Deno.env.get('PRODUCT_PRICE') || '47.00')

    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        external_reference,
        email,
        amount,
        status: 'pending',
      })

    if (insertError) {
      throw insertError
    }

    // 2. Call Mercado Pago
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': external_reference
      },
      body: JSON.stringify({
        transaction_amount: amount,
        payment_method_id: 'pix',
        payer: {
          email: email
        },
        external_reference: external_reference,
        description: 'Antigravity Config Pack',
        notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`
      })
    })

    const mpData = await mpResponse.json()

    if (!mpResponse.ok) {
      console.error('Mercado Pago Error:', mpData)
      throw new Error('Failed to create payment with Mercado Pago')
    }

    // 3. Update payment with mercadopago_id
    const { error: updateError } = await supabase
      .from('payments')
      .update({ mercadopago_payment_id: mpData.id.toString() })
      .eq('external_reference', external_reference)

    if (updateError) {
      console.error('Failed to update payment ID:', updateError)
      // Continue anyway as the payment works
    }

    const qr_code = mpData.point_of_interaction?.transaction_data?.qr_code
    const qr_code_base64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64

    return new Response(
      JSON.stringify({
        external_reference,
        qr_code,
        qr_code_base64,
        payment_id: mpData.id
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
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
