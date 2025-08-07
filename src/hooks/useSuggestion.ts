import { useState } from 'react';

export type Suggestion = {
  description: string;
  mood: string;
  minTime: number;
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
