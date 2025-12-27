
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateMercadoPagoSignature } from '../_shared/security.ts'

// Webhook receives requests from Mercado Pago servers, so CORS must allow any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
}

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
       console.log('Ignored notification:', { body, queryId, queryType })
       return new Response('ok', { status: 200 })
    }

    // Validate Mercado Pago signature
    const mpSecretKey = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET')
    if (mpSecretKey) {
      const isValid = await validateMercadoPagoSignature(req, paymentId.toString(), mpSecretKey)
      if (!isValid) {
        console.warn('Invalid webhook signature for payment:', paymentId)
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401 }
        )
      }
      console.log('Webhook signature validated successfully for payment:', paymentId)
    } else {
      console.warn('MERCADOPAGO_WEBHOOK_SECRET not configured, skipping signature validation')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    
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

    interface PaymentUpdate {
      status: string
      mercadopago_payment_id: string
      download_token?: string
    }

    // Update Database
    const updateData: PaymentUpdate = { status, mercadopago_payment_id: paymentId.toString() }

    if (status === 'approved') {
        // Check if token already exists
        const { data: current } = await supabase.from('payments').select('download_token').eq('external_reference', external_reference).single()

        if (!current?.download_token) {
            updateData.download_token = crypto.randomUUID()
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
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
