import { useState, useEffect } from 'react';

export function useDailyStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const storedStreak = parseInt(localStorage.getItem('inkstrike_daily_streak') || '0', 10);
    const storedDate = localStorage.getItem('inkstrike_last_play');

    if (storedDate) {
      const lastDate = new Date(storedDate);
      const today = new Date();
      
      lastDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        setStreak(storedStreak);
      } else {
        setStreak(0);
        localStorage.setItem('inkstrike_daily_streak', '0');
      }
    }
  }, []);

  const recordPlay = () => {
    const storedDate = localStorage.getItem('inkstrike_last_play');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let newStreak = streak;

    if (!storedDate) {
       newStreak = 1;
    } else {
      const lastDate = new Date(storedDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
         newStreak = streak + 1;
      } else if (diffDays > 1) {
         newStreak = 1;
      }
    }

    setStreak(newStreak);
    localStorage.setItem('inkstrike_daily_streak', newStreak.toString());
    localStorage.setItem('inkstrike_last_play', new Date().toISOString());
  };

  return { streak, recordPlay };
}
