import { useState, useEffect } from 'react';
import SuggestionList from './components/SuggestionList';
import TodayTaskList from './components/TodayTaskList';
import TaskForm from './components/TaskForm';
import DailyQuote from './components/DailyQuote';

type Suggestion = {
  description: string;
  mood: string;
  minTime: number;
  completed?: boolean;
};

// 🔧 幫你抽一個 key function
function getTodayKey() {
  return `taskplanet-today-${new Date().toISOString().split('T')[0]}`;
}

function App() {
  const [mood, setMood] = useState('放鬆');
  const [time, setTime] = useState(20);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [todayTasks, setTodayTasks] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [noResult, setNoResult] = useState(false); // 新增 state

  // ✅ 初始載入 todayTasks
  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem(todayKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodayTasks(parsed);
      } catch (err) {
        console.warn('⚠️ 載入任務失敗，格式可能錯誤：', err);
      }
    }
    setInitialLoaded(true);
  }, []);

  // ✅ 自動儲存任務
  useEffect(() => {
    if (!initialLoaded) return; // ✅ 一定要載入完成才啟用儲存
    const todayKey = getTodayKey();
    localStorage.setItem(todayKey, JSON.stringify(todayTasks));
  }, [todayTasks, initialLoaded]);

  // ✅ 清除舊任務
  useEffect(() => {
    const todayKey = getTodayKey();
    const prefix = 'taskplanet-today-';
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix) && key !== todayKey) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  const fetchSuggestions = () => {
    setLoading(true);
    setError(null);
    setNoResult(false); // 每次重新請求前先清除
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
        if (!Array.isArray(data) || data.length === 0) {
          setSuggestions([]);
          setNoResult(true); // 設定無建議任務狀態
        } else {
          setSuggestions(data);
          setNoResult(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API 錯誤：', err);
        setError('無法取得建議任務');
        setLoading(false);
      });
  };

  const addToTodayTasks = (task: Suggestion) => {
    if (!todayTasks.find((t) => t.description === task.description)) {
      setTodayTasks([...todayTasks, { ...task, completed: false }]);
    }
  };

  const removeTask = (index: number) => {
    const updated = [...todayTasks];
    updated.splice(index, 1);
    setTodayTasks(updated);
  };

  const toggleComplete = (index: number) => {
    const updated = [...todayTasks];
    updated[index].completed = !updated[index].completed;
    setTodayTasks(updated);
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
        onFetch={fetchSuggestions}
      />
      {loading && <p>🚀 載入中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {noResult && <p style={{ color: 'gray' }}>😥 根據你目前的心情與時間，找不到合適的任務</p>}
      <SuggestionList suggestions={suggestions} onAdd={addToTodayTasks} />
      <TodayTaskList todayTasks={todayTasks} onToggle={toggleComplete} onRemove={removeTask} />
    </div>
  );
}

export default App;
