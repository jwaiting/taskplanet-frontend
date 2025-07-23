import { useState } from 'react';
import SuggestionList from './components/SuggestionList';
import TodayTaskList from './components/TodayTaskList';
import TaskForm from './components/TaskForm';

type Suggestion = {
  description: string;
  mood: string;
  minTime: number;
  completed?: boolean;
};

function App() {
  const [mood, setMood] = useState('放鬆');
  const [time, setTime] = useState(20);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [todayTasks, setTodayTasks] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = () => {
    setLoading(true);
    setError(null);
    fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  // ✅ 加入任務
  const addToTodayTasks = (task: Suggestion) => {
    if (!todayTasks.find((t) => t.description === task.description)) {
      setTodayTasks([...todayTasks, { ...task, completed: false }]);
    }
  };

  // ✅ 切換完成狀態
  const toggleComplete = (index: number) => {
    const updated = [...todayTasks];
    updated[index].completed = !updated[index].completed;
    setTodayTasks(updated);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎯 TaskPlanet - 任務建議機器</h1>
      <TaskForm
        mood={mood}
        time={time}
        onMoodChange={setMood}
        onTimeChange={setTime}
        onFetch={fetchSuggestions}
      />

      {loading && <p>🚀 載入中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SuggestionList suggestions={suggestions} onAdd={addToTodayTasks} />
      <TodayTaskList todayTasks={todayTasks} onToggle={toggleComplete} />
    </div>
  );
}

export default App;
