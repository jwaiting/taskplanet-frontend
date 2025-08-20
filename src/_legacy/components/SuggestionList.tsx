// src/components/SuggestionList.tsx
type Suggestion = {
  description: string;
  mood: string;
  minTime: number;
};

type Props = {
  suggestions: Suggestion[];
  onAdd: (task: Suggestion) => void;
};

function SuggestionList({ suggestions, onAdd }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <>
      <h2>✨ 建議任務</h2>
      <ul>
        {suggestions.map((s, i) => (
          <li key={i}>
            📝 {s.description}（{s.mood} / {s.minTime} 分鐘）
            <button onClick={() => onAdd(s)} style={{ marginLeft: '0.5rem' }}>
              ＋加入
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SuggestionList;
