import { useEffect, useState } from 'react';
import { Api } from '../../api/client';
import type { SuggestParams, Suggestion, ApiError } from '../../types';

export function useSuggest(params: SuggestParams, enabled: boolean) {
  const [data, setData] = useState<Suggestion[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    setLoading(true);
    Api.suggest(params)
      .then((d) => alive && (setData(d), setError(null)))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [JSON.stringify(params), enabled]);

  return { data, error, loading };
}
