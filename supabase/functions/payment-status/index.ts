
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id') // external_reference
    
    if (!id) {
       throw new Error('ID required')
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
