-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits (expires_at);

-- Atomic rate limit increment: increments count if within window, resets if expired
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_key TEXT,
  p_window_ms INTEGER,
  p_max_requests INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
  v_expires_at TIMESTAMPTZ;
  v_now CONSTANT TIMESTAMPTZ := NOW();
BEGIN
  -- Try to insert a new row; on conflict, do nothing so we can check
  INSERT INTO rate_limits (key, count, expires_at)
  VALUES (p_key, 1, v_now + (p_window_ms || ' milliseconds')::INTERVAL)
  ON CONFLICT (key) DO NOTHING;

  -- Get the current state
  SELECT r.count, r.expires_at INTO v_count, v_expires_at
  FROM rate_limits r
  WHERE r.key = p_key;

  -- If expired, reset
  IF v_expires_at < v_now THEN
    UPDATE rate_limits
    SET count = 1, expires_at = v_now + (p_window_ms || ' milliseconds')::INTERVAL
    WHERE key = p_key
    RETURNING count INTO v_count;

    RETURN JSONB_BUILD_OBJECT('allowed', true, 'count', 1);
  END IF;

  -- If over limit, deny
  IF v_count > p_max_requests THEN
    RETURN JSONB_BUILD_OBJECT(
      'allowed', false,
      'retryAfter', EXTRACT(EPOCH FROM (v_expires_at - v_now))::INTEGER,
      'count', v_count
    );
  END IF;

  -- Increment count
  UPDATE rate_limits
  SET count = count + 1
  WHERE key = p_key
  RETURNING count INTO v_count;

  -- Cleanup expired rows periodically (1% chance per call)
  IF random() < 0.01 THEN
    DELETE FROM rate_limits WHERE expires_at < v_now;
  END IF;

  RETURN JSONB_BUILD_OBJECT('allowed', true, 'count', v_count);
END;
$$;
