import React from 'react';
import { useTags } from './useTags';
import type { Tag } from '../../types';

type Props = { selected: string[]; onToggle: (code: string) => void };

export default function TagChips({ selected, onToggle }: Props) {
  const { data, loading, error } = useTags();

  if (loading) return <div>載入標籤中…</div>;
  if (error) return <div>載入失敗：{error.error}</div>;

  const safeTags: Tag[] = Array.isArray(data)
    ? data
    : [];

  if (!safeTags.length) return <div>目前沒有標籤</div>;

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {safeTags.map((t) => (
        <button
          key={t.code}
          onClick={() => onToggle(t.code)}
          className={selected.includes(t.code) ? 'chip chip--active' : 'chip'}
          aria-pressed={selected.includes(t.code)}
          title={t.name ?? t.code}
        >
          {t.name ?? t.code}
        </button>
      ))}
    </div>
  );
}
