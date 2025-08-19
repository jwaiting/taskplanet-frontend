import { apiFetch } from '../lib/fetcher';
import type {
  Tag, SuggestParams, Suggestion, BufferItemInput, EventPayloadLegacy
} from '../types';

// ===== helpers for suggest (kept) =====
function pickFirstNum(...vals: any[]): number | undefined {
  for (const v of vals) if (typeof v === 'number' && Number.isFinite(v)) return v;
  return undefined;
}
function pickArray<T = any>(...vals: any[]): T[] {
  for (const v of vals) if (Array.isArray(v)) return v as T[];
  return [];
}
function normOne(it: any): Suggestion {
  const rawId = it?.id ?? it?.taskId ?? it?.suggestionId ?? it?.uuid;
  const taskId = typeof it?.taskId === 'number' ? it.taskId
              : (typeof it?.id === 'number' ? it.id : undefined);
  const tagCodes = pickArray<string>(it?.tagCodes, it?.tags, it?.labels, it?.tag_list);
  const suggestedTime = pickFirstNum(it?.suggestedTime, it?.estTime, it?.time, it?.duration, it?.estimate, it?.minutes);
  const description: string | undefined =
    it?.description ?? it?.content ?? it?.details ?? it?.body ?? it?.text;
  const title: string =
    it?.title ?? it?.name ?? it?.task ?? it?.text
    ?? (typeof description === 'string' ? (description.split('\n')[0] || '').slice(0, 80) : undefined)
    ?? (rawId != null ? `Task ${rawId}` : '任務');

  return { id: rawId, taskId, title, description, tagCodes, suggestedTime, estTime: it?.estTime, weight: it?.weight };
}
function normMany(raw: any): Suggestion[] {
  const keys = ['items','list','suggestions','data','tasks','results','result'];

  const toArr = (x: any) => Array.isArray(x) ? x.map(normOne) : [];
  if (Array.isArray(raw)) return toArr(raw);
  for (const k of keys) {
    const v = raw?.[k];
    if (Array.isArray(v)) return toArr(v);
    if (v && typeof v === 'object') {
      for (const kk of keys) {
        const vv = v?.[kk];
        if (Array.isArray(vv)) return toArr(vv);
      }
    }
  }
  if (raw && typeof raw === 'object') {
    for (const v of Object.values(raw)) {
      if (Array.isArray(v)) return toArr(v);
      if (v && typeof v === 'object') {
        for (const vv of Object.values(v)) {
          if (Array.isArray(vv)) return toArr(vv);
        }
      }
    }
  }
  if (raw && typeof raw === 'object') return [normOne(raw)];
  return [];
}
function dedupe(list: Suggestion[]): Suggestion[] {
  const seen = new Set<string>();
  const out: Suggestion[] = [];
  for (const s of list) {
    const key = String(s.taskId ?? s.id ?? (s.title || '')) + '|' +
                String((s.description || '').slice(0, 48)) + '|' +
                String(s.suggestedTime ?? s.estTime ?? '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

// ===== NEW: normalize tags =====
function toTag(x: any): Tag | null {
  if (typeof x === 'string') return { code: x };
  if (x && typeof x === 'object') {
    const code = x.code ?? x.value ?? x.tag ?? x.id ?? x.name ?? x.label;
    const name = x.name ?? x.label ?? x.title;
    if (typeof code === 'string') return { code, name: typeof name === 'string' ? name : undefined };
  }
  return null;
}
function normalizeTags(raw: any): Tag[] {
  const keys = ['tags','items','list','data','results','result'];
  const toArr = (arr: any) => (Array.isArray(arr) ? arr.map(toTag).filter(Boolean) as Tag[] : []);
  if (Array.isArray(raw)) return toArr(raw);
  for (const k of keys) {
    const v = raw?.[k];
    if (Array.isArray(v)) return toArr(v);
    if (v && typeof v === 'object') {
      for (const kk of keys) {
        const vv = v?.[kk];
        if (Array.isArray(vv)) return toArr(vv);
      }
    }
  }
  if (raw && typeof raw === 'object') {
    for (const v of Object.values(raw)) {
      if (Array.isArray(v)) return toArr(v);
      if (v && typeof v === 'object') {
        for (const vv of Object.values(v)) {
          if (Array.isArray(vv)) return toArr(vv);
        }
      }
    }
  }
  // last resort: single object representing one tag
  const single = toTag(raw);
  return single ? [single] : [];
}

export const Api = {
  getTags: async () => {
    const raw = await apiFetch<any>('/tags');
    return normalizeTags(raw);
  },

  suggest: async (params: SuggestParams) => {
    const raw = await apiFetch<any>('/suggest', { method: 'POST', body: JSON.stringify(params) });
    return dedupe(normMany(raw));
  },

  pushBuffer: (input: BufferItemInput) =>
    apiFetch<{ status: 'pending' | 'merged'; id?: string | number }>('/suggestions/buffer', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  postEventLegacy: (payload: EventPayloadLegacy) =>
    apiFetch<{ ok: true }>('/events', { method: 'POST', body: JSON.stringify(payload) }),
};
