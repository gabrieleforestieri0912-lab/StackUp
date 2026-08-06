/**
 * Helpers condivisi per il fetching lato client:
 * - `apiFetch`: wrapper che lancia errori tipizzati e legge il body JSON.
 * - `swrFetcher`: fetcher compatibile con SWR (per chi vuole adottarlo).
 */

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Timeout in ms (default 15000) */
  timeoutMs?: number;
}

export async function apiFetch<T = unknown>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, timeoutMs = 15000, headers, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      const message =
        (data && typeof data === 'object' && 'message' in data && typeof (data as { message?: unknown }).message === 'string'
          ? (data as { message: string }).message
          : `HTTP ${response.status}`);
      throw new ApiError(message, response.status, data);
    }

    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Fetcher per SWR — restituisce la `data` se la risposta è OK, lancia altrimenti. */
export async function swrFetcher<T = unknown>(url: string): Promise<T> {
  return apiFetch<T>(url);
}