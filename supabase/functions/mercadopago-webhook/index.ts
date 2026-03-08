import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  validateMercadoPagoSignature,
  parsePositiveIntEnv,
  logSecurityEvent
} from '../_shared/security.ts'

// Webhook receives requests from Mercado Pago servers, so CORS must allow any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
}
const DOWNLOAD_TOKEN_TTL_SECONDS = parsePositiveIntEnv(
  Deno.env.get('DOWNLOAD_TOKEN_TTL_SECONDS'),
  24 * 60 * 60
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const body = await req.json().catch(() => ({}))
    
    // Support both Query Params (MP default) and Body
    const queryId = url.searchParams.get('data.id') || url.searchParams.get('id')
    const queryType = url.searchParams.get('type') || url.searchParams.get('topic')
    
    const paymentId = body.data?.id || body.id || queryId
    const type = body.type || body.topic || queryType

    if (!paymentId || (type !== 'payment' && type !== 'topic')) {
       // Just acknowledge unrelated notifications
       logSecurityEvent('info', 'webhook_notification_ignored', {
        paymentId: paymentId?.toString() ?? null,
        queryType,
       })
       return new Response('ok', { status: 200 })
    }

    // Validate Mercado Pago signature
    const mpSecretKey = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET')
    if (!mpSecretKey) {
      logSecurityEvent('error', 'webhook_secret_missing')
      return new Response(JSON.stringify({ error: 'Webhook security not configured' }), {
        status: 500
      })
    }
    const isValid = await validateMercadoPagoSignature(req, paymentId.toString(), mpSecretKey)
    if (!isValid) {
      logSecurityEvent('warn', 'webhook_invalid_signature', { paymentId: paymentId.toString() })
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401 }
      )
    }
    logSecurityEvent('info', 'webhook_signature_validated', { paymentId: paymentId.toString() })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured')
    }
    
    // Check Status with Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!mpResponse.ok) {
        throw new Error('Failed to fetch payment status from Mercado Pago')
    }

    const paymentData = await mpResponse.json()
    const status = paymentData.status
    const external_reference = paymentData.external_reference
    if (!external_reference) {
      throw new Error('Missing external_reference in Mercado Pago payment response')
    }

    interface PaymentUpdate {
      status: string
      mercadopago_payment_id: string
      download_token?: string
      download_token_expires_at?: string
    }

    // Update Database
    const updateData: PaymentUpdate = { status, mercadopago_payment_id: paymentId.toString() }

    if (status === 'approved') {
        // Check if token already exists
        const { data: current } = await supabase
          .from('payments')
          .select('download_token, download_token_expires_at')
          .eq('external_reference', external_reference)
          .single()

        const now = Date.now()
        const currentExpiry = current?.download_token_expires_at
          ? new Date(current.download_token_expires_at).getTime()
          : 0
        const hasValidCurrentToken = Boolean(
          current?.download_token && currentExpiry > now
        )

        if (!hasValidCurrentToken) {
            updateData.download_token = crypto.randomUUID()
            updateData.download_token_expires_at = new Date(
              now + DOWNLOAD_TOKEN_TTL_SECONDS * 1000
            ).toISOString()
        }
    }

    const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('external_reference', external_reference)

    if (error) {
        console.error('Database update failed:', error)
        throw error
    }

    return new Response('ok', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
})
