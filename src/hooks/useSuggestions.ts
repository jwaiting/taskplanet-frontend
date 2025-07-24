import { useState } from 'react';

export function useSuggestions(mood: string, time: number) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noResult, setNoResult] = useState(false);

  const fetchSuggestions = () => {
    setLoading(true);
    setError(null);
    setNoResult(false);

    fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, time }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP 錯誤：${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setSuggestions([]);
          setNoResult(true);
        } else {
          setSuggestions(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API 錯誤：', err);
        setError('無法取得建議任務');
        setLoading(false);
      });
  };

  return {
    suggestions,
    fetchSuggestions,
    loading,
    error,
    noResult,
  };
}
