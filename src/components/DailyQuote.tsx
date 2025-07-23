// src/components/DailyQuote.tsx
import { useEffect, useState } from 'react';

const quotes = [
  '今天，是個重新開始的好日子。',
  '完成一件小事，也是一種勝利。',
  '此刻的你，已經足夠。',
  '如果今天是你人生最後一天，你會怎麼安排它？',
  '把今天過好，就已經很了不起了。',
];

function getTodayKey() {
  const today = new Date().toISOString().split('T')[0]; // e.g. "2025-07-23"
  return `daily-quote-${today}`;
}

export default function DailyQuote() {
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem(todayKey);

    if (saved) {
      setQuote(saved);
    } else {
      const random = quotes[Math.floor(Math.random() * quotes.length)];
      localStorage.setItem(todayKey, random);
      setQuote(random);
    }
  }, []);

  if (!quote) return null;

  return (
    <div
      style={{
        background: '#f9f5ef',
        borderRadius: '1rem',
        padding: '1.5rem',
        fontStyle: 'italic',
        fontSize: '1.2rem',
        color: '#4e4e4e',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      🌱 {quote}
    </div>
  );
}
