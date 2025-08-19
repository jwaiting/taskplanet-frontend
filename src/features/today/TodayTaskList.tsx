import React, { useEffect, useState } from 'react';
import { loadTodayTasks, clearTodayTasks } from '../../lib/storage';
import type { TodayTask } from '../../types';

export default function TodayTaskList() {
  const [items, setItems] = useState<TodayTask[]>([]);

  const refresh = () => setItems(loadTodayTasks());
  useEffect(() => { refresh(); }, []);

  if (!items.length) return <p>今天還沒有任務。</p>;

  return (
    <div>
      <ul className="today-list">
        {items.map(t => (
          <li key={String(t.id)} className="card">
            <div className="title">{t.title}</div>
            <div className="meta">{t.suggestedTime ?? t.estTime ? `${t.suggestedTime ?? t.estTime} min` : null}</div>
          </li>
        ))}
      </ul>
      <button onClick={() => { clearTodayTasks(); refresh(); }}>
        清空今天清單
      </button>
    </div>
  );
}
