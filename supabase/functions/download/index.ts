
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://brunoguimaraes.dev',
  'https://www.brunoguimaraes.dev',
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
    const token = url.searchParams.get('token')

    if (!token) throw new Error('Token required')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify token
    const { data, error } = await supabase
      .from('payments')
      .select('id')
      .eq('download_token', token)
      .eq('status', 'approved')
      .single()

    if (error || !data) {
        return new Response('Invalid or expired token', { status: 403 })
    }

    // Update used_at (optional log)
    await supabase.from('payments').update({ download_used_at: new Date().toISOString() }).eq('id', data.id)

    // Serve file from Storage
    // Assuming bucket 'antigravity-files' and file 'antigravity-pack.zip'
    const { data: signedData, error: signError } = await supabase
        .storage
        .from('antigravity-files')
        .createSignedUrl('antigravity-pack.zip', 3600) // 1 hour link

    if (signError || !signedData) {
        console.error('Storage error:', signError)
        return new Response('File not found', { status: 404 })
    }

    // Redirect to the signed URL
    return Response.redirect(signedData.signedUrl)

  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
})
