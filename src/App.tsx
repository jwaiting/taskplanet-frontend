import { useState } from 'react';
import SuggestionList from './components/SuggestionList';
import TodayTaskList from './components/TodayTaskList';
import TaskForm from './components/TaskForm';
import DailyQuote from './components/DailyQuote';
import { useTaskManager } from './hooks/useTaskManager';
import { useSuggestions } from './hooks/useSuggestions';

function App() {
  const [mood, setMood] = useState('放鬆');
  const [time, setTime] = useState(20);

  const { suggestions, fetchSuggestions, loading, error, noResult } = useSuggestions(mood, time);

  const { todayTasks, addTask, toggleComplete, removeTask } = useTaskManager();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <DailyQuote />
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
      {noResult && <p style={{ color: 'gray' }}>😥 根據你目前的心情與時間，找不到合適的任務</p>}

      <SuggestionList suggestions={suggestions} onAdd={addTask} />
      <TodayTaskList todayTasks={todayTasks} onToggle={toggleComplete} onRemove={removeTask} />
    </div>
  );
}

export default App;
