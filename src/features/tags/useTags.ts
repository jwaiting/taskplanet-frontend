import { useEffect, useState } from 'react';
import { Api } from '../../api/client';
import type { Tag, ApiError } from '../../types';

export function useTags() {
  const [data, setData] = useState<Tag[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Api.getTags()
      .then((d) => alive && (setData(d), setError(null)))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return { data, error, loading };
}
