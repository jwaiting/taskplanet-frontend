// src/components/TodayTaskList.tsx
type Task = {
  description: string;
  mood: string;
  minTime: number;
  completed?: boolean;
};

type Props = {
  todayTasks: Task[];
  onToggle: (index: number) => void;
};

function TodayTaskList({ todayTasks, onToggle }: Props) {
  if (todayTasks.length === 0) return null;

  return (
    <>
      <h2>📋 今日任務清單</h2>
      <ul>
        {todayTasks.map((task, i) => (
          <li key={i}>
            <button onClick={() => onToggle(i)}>{task.completed ? '✅' : '⬜'}</button>{' '}
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'black',
              }}
            >
              {task.description}（{task.minTime} 分鐘）
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TodayTaskList;
