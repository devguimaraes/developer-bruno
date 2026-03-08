-- Phase 2: Distributed rate limiting for edge functions

CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
  identifier TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edge_rate_limits_updated_at
ON public.edge_rate_limits (updated_at);

CREATE OR REPLACE FUNCTION public.check_edge_rate_limit(
  p_identifier TEXT,
  p_window_seconds INTEGER,
  p_max_requests INTEGER
)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining INTEGER,
  reset_in_seconds INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
  v_window INTERVAL := make_interval(secs => GREATEST(1, p_window_seconds));
  v_window_start TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  INSERT INTO public.edge_rate_limits (identifier, window_started_at, request_count, updated_at)
  VALUES (p_identifier, v_now, 1, v_now)
  ON CONFLICT (identifier)
  DO UPDATE
    SET
      window_started_at = CASE
        WHEN public.edge_rate_limits.window_started_at + v_window <= v_now THEN v_now
        ELSE public.edge_rate_limits.window_started_at
      END,
      request_count = CASE
        WHEN public.edge_rate_limits.window_started_at + v_window <= v_now THEN 1
        ELSE public.edge_rate_limits.request_count + 1
      END,
      updated_at = v_now
  RETURNING window_started_at, request_count
  INTO v_window_start, v_count;

  -- Lightweight cleanup to avoid unbounded growth
  IF random() < 0.02 THEN
    DELETE FROM public.edge_rate_limits
    WHERE updated_at < v_now - INTERVAL '1 day';
  END IF;

  allowed := v_count <= p_max_requests;
  remaining := GREATEST(p_max_requests - v_count, 0);
  reset_in_seconds := GREATEST(
    CEIL(EXTRACT(EPOCH FROM ((v_window_start + v_window) - v_now)))::INTEGER,
    0
  );

  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.check_edge_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_edge_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;
