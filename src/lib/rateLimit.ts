import { supabaseAdmin } from './supabase-admin';

export async function rateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Date.now();
  const windowKey = `${key}:${Math.floor(now / windowMs)}`;

  try {
    const { data, error } = await supabaseAdmin.rpc('increment_rate_limit', {
      p_key: windowKey,
      p_window_ms: windowMs,
      p_max_requests: maxRequests,
    });

    if (error) throw error;

    return {
      allowed: data?.allowed ?? true,
      retryAfter: data?.retryAfter ?? undefined,
    };
  } catch {
    return { allowed: true };
  }
}

export function rateLimitKey(
  req: { headers: Headers | Record<string, string | string[] | undefined>; url?: string },
  suffix: string,
): string {
  let ip = 'unknown';
  let path = '';

  if (req.headers instanceof Headers) {
    ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    path = (req.url || '').split('?')[0];
  } else {
    const forwarded = req.headers['x-forwarded-for'];
    const ipRaw = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.headers['x-real-ip'] || 'unknown';
    ip = (typeof ipRaw === 'string' ? ipRaw : '').split(',')[0].trim() || 'unknown';
    path = (req.url || '').split('?')[0];
  }

  return `${ip}:${path}:${suffix}`;
}
