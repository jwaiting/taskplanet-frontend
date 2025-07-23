// src/components/TaskForm.tsx
type Props = {
  mood: string;
  time: number;
  onMoodChange: (value: string) => void;
  onTimeChange: (value: number) => void;
  onFetch: () => void;
};

function TaskForm({ mood, time, onMoodChange, onTimeChange, onFetch }: Props) {
  return (
    <>
      <label>
        💡 心情：
        <select value={mood} onChange={(e) => onMoodChange(e.target.value)}>
          <option value="放鬆">放鬆</option>
          <option value="靜心">靜心</option>
          <option value="積極">積極</option>
        </select>
      </label>

      <br />
      <br />

      <label>
        ⏱️ 可用時間（分鐘）：
        <input
          type="number"
          value={time}
          onChange={(e) => onTimeChange(parseInt(e.target.value))}
          min={1}
        />
      </label>

      <br />
      <br />

      <button onClick={onFetch}>🎲 給我任務建議</button>
    </>
  );
}

export default TaskForm;
