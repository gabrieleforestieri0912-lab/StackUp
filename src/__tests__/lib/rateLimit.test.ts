import { describe, it, expect, vi } from 'vitest';
import { rateLimitKey } from '@/lib/rateLimit';

describe('rateLimitKey', () => {
  it('generates key from x-forwarded-for header', () => {
    const req = {
      headers: new Headers({
        'x-forwarded-for': '192.168.1.1',
      }),
      url: 'http://localhost:3000/api/test',
    };
    const key = rateLimitKey(req, 'test');
    expect(key).toContain('192.168.1.1');
    expect(key).toContain('test');
  });

  it('falls back to unknown when no ip header present', () => {
    const req = {
      headers: new Headers({}),
      url: 'http://localhost:3000/api/test',
    };
    const key = rateLimitKey(req, 'test');
    expect(key).toContain('unknown');
  });
});
