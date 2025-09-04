import React, { useEffect, useMemo, useState } from 'react';
import { Api } from '../../api/client';
import type { SuggestParams, Suggestion, TodayTask } from '../../types';
import { asTaskId } from '../../types';
import { addTodayTask, loadTodayTasks } from '../../lib/storage';
import Toast from '../../components/ui/Toast';

type Props = {
  params: SuggestParams;
  showIds?: boolean;
};

export default function SuggestList({ params, showIds = false }: Props) {
  const [data, setData] = useState<Suggestion[] | null>(null);
  const [error, setError] = useState<{ error: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ids = new Set(loadTodayTasks().map(t => String(t.id)));
    setAddedIds(ids);
  }, []);

  const requestPayload = useMemo(() => {
    const p: SuggestParams = {};
    if (params.tagCodes?.length) p.tagCodes = params.tagCodes;
    if (params.tags?.length) p.tags = params.tags;
    if (params.time) p.time = params.time;
    p.limit = params.limit ?? 10;
    return p;
  }, [JSON.stringify(params)]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!alive) return;
      setLoading(true);
      try {
        const res = await Api.suggest(requestPayload);
        setData(res);
        setError(null);

        // impression（逐筆、非阻塞）
        if (Array.isArray(res) && res.length) {
          const send = async () => {
            await Promise.allSettled(res.map((s) => {
              const tid = asTaskId(s);
              if (tid == null) return Promise.resolve();
              // quietly send; skip if unauthenticated, ignore errors
              return Api.postEventQuiet({ event: 'impression', taskId: tid, tagCodes: s.tagCodes || [] });
            }));
          };
          send();
        }
      } catch (e: any) {
        setError({ error: e?.error ?? 'Unknown error' });
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [JSON.stringify(requestPayload)]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  async function onAdopt(s: Suggestion) {
    const tid = asTaskId(s);
    if (tid == null) return;
    await Api.postEventQuiet({ event: 'adopt', taskId: tid, tagCodes: s.tagCodes || [] });
    const task: TodayTask = {
      id: tid,
      title: s.title,
      tagCodes: s.tagCodes || [],
      suggestedTime: s.suggestedTime ?? s.estTime,
      estTime: s.estTime,
      addedAt: new Date().toISOString(),
    };
    addTodayTask(task);
    setAddedIds(prev => new Set(prev).add(String(tid)));
    setToast(`已加入今日清單：${s.title}`);
  }

  async function onSkip(s: Suggestion) {
    const tid = asTaskId(s);
    if (tid == null) return;
    await Api.postEventQuiet({ event: 'skip', taskId: tid, tagCodes: s.tagCodes || [] });
    setToast(`已略過：${s.title}`);
  }

  if (loading && !data) return <p>載入建議中…</p>;
  if (error) return <p>取得建議失敗：{error.error}</p>;
  if (!data || data.length === 0) return <p>沒有取得建議。</p>;

  return (
    <>
      <ul className="suggest-list">
        {data.map((s) => {
          const tid = asTaskId(s);
          const added = tid != null && addedIds.has(String(tid));
          const key = String(s.id ?? s.taskId ?? Math.random());

          return (
            <li key={key} className="card">
              <div className="title">{s.title}</div>
              <div className="meta">
                {s.suggestedTime ?? s.estTime ? `${s.suggestedTime ?? s.estTime} min` : null}
                {s.tagCodes?.length ? <span style={{ marginLeft: 8, opacity:.7 }}>#{s.tagCodes.join(' #')}</span> : null}
              </div>
              {showIds && (
                <div style={{ opacity:.6, fontSize:12, marginTop:4 }}>
                  ID: {tid ?? s.id ?? 'N/A'}
                </div>
              )}
              {s.description ? <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{s.description.length > 140 ? s.description.slice(0,140)+'…' : s.description}</p> : null}
              <div className="actions">
                <button disabled={tid == null || added} onClick={() => onAdopt(s)}>
                  {added ? '已加入' : '開始'}
                </button>
                <button disabled={tid == null} onClick={() => onSkip(s)}>略過</button>
              </div>
            </li>
          );
        })}
      </ul>
      <Toast message={toast} />
    </>
  );
}
