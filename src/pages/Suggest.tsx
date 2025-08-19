import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SuggestList from '../features/suggest/SuggestList';
import { loadPrefs } from '../lib/prefs';
import ActiveQueryBar, { type QueryState } from '../components/ActiveQueryBar';

export default function Suggest() {
  const [sp, setSp] = useSearchParams();
  const p = loadPrefs();

  const initial: QueryState = useMemo(() => {
    const tags = sp.get('tags')?.split(',').map(s=>s.trim()).filter(Boolean) ?? (p.defaultTags ?? []);
    const time = Number(sp.get('time') || '') || (p.time || undefined);
    const limit = Number(sp.get('limit') || '') || (p.limit || 10);
    return { tags, time, limit };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  const [active, setActive] = useState<QueryState>(initial);

  // URL 同步（可分享/重整）
  useEffect(() => {
    const qs = new URLSearchParams();
    if (active.tags.length) qs.set('tags', active.tags.join(','));
    if (active.time) qs.set('time', String(active.time));
    if (active.limit) qs.set('limit', String(active.limit));
    setSp(qs, { replace: true });
  }, [active, setSp]);

  return (
    <div>
      <h2>今日建議</h2>
      <ActiveQueryBar initial={initial} onChange={setActive} />
      <SuggestList params={{ tagCodes: active.tags, time: active.time, limit: active.limit }} showIds />
    </div>
  );
}
