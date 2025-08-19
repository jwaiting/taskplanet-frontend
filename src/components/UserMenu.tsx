import React, { useEffect, useState } from 'react';
import { loadPrefs, savePrefs, type UserPrefs } from '../lib/prefs';
import { useTags } from '../features/tags/useTags';

export default function UserMenu() {
  const { data: tags } = useTags();
  const safeTags = Array.isArray(tags) ? tags : [];
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<UserPrefs>(() => loadPrefs());

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  function toggleTag(code: string) {
    setPrefs((p) => {
      const has = p.defaultTags.includes(code);
      return { ...p, defaultTags: has ? p.defaultTags.filter(x => x !== code) : [...p.defaultTags, code] };
    });
  }

  function onSave() {
    const limit = !prefs.limit || prefs.limit < 1 ? 10 : Math.floor(prefs.limit);
    const time = prefs.time && prefs.time > 0 ? Math.floor(prefs.time) : undefined;
    savePrefs({ ...prefs, limit, time });
    setOpen(false);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(v => !v)}>使用者設定</button>
      {open && (
        <div style={{
          position:'absolute', right:0, top:'100%', zIndex:10,
          border:'1px solid #ddd', borderRadius:8, background:'#fff', padding:12, width:300
        }}>
          <div style={{ marginBottom: 8 }}>
            <strong>預設標籤</strong>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
              {safeTags.map(t => (
                <label key={t.code} className="chip" style={{ cursor:'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.defaultTags.includes(t.code)}
                    onChange={() => toggleTag(t.code)}
                    style={{ marginRight: 6 }}
                  />
                  {t.name ?? t.code}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
            <label>時間（分鐘）</label>
            <input
              type="number" min="0" inputMode="numeric"
              value={prefs.time ?? ''} onChange={(e) => setPrefs(p => ({ ...p, time: Number(e.target.value || 0) || undefined }))}
            />
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
            <label>數量上限</label>
            <input
              type="number" min="1" inputMode="numeric"
              value={prefs.limit ?? 10} onChange={(e) => setPrefs(p => ({ ...p, limit: Number(e.target.value || 10) || 10 }))}
            />
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={() => setOpen(false)}>取消</button>
            <button onClick={onSave}>儲存</button>
          </div>
        </div>
      )}
    </div>
  );
}
