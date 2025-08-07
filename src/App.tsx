import { useState } from 'react';
import SuggestionList from './components/SuggestionList';
import CustomSuggestionForm from './components/CustomSuggestionForm';
import TodayTaskList from './components/TodayTaskList';
import TaskForm from './components/TaskForm';
import DailyQuote from './components/DailyQuote';
import { useTaskManager } from './hooks/useTaskManager';
import { useSuggestions } from './hooks/useSuggestion';

function App() {
  const [mood, setMood] = useState('放鬆');
  const [time, setTime] = useState(20);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const {
    fetchSuggestions,
    submitCustomSuggestion,
    loading,
    error,
    noResult,
    suggestions: fetchedSuggestions,
  } = useSuggestions(mood, time);

  const { todayTasks, addTask, toggleComplete, removeTask } = useTaskManager();

  const handleFetch = async () => {
    const data = await fetchSuggestions(); // ✅ 用回傳值
    setSuggestions(data); // ✅ 正確地拿到當次 fetch 的結果
  };

  const handleCustomSuggestion = async (custom: Suggestion) => {
    await submitCustomSuggestion(custom); // 打 API
    setSuggestions((prev) => [...prev, custom]); // 立即顯示
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <DailyQuote />
      <h1>🎯 TaskPlanet - 任務建議機器</h1>

      <TaskForm
        mood={mood}
        time={time}
        onMoodChange={setMood}
        onTimeChange={setTime}
        onFetch={handleFetch}
      />

      {loading && <p>🚀 載入中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {noResult && <p style={{ color: 'gray' }}>😥 根據你目前的心情與時間，找不到合適的任務</p>}

      <SuggestionList suggestions={suggestions} onAdd={addTask} />
      <CustomSuggestionForm onSubmit={handleCustomSuggestion} />
      <TodayTaskList todayTasks={todayTasks} onToggle={toggleComplete} onRemove={removeTask} />
    </div>
  );
}

export default App;
