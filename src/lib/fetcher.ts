import type { ApiError } from '../types';

const base = (import.meta as any).env?.VITE_API_BASE ?? '/api';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }

  if (!res.ok) {
    const err = (data as ApiError) ?? { error: text || res.statusText };
    throw err;
  }
  return data as T;
}
