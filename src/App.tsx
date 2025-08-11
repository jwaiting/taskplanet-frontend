import { useState } from 'react';
import CommunitySuggestionList from './components/CommunitySuggestionList';
import SuggestionList from './components/SuggestionList';
import CustomSuggestionForm from './components/CustomSuggestionForm';
import TodayTaskList from './components/TodayTaskList';
import TaskForm from './components/TaskForm';
import DailyQuote from './components/DailyQuote';
import { useTaskManager } from './hooks/useTaskManager';
import { useSuggestions } from './hooks/useSuggestion';
import type { Suggestion } from './hooks/useSuggestion'; // ✅ 確保有引入

function App() {
  const [mood, setMood] = useState('放鬆');
  const [time, setTime] = useState(20);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hasFetched, setHasFetched] = useState(false); // ✅ 加這行

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
    const data = await fetchSuggestions();
    setSuggestions(data);
    setHasFetched(true); // ✅ 點過「給我建議」後顯示客製化欄位
  };

  const handleCustomSuggestion = async (custom: Suggestion) => {
    await submitCustomSuggestion(custom);
    setSuggestions((prev) => [...prev, custom]);
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
      {hasFetched && <CommunitySuggestionList mood={mood} time={time} onAdd={addTask} />}

      {hasFetched && <CustomSuggestionForm onSubmit={handleCustomSuggestion} />}

      <TodayTaskList todayTasks={todayTasks} onToggle={toggleComplete} onRemove={removeTask} />
    </div>
  );
}

export default App;
