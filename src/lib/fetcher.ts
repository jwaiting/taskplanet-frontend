import type { ApiError } from '../types';
import { getAuthToken, tryDevLogin } from './auth';

const base = (import.meta as any).env?.VITE_API_BASE ?? '/api';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // Build headers with Authorization if we have a token
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as any),
  };
  if (token && !headers['Authorization']) headers['Authorization'] = `Bearer ${token}`;

  const doFetch = async (): Promise<{ res: Response; data: any; text: string }> => {
    const res = await fetch(`${base}${path}`, { ...init, headers });
    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; }
    return { res, data, text };
  };

  let { res, data, text } = await doFetch();

  // In dev, on auth failure, optionally attempt a one-time dev-login and retry once
  const enableAuto = String((import.meta as any).env?.VITE_ENABLE_DEV_LOGIN ?? '').toLowerCase();
  const autoDevLogin = (import.meta as any).env?.DEV && (enableAuto === '1' || enableAuto === 'true');
  if ((res.status === 401 || res.status === 403) && autoDevLogin) {
    try {
      await tryDevLogin(base);
      // Update Authorization header if token became available
      const t2 = getAuthToken();
      if (t2) headers['Authorization'] = `Bearer ${t2}`;
      ({ res, data, text } = await doFetch());
    } catch {
      // ignore and fall through to error handling
    }
  }

  if (!res.ok) {
    const err = (data as ApiError) ?? { error: text || res.statusText };
    throw err;
  }
  return data as T;
}
