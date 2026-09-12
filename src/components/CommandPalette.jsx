import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Palette, Clock, Type, Code2, Feather, Volume2, Type as FontIcon, RotateCcw } from 'lucide-react';
import { THEMES } from './Header';

export function CommandPalette({
  isOpen,
  onClose,
  setTheme,
  setMode,
  setFont,
  setSoundProfile,
  onRestart
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const actions = [
    // Theme options
    ...THEMES.map(t => ({
      id: `theme-${t.id}`,
      title: `Theme: ${t.name}`,
      category: 'Themes',
      icon: Palette,
      run: () => setTheme(t.id)
    })),
    // Mode options
    { id: 'mode-time', title: 'Mode: Time Challenge (30s)', category: 'Modes', icon: Clock, run: () => setMode('time') },
    { id: 'mode-words', title: 'Mode: Words (25 words)', category: 'Modes', icon: Type, run: () => setMode('words') },
    { id: 'mode-quote', title: 'Mode: Literary Quotes', category: 'Modes', icon: Feather, run: () => setMode('quote') },
    { id: 'mode-code', title: 'Mode: Code Syntax', category: 'Modes', icon: Code2, run: () => setMode('code') },
    { id: 'mode-zen', title: 'Mode: Zen Flow', category: 'Modes', icon: Feather, run: () => setMode('zen') },
    // Sounds
    { id: 'sound-thock', title: 'Sound: Lubed Linear Thock', category: 'Audio', icon: Volume2, run: () => setSoundProfile('thock') },
    { id: 'sound-clicky', title: 'Sound: Clicky Blue Switch', category: 'Audio', icon: Volume2, run: () => setSoundProfile('clicky') },
    { id: 'sound-typewriter', title: 'Sound: Vintage Typewriter', category: 'Audio', icon: Volume2, run: () => setSoundProfile('typewriter') },
    { id: 'sound-cyber', title: 'Sound: 8-Bit Cyber Arcade', category: 'Audio', icon: Volume2, run: () => setSoundProfile('cyber') },
    // Fonts
    { id: 'font-jetbrains', title: 'Font: JetBrains Mono', category: 'Typography', icon: FontIcon, run: () => setFont('jetbrains') },
    { id: 'font-fira', title: 'Font: Fira Code', category: 'Typography', icon: FontIcon, run: () => setFont('fira') },
    { id: 'font-space', title: 'Font: Space Mono', category: 'Typography', icon: FontIcon, run: () => setFont('space') },
    { id: 'font-vintage', title: 'Font: Special Elite Typewriter', category: 'Typography', icon: FontIcon, run: () => setFont('vintage') },
    // Restart
    { id: 'action-restart', title: 'Restart Test', category: 'Actions', icon: RotateCcw, run: onRestart }
  ];

  const filtered = actions.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].run();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass-panel-elevated modal-overlay"
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Search size={18} style={{ color: 'var(--accent)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, theme, mode, or font..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No commands found
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-color)' : '1px solid transparent',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} style={{ color: isSelected ? 'var(--accent)' : 'inherit' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: isSelected ? 600 : 400 }}>
                      {item.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-secondary)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Navigate: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select: <kbd>Enter</kbd></span>
          <span>Close: <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
