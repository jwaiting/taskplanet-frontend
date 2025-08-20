export function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `voted-ids:${yyyy}-${mm}-${dd}`;
}

export function cleanupOldVotes() {
  const prefix = 'voted-ids:';
  const today = todayKey();
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix) && key !== today) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function hasVotedIdToday(id: number) {
  cleanupOldVotes(); // 每次檢查時清一次
  try {
    const raw = localStorage.getItem(todayKey());
    if (!raw) return false;
    const arr: number[] = JSON.parse(raw);
    return arr.includes(id);
  } catch {
    return false;
  }
}

export function markVotedIdToday(id: number) {
  cleanupOldVotes(); // 每次記錄時清一次
  try {
    const key = todayKey();
    const arr: number[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (!arr.includes(id)) {
      arr.push(id);
      localStorage.setItem(key, JSON.stringify(arr));
    }
  } catch (e) {
    console.error('markVotedIdToday failed', e);
  }
}
