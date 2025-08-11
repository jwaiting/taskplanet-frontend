import { useState } from 'react';

export type Suggestion = {
  description: string;
  mood: string[];
  minTime: number;
};

export type CommunitySuggestion = Suggestion & {
  id: number;
  voteCount: number;
};

export function useSuggestions(mood: string, time: number) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noResult, setNoResult] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setNoResult(false);

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, time }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      setSuggestions(data);
      if (Array.isArray(data) && data.length === 0) {
        setNoResult(true);
      }

      return data; // ✅ 加這行
    } catch (err: any) {
      console.error('fetchSuggestions failed:', err);
      setError(err.message || '未知錯誤');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitCustomSuggestion = async (custom: {
    description: string;
    mood: string;
    minTime: number;
  }) => {
    await fetch('/api/suggestions/buffer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: custom.description,
        mood: [custom.mood],
        suggestedTime: custom.minTime,
      }),
    });
  };

  return {
    suggestions,
    loading,
    error,
    noResult,
    fetchSuggestions,
    submitCustomSuggestion,
  };
}

export async function fetchBufferSuggestions(): Promise<(Suggestion & { voteCount: number })[]> {
  const res = await fetch('/api/suggestions/buffer');
  if (!res.ok) throw new Error('Failed to load buffer suggestions');
  return await res.json();
}

export async function fetchFilteredBufferSuggestions(
  mood: string,
  time: number,
): Promise<CommunitySuggestion[]> {
  const params = new URLSearchParams({ mood, time: String(time) });
  const res = await fetch(`/api/suggestions/buffer/filter?${params}`);
  if (!res.ok) throw new Error('Failed to load filtered buffer suggestions');
  return await res.json();
}

// hooks/useSuggestion.ts
export async function voteBufferSuggestionById(id: number): Promise<number | undefined> {
  const res = await fetch(`/api/suggestions/buffer/${id}/vote`, { method: 'POST' });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`vote failed: ${res.status} ${msg}`);
  }
  try {
    const data = await res.json();
    return data?.votes as number | undefined;
  } catch {
    return undefined;
  }
}
