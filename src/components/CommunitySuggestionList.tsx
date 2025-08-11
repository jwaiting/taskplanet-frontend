import { useEffect, useState } from 'react';
import type { Suggestion, CommunitySuggestion } from '../hooks/useSuggestion';
import { fetchFilteredBufferSuggestions, voteBufferSuggestionById } from '../hooks/useSuggestion';
import { hasVotedIdToday, markVotedIdToday } from '../utils/voteLocal';

type Props = {
  mood: string;
  time: number;
  onAdd: (task: Suggestion) => void;
};

function CommunitySuggestionList({ mood, time, onAdd }: Props) {
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>([]);

  useEffect(() => {
    fetchFilteredBufferSuggestions(mood, time)
      .then(setSuggestions)
      .catch((err) => {
        console.error('Failed to fetch community suggestions', err);
        setSuggestions([]);
      });
  }, [mood, time]);

  if (suggestions.length === 0) return null;

  const handleAddWithVote = async (index: number) => {
    const s = suggestions[index];

    // 先加入今日清單（照你的規則：加入即視為投票事件）
    onAdd({ description: s.description, mood: s.mood, minTime: s.minTime });

    // 同一天每個 id 只投一次
    if (hasVotedIdToday(s.id)) return;

    try {
      const newVotes = await voteBufferSuggestionById(s.id);
      markVotedIdToday(s.id);
      setSuggestions((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          voteCount: typeof newVotes === 'number' ? newVotes : copy[index].voteCount + 1,
        };
        return copy;
      });
    } catch (e) {
      console.error(e);
      // 靜默失敗即可：不影響加入清單
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>🗳️ 大家的任務建議</h3>
      {suggestions.map((s, i) => (
        <div key={s.id} style={{ marginBottom: '0.5rem' }}>
          📝 {s.description}（心情: {Array.isArray(s.mood) ? s.mood.join(', ') : String(s.mood)} /
          時間: {s.minTime} 分鐘 / 👍 {s.voteCount}）
          <button onClick={() => handleAddWithVote(i)} style={{ marginLeft: '0.5rem' }}>
            ＋加入
          </button>
        </div>
      ))}
    </div>
  );
}

export default CommunitySuggestionList;
