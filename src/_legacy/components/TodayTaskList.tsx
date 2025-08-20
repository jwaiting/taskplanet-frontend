// src/components/TodayTaskList.tsx
type Task = {
  description: string;
  mood: string;
  minTime: number;
  completed?: boolean;
};

type Props = {
  todayTasks: Task[];
  onToggle: (desc: string) => void;
  onRemove: (desc: string) => void;
};

function TodayTaskList({ todayTasks, onToggle, onRemove }: Props) {
  if (todayTasks.length === 0) return null;

  return (
    <>
      <h2>📋 今日任務清單</h2>
      <ul>
        {todayTasks.map((task) => (
          <li key={task.description}>
            <button onClick={() => onToggle(task.description)}>
              {task.completed ? '✅' : '⬜'}
            </button>{' '}
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'black',
              }}
            >
              {task.description}（{task.minTime} 分鐘）
            </span>
            <button onClick={() => onRemove(task.description)} style={{ marginLeft: '0.5rem' }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TodayTaskList;
