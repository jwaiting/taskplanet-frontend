import type { TodayTask } from '../types';

function ymd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const PREFIX = 'tp_today_tasks_';
function todayKey() { return PREFIX + ymd(); }

function allKeys(): string[] {
  return Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
}

function cleanupOld() {
  const keep = todayKey();
  for (const k of allKeys()) {
    if (k !== keep) localStorage.removeItem(k);
  }
}

export function loadTodayTasks(): TodayTask[] {
  cleanupOld();
  const raw = localStorage.getItem(todayKey());
  if (!raw) return [];
  try { return JSON.parse(raw) as TodayTask[]; } catch { return []; }
}

function saveTodayTasks(list: TodayTask[]) {
  localStorage.setItem(todayKey(), JSON.stringify(list));
}

export function addTodayTask(task: TodayTask) {
  const list = loadTodayTasks();
  const exists = new Set(list.map(t => String(t.id)));
  if (!exists.has(String(task.id))) {
    list.push(task);
    saveTodayTasks(list);
  }
}

export function clearTodayTasks() {
  localStorage.removeItem(todayKey());
}
