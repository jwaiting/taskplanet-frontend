export type UserPrefs = {
  defaultTags: string[];
  time?: number;
  limit?: number;
};

const KEY = 'tp_user_prefs_v1';

export function loadPrefs(): UserPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { defaultTags: [], time: undefined, limit: 10 };
    const p = JSON.parse(raw);
    return {
      defaultTags: Array.isArray(p.defaultTags) ? p.defaultTags : [],
      time: typeof p.time === 'number' ? p.time : undefined,
      limit: typeof p.limit === 'number' ? p.limit : 10,
    };
  } catch {
    return { defaultTags: [], time: undefined, limit: 10 };
  }
}

export function savePrefs(p: UserPrefs) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
