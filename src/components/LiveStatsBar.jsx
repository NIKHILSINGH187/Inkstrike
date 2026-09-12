import React from 'react';
import { Flame, Target, Gauge, Timer } from 'lucide-react';

export function LiveStatsBar({
  mode,
  timeLeft,
  elapsedSeconds,
  wpm,
  accuracy,
  streak,
  currentWordIndex,
  totalWords
}) {
  const getStreakTier = (s) => {
    if (s >= 50) return { color: '#ff007f', label: 'GODLIKE', glow: '0 0 16px #ff007f' };
    if (s >= 25) return { color: '#ffe600', label: 'ON FIRE', glow: '0 0 12px #ffe600' };
    if (s >= 10) return { color: '#00f0ff', label: 'HEATING UP', glow: '0 0 8px #00f0ff' };
    return null;
  };

  const streakTier = getStreakTier(streak);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '850px',
      margin: '0 auto 16px auto',
      width: '100%',
      padding: '0 8px'
    }}>
      {/* Time or Word Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          color: 'var(--accent)',
          fontWeight: 700,
          fontSize: '1.8rem',
          letterSpacing: '-1px'
        }}>
          {mode === 'time' || mode === 'sudden_death' ? (
            <span>{timeLeft}s</span>
          ) : mode === 'words' ? (
            <span>{currentWordIndex}/{totalWords}</span>
          ) : (
            <span>{elapsedSeconds}s</span>
          )}
        </div>
      </div>

      {/* Live Metrics Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Streak Flame Badge */}
        {streak >= 5 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '16px',
            background: 'var(--bg-elevated)',
            border: `1px solid ${streakTier ? streakTier.color : 'var(--border-color)'}`,
            boxShadow: streakTier ? streakTier.glow : 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: streakTier ? streakTier.color : 'var(--accent)'
          }}>
            <Flame size={15} />
            <span>{streak}x</span>
            {streakTier && (
              <span style={{ fontSize: '0.65rem', opacity: 0.85, marginLeft: '2px' }}>
                {streakTier.label}
              </span>
            )}
          </div>
        )}

        {/* Live Accuracy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <Target size={15} />
          <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {accuracy}%
          </span>
        </div>

        {/* Live WPM */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <Gauge size={15} />
          <span style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--accent)',
            textShadow: '0 0 10px var(--accent-glow)'
          }}>
            {wpm}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            WPM
          </span>
        </div>
      </div>
    </div>
  );
}
