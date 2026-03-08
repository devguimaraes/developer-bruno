-- Phase 1 Security Hardening: token expiration support
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS download_token_expires_at TIMESTAMPTZ;

-- Optional helper index for expiration checks
CREATE INDEX IF NOT EXISTS idx_payments_download_token_expires_at
ON public.payments (download_token_expires_at);
