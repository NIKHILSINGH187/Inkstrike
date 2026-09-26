import React from 'react';
import { Clock, Type, Quote, Code2, Feather, Skull, Hash, AtSign, Target } from 'lucide-react';

export function ModeSelector({
  mode,
  setMode,
  timeLimit,
  setTimeLimit,
  wordLimit,
  setWordLimit,
  quoteLength,
  setQuoteLength,
  codeLang,
  setCodeLang,
  learnLevel,
  setLearnLevel,
  punctuation,
  setPunctuation,
  numbers,
  setNumbers,
  disabled
}) {
  const modes = [
    { id: 'learn', label: 'Learn', icon: Target },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'words', label: 'Words', icon: Type },
    { id: 'quote', label: 'Quote', icon: Quote },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'zen', label: 'Zen', icon: Feather },
    { id: 'sudden_death', label: 'Sudden Death', icon: Skull }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      margin: '16px auto 24px auto',
      width: '100%',
      maxWidth: '850px'
    }}>
      {/* Primary Mode Pills */}
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px',
        borderRadius: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {modes.map(m => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              disabled={disabled}
              className={`btn-pill ${isActive ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-options Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* Learn Mode Sub-options */}
        {mode === 'learn' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(lvl => (
              <button
                key={lvl}
                onClick={() => setLearnLevel(lvl)}
                className={`btn-pill ${learnLevel === lvl ? 'active' : ''}`}
                style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        )}

        {/* Time Mode Sub-options */}
        {mode === 'time' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[15, 30, 60, 120].map(sec => (
              <button
                key={sec}
                onClick={() => setTimeLimit(sec)}
                className={`btn-pill ${timeLimit === sec ? 'active' : ''}`}
                style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              >
                {sec}s
              </button>
            ))}
          </div>
        )}

        {/* Words Mode Sub-options */}
        {mode === 'words' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[10, 25, 50, 100].map(cnt => (
              <button
                key={cnt}
                onClick={() => setWordLimit(cnt)}
                className={`btn-pill ${wordLimit === cnt ? 'active' : ''}`}
                style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              >
                {cnt}
              </button>
            ))}
          </div>
        )}

        {/* Quote Mode Sub-options */}
        {mode === 'quote' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {['all', 'short', 'medium', 'long'].map(len => (
              <button
                key={len}
                onClick={() => setQuoteLength(len)}
                className={`btn-pill ${quoteLength === len ? 'active' : ''}`}
                style={{ padding: '3px 10px', fontSize: '0.75rem', textTransform: 'capitalize' }}
              >
                {len}
              </button>
            ))}
          </div>
        )}

        {/* Code Mode Sub-options */}
        {mode === 'code' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {['all', 'JavaScript', 'Python', 'Rust', 'SQL'].map(lang => (
              <button
                key={lang}
                onClick={() => setCodeLang(lang)}
                className={`btn-pill ${codeLang === lang ? 'active' : ''}`}
                style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* Modifiers (Punctuation & Numbers) */}
        {(mode === 'time' || mode === 'words' || mode === 'zen') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px' }}>
            <button
              onClick={() => setPunctuation(!punctuation)}
              className={`btn-pill ${punctuation ? 'active' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              title="Include punctuation marks"
            >
              <AtSign size={12} />
              <span>punctuation</span>
            </button>
            <button
              onClick={() => setNumbers(!numbers)}
              className={`btn-pill ${numbers ? 'active' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
              title="Include numbers"
            >
              <Hash size={12} />
              <span>numbers</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
