export type ApiError = { error: string; hint?: string };

export type Tag = { code: string; name?: string };

export type SuggestParams = {
  tagCodes?: string[];
  tags?: string[];   // 後端若接受別名，保留
  time?: number;
  limit?: number;
};

export type Suggestion = {
  id?: string | number;
  taskId?: number;
  title: string;
  description?: string;
  tagCodes: string[];
  estTime?: number;
  suggestedTime?: number;
  weight?: number;
};

export function asTaskId(s: Suggestion): number | undefined {
  if (typeof s.taskId === 'number') return s.taskId;
  if (s.id != null && !Number.isNaN(Number(s.id))) return Number(s.id);
  return undefined;
}

export type BufferItemInput = {
  description: string;
  tagCodes: string[];
  suggestedTime?: number;
};

export type EventLegacy = 'adopt' | 'skip' | 'impression';
export type EventPayloadLegacy = {
  event: EventLegacy;
  taskId?: number;
  tagCodes?: string[];
  context?: Record<string, unknown>;
};

export type TodayTask = {
  id: string | number;
  title: string;
  tagCodes: string[];
  suggestedTime?: number;
  estTime?: number;
  addedAt: string; // ISO
};
