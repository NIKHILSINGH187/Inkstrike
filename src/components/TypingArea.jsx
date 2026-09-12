import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';

export function TypingArea({
  words,
  currentWordIndex,
  currentInput,
  typedHistory,
  status,
  caretStyle = 'line',
  onInput,
  onRestart,
  quoteMeta,
  codeMeta,
  mode,
  onCaretPositionUpdate
}) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const activeCharRef = useRef(null);
  const activeWordRef = useRef(null);

  const [caretPos, setCaretPos] = useState({ x: 0, y: 0, width: 2, height: 32 });
  const [isFocused, setIsFocused] = useState(true);

  // Auto-focus input on mount and whenever clicking the typing container
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Compute Caret Position based on active character element
  useEffect(() => {
    if (!containerRef.current) return;

    let targetElem = activeCharRef.current;
    if (!targetElem && activeWordRef.current) {
      // If at end of word or starting a word with no char yet
      targetElem = activeWordRef.current;
    }

    if (targetElem && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = targetElem.getBoundingClientRect();

      let x = targetRect.left - containerRect.left;
      let y = targetRect.top - containerRect.top;
      let width = 2;
      let height = targetRect.height || 32;

      // If at the end of word or targeting character directly
      if (activeCharRef.current) {
        if (caretStyle === 'block' || caretStyle === 'box') {
          width = targetRect.width || 12;
        } else if (caretStyle === 'underline') {
          width = targetRect.width || 12;
          height = 3;
          y += targetRect.height - 3;
        }
      } else if (activeWordRef.current && currentInput.length > 0) {
        // Position at the end of the active word
        x = (targetRect.right - containerRect.left);
      }

      const newPos = { x, y, width, height };
      setCaretPos(newPos);

      if (onCaretPositionUpdate) {
        onCaretPositionUpdate(targetRect.left + width / 2, targetRect.top + height / 2);
      }
    }
  }, [currentWordIndex, currentInput, words, caretStyle, onCaretPositionUpdate]);

  // Keep active line scrolled into view
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const wordTop = activeWordRef.current.offsetTop;
      // Keep within comfortable 3-line viewing window
      if (wordTop > 70) {
        containerRef.current.scrollTop = wordTop - 40;
      } else {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [currentWordIndex]);

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
      position: 'relative'
    }}>
      {/* Hidden Accessible Input capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => onInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Focus Lost Notification */}
      {!isFocused && status !== 'finished' && (
        <div
          onClick={handleContainerClick}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--bg-overlay)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            backdropFilter: 'blur(4px)',
            borderRadius: '12px',
            cursor: 'pointer',
            gap: '8px'
          }}
        >
          <AlertCircle size={28} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Click or press any key to focus
          </span>
        </div>
      )}

      {/* Words Container */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="glass-panel"
        style={{
          minHeight: '160px',
          maxHeight: '170px',
          overflowY: 'hidden',
          padding: '28px 32px',
          position: 'relative',
          lineHeight: '2.4rem',
          fontSize: '1.5rem',
          letterSpacing: '0.04em',
          cursor: 'text',
          userSelect: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {/* Smooth Gliding Caret */}
        {isFocused && (
          <div
            className={`caret-cursor style-${caretStyle} ${status === 'idle' ? 'is-blinking' : ''}`}
            style={{
              transform: `translate3d(${caretPos.x}px, ${caretPos.y}px, 0)`,
              width: `${caretPos.width}px`,
              height: `${caretPos.height}px`
            }}
          />
        )}

        {/* Word Stream */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px' }}>
          {words.map((word, wIdx) => {
            const isCurrent = wIdx === currentWordIndex;
            const isPast = wIdx < currentWordIndex;
            const pastRecord = typedHistory[wIdx];

            return (
              <span
                key={wIdx}
                ref={isCurrent ? activeWordRef : null}
                style={{
                  display: 'inline-flex',
                  position: 'relative',
                  marginBottom: '6px'
                }}
              >
                {word.split('').map((char, cIdx) => {
                  let charClass = 'char-pending';
                  const isCharActive = isCurrent && cIdx === currentInput.length;

                  if (isPast) {
                    if (pastRecord) {
                      const typedChar = pastRecord.typed[cIdx];
                      charClass = typedChar === char ? 'char-correct' : 'char-error';
                    }
                  } else if (isCurrent) {
                    if (cIdx < currentInput.length) {
                      const typedChar = currentInput[cIdx];
                      charClass = typedChar === char ? 'char-correct' : 'char-error';
                    }
                  }

                  return (
                    <span
                      key={cIdx}
                      ref={isCharActive ? activeCharRef : null}
                      className={charClass}
                      style={{ position: 'relative' }}
                    >
                      {char}
                    </span>
                  );
                })}

                {/* Render extra mistyped characters if user typed beyond word length */}
                {isCurrent && currentInput.length > word.length && (
                  <span className="char-extra">
                    {currentInput.slice(word.length)}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Meta Footer: Quote attribution, Code badge, Restart hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        padding: '0 8px',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        {/* Left Meta Tag */}
        <div>
          {mode === 'quote' && quoteMeta && (
            <div style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>
              — {quoteMeta.author}
            </div>
          )}
          {mode === 'code' && codeMeta && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'var(--bg-tertiary)',
              color: 'var(--accent)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              <span>{codeMeta.language}</span>
              <span style={{ opacity: 0.6 }}>•</span>
              <span style={{ color: 'var(--text-secondary)' }}>{codeMeta.title}</span>
            </div>
          )}
        </div>

        {/* Quick Restart Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onRestart}
            className="btn-pill"
            style={{ padding: '6px 14px' }}
            title="Restart Test (Tab + Enter)"
          >
            <RotateCcw size={14} />
            <span>Restart</span>
          </button>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            or press <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-tertiary)' }}>Tab</kbd> + <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-tertiary)' }}>Enter</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
