import { useState } from 'react';
import type { Suggestion } from '../hooks/useSuggestion';

type Props = {
  onSubmit: (customTask: Suggestion) => Promise<void>;
};

function CustomSuggestionForm({ onSubmit }: Props) {
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('');
  const [minTime, setMinTime] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description || !mood || minTime <= 0) return;

    const newSuggestion: Suggestion = {
      description,
      mood,
      minTime,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(newSuggestion); // ✅ 傳給 App.tsx 的 handler
      alert('已送出建議，感謝你的回饋！');

      // 清空輸入欄
      setDescription('');
      setMood('');
      setMinTime(5);
    } catch (err) {
      alert('提交失敗，請稍後再試');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>👤 沒有喜歡的？來填一個吧</h3>
      <input
        type="text"
        placeholder="任務描述"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        type="text"
        placeholder="心情（例：專注）"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        type="number"
        min="1"
        placeholder="時間（分鐘）"
        value={minTime}
        onChange={(e) => setMinTime(parseInt(e.target.value))}
        style={{ marginRight: '0.5rem', width: '5rem' }}
      />
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '送出任務建議'}
      </button>
    </div>
  );
}

export default CustomSuggestionForm;
