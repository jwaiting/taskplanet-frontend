import { useState } from 'react';

type Suggestion = {
  description: string;
  mood: string;
  minTime: number;
};

function App() {
  const [mood, setMood] = useState('放鬆');
  const [time, setTime] = useState(20);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = () => {
    setLoading(true);
    setError(null);
    fetch('/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mood, time }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP 錯誤：${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSuggestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API 錯誤：', err);
        setError('無法取得建議任務');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎯 TaskPlanet - 任務建議機器</h1>

      <label>
        💡 心情：
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="放鬆">放鬆</option>
          <option value="靜心">靜心</option>
          <option value="積極">積極</option>
        </select>
      </label>

      <br /><br />

      <label>
        ⏱️ 可用時間（分鐘）：
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(parseInt(e.target.value))}
          min={1}
        />
      </label>

      <br /><br />

      <button onClick={fetchSuggestions}>🎲 給我任務建議</button>

      <br /><br />

      {loading && <p>🚀 載入中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((s, i) => (
            <li key={i}>
              📝 {s.description}（{s.mood} / {s.minTime} 分鐘）
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
