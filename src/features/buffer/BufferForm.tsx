import React, { useState } from 'react';
import { Api } from '../../api/client';

export default function BufferForm() {
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [time, setTime] = useState<string>('');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    const tagCodes = tags.split(',').map(t => t.trim()).filter(Boolean);
    try {
      const res = await Api.pushBuffer({
        description: desc,
        tagCodes,
        suggestedTime: time ? Number(time) : undefined, // 對齊你的後端
      });
      setMsg(res.status === 'merged' ? '已與相似建議合併！' : '已送出，等待審核');
      setDesc(''); setTags(''); setTime('');
    } catch (e: any) {
      setMsg(e?.error ?? '送出失敗');
    }
  }

  return (
    <form onSubmit={onSubmit} className="buffer-form">
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="描述新任務…" required />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="標籤（以逗號分隔）" />
      <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="預估時間（分鐘）" />
      <button type="submit">送出建議</button>
      {msg && <p className="hint">{msg}</p>}
    </form>
  );
}
