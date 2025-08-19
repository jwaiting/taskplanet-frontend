import React, { useEffect, useState } from 'react';
import TagChips from '../features/tags/TagChips';
import BufferForm from '../features/buffer/BufferForm';
import TodayTaskList from '../features/today/TodayTaskList';
import { Link } from 'react-router-dom';
import { loadPrefs } from '../lib/prefs';

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [time, setTime] = useState<string>('');   // minutes
  const [limit, setLimit] = useState<string>('10');

  useEffect(() => {
    const p = loadPrefs();
    setSelected(p.defaultTags);
    if (p.time) setTime(String(p.time));
    if (p.limit) setLimit(String(p.limit));
  }, []);

  const toggle = (c: string) =>
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const qs = new URLSearchParams();
  if (selected.length) qs.set('tags', selected.join(','));
  if (time) qs.set('time', String(Number(time) || 0));
  if (limit) qs.set('limit', String(Number(limit) || 10));

  return (
    <div>
      <section>
        <h2>挑選標籤</h2>
        <TagChips selected={selected} onToggle={toggle} />
        <div style={{ display:'flex', gap:12, marginTop:12 }}>
          <input
            type="number" min="0" inputMode="numeric"
            placeholder="時間（分鐘）"
            value={time} onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="number" min="1" inputMode="numeric"
            placeholder="數量上限"
            value={limit} onChange={(e) => setLimit(e.target.value)}
          />
          <Link to={{ pathname: '/suggest', search: `?${qs.toString()}` }} className="btn-primary">
            取得建議
          </Link>
        </div>
        <p style={{marginTop:8, opacity:.7}}>（預設可在右上角「使用者設定」調整）</p>
      </section>

      <hr />

      <section>
        <h2>今日清單</h2>
        <TodayTaskList />
      </section>

      <hr />

      <section>
        <h2>新增自訂建議</h2>
        <BufferForm />
      </section>
    </div>
  );
}
