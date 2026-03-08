
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders, logSecurityEvent } from '../_shared/security.ts'

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
      .select('id, download_used_at, download_token_expires_at')
      .eq('download_token', token)
      .eq('status', 'approved')
      .single()

    if (error || !data) {
        logSecurityEvent('warn', 'download_invalid_token_lookup')
        return new Response('Invalid or expired token', { status: 403 })
    }
    if (data.download_used_at) {
      logSecurityEvent('warn', 'download_token_already_used', { paymentId: data.id })
      return new Response('Invalid or expired token', { status: 403 })
    }
    // Backward compatibility: tokens issued before expiration support may have NULL expiration.
    if (data.download_token_expires_at && new Date(data.download_token_expires_at).getTime() <= Date.now()) {
      logSecurityEvent('warn', 'download_token_expired', { paymentId: data.id })
      return new Response('Invalid or expired token', { status: 403 })
    }

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

    // Single-use token consumption (guarded against race conditions)
    const nowIso = new Date().toISOString()
    const { data: consumed, error: consumeError } = await supabase
      .from('payments')
      .update({
        download_used_at: nowIso,
        download_token: null,
        download_token_expires_at: null,
      })
      .eq('id', data.id)
      .eq('download_token', token)
      .is('download_used_at', null)
      .select('id')
      .single()

    if (consumeError || !consumed) {
      logSecurityEvent('warn', 'download_token_consumption_failed', { paymentId: data.id })
      return new Response('Invalid or expired token', { status: 403 })
    }

    // Redirect to the signed URL
    return Response.redirect(signedData.signedUrl)

  } catch (error) {
    console.error('Download error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})
