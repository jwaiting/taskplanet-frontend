import { useEffect, useState } from 'react';

type Task = {
  description: string;
  mood: string;
  minTime: number;
  completed?: boolean;
};

export function useTaskManager() {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [isReady, setIsReady] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const storageKey = `taskplanet-today-${today}`;

  // ✅ Step 1: 清除不是今天的 task 開頭的 localStorage
  useEffect(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('taskplanet-today-') && key !== storageKey) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // ✅ Step 2: 載入今天的任務
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setTodayTasks(JSON.parse(saved));
      } catch {
        console.warn('⚠️ localStorage 讀取錯誤');
      }
    }
    setIsReady(true);
  }, []);

  // ✅ Step 3: 寫入今天的任務
  useEffect(() => {
    if (isReady) {
      localStorage.setItem(storageKey, JSON.stringify(todayTasks));
    }
  }, [todayTasks, isReady]);

  const addTask = (task: Task) => {
    if (!todayTasks.find((t) => t.description === task.description)) {
      setTodayTasks([...todayTasks, { ...task, completed: false }]);
    }
  };

  const toggleComplete = (desc: string) => {
    const updated = todayTasks.map((task) =>
      task.description === desc ? { ...task, completed: !task.completed } : task,
    );
    setTodayTasks(updated);
  };

  const removeTask = (desc: string) => {
    setTodayTasks(todayTasks.filter((task) => task.description !== desc));
  };

  return {
    todayTasks,
    addTask,
    toggleComplete,
    removeTask,
    isReady,
  };
}
