
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    if (!email) {
      throw new Error('Email is required')
    }

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
