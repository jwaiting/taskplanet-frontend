// Lightweight auth helper for dev + runtime token storage

const STORAGE_KEY = 'tp_auth_token';

let cachedToken: string | null = null;
let triedDevLogin = false;

export function getAuthToken(): string | null {
  if (cachedToken) return cachedToken;
  try {
    const t = (typeof localStorage !== 'undefined') ? localStorage.getItem(STORAGE_KEY) : null;
    cachedToken = t || null;
  } catch {}
  return cachedToken;
}

export function setAuthToken(token: string | null) {
  cachedToken = token;
  try {
    if (typeof localStorage !== 'undefined') {
      if (token) localStorage.setItem(STORAGE_KEY, token);
      else localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

// Best-effort dev login: call /auth/dev-login if available
export async function tryDevLogin(apiBase: string): Promise<string | null> {
  if (triedDevLogin) return getAuthToken();
  triedDevLogin = true;

  // Only attempt in dev mode to avoid accidental prod usage
  // Vite injects import.meta.env.DEV; guard at call sites as well.
  try {
    const url = `${apiBase}/auth/dev-login`;

    // Prefer POST (matches your smoke script); fallback to GET
    const attempts: Array<RequestInit> = [
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { method: 'GET' },
    ];

    for (const init of attempts) {
      try {
        const res = await fetch(url, init);
        if (!res.ok) continue;
        const text = await res.text();
        let data: any = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = null; }

        const token: string | undefined =
          data?.token || data?.jwt || data?.access_token || data?.accessToken;
        if (typeof token === 'string' && token.length > 0) {
          setAuthToken(token);
          return token;
        }
      } catch {
        // ignore and try next
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// Non-blocking bootstrap that tries dev-login once on app start
export function bootstrapDevAuth(apiBase: string) {
  if (!(import.meta as any).env?.DEV) return;
  // Fire and forget
  tryDevLogin(apiBase);
}
