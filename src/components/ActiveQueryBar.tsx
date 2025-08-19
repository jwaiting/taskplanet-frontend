import React, { useEffect, useState } from 'react';
import { useTags } from '../features/tags/useTags';

export type QueryState = {
  tags: string[];
  time?: number;
  limit: number;
};

type Props = {
  initial: QueryState;
  onChange: (q: QueryState) => void;
};

export default function ActiveQueryBar({ initial, onChange }: Props) {
  const { data: tags, loading } = useTags();
  const safeTags = Array.isArray(tags) ? tags : [];
  const [q, setQ] = useState<QueryState>(initial);

  useEffect(() => { setQ(initial); }, [JSON.stringify(initial)]);
  useEffect(() => { onChange(q); }, [JSON.stringify(q)]); // eslint-disable-line

  function toggle(code: string) {
    setQ(p => {
      const has = p.tags.includes(code);
      return { ...p, tags: has ? p.tags.filter(x=>x!==code) : [...p.tags, code] };
    });
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:8, alignItems:'start' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>標籤</div>
          {loading ? <div>載入標籤中…</div> : (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {safeTags.map(t => (
                <label key={t.code} className={`chip ${q.tags.includes(t.code) ? 'chip--active' : ''}`} style={{ cursor:'pointer' }}>
                  <input
                    type="checkbox"
                    checked={q.tags.includes(t.code)}
                    onChange={() => toggle(t.code)}
                    style={{ marginRight: 6 }}
                  />
                  {t.name ?? t.code}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>時間（分鐘）</div>
          <input
            type="number" min="0" inputMode="numeric"
            value={q.time ?? ''} placeholder="可留空"
            onChange={(e) => setQ(p => ({ ...p, time: e.target.value ? Number(e.target.value) : undefined }))}
          />
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>數量上限</div>
          <input
            type="number" min="1" inputMode="numeric"
            value={q.limit}
            onChange={(e) => setQ(p => ({ ...p, limit: Math.max(1, Number(e.target.value || 1)) }))}
          />
        </div>
      </div>

      <div style={{ marginTop:6, opacity:.7 }}>
        實際送出的參數：{JSON.stringify(q)}
      </div>
    </div>
  );
}
