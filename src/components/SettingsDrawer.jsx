import React from 'react';
import { X, Volume2, Sliders, Sparkles, Monitor, Type, Palette, Trash2 } from 'lucide-react';
import { THEMES } from './Header';

export function SettingsDrawer({
  isOpen,
  onClose,
  theme,
  setTheme,
  font,
  setFont,
  caretStyle,
  setCaretStyle,
  soundProfile,
  setSoundProfile,
  volume,
  setVolume,
  particlesEnabled,
  setParticlesEnabled,
  screenShakeEnabled,
  setScreenShakeEnabled,
  onResetPB
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 90,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass-panel-elevated modal-overlay"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100vh',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          borderRadius: '16px 0 0 16px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-pill"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Theme Palette */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Palette size={16} />
            <span>Theme</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`btn-pill ${theme === t.id ? 'active' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  padding: '8px 12px',
                  width: '100%'
                }}
              >
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: t.color,
                  boxShadow: `0 0 6px ${t.color}`
                }} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Typography / Font */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Type size={16} />
            <span>Typography</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {[
              { id: 'jetbrains', label: 'JetBrains Mono' },
              { id: 'fira', label: 'Fira Code' },
              { id: 'space', label: 'Space Mono' },
              { id: 'vintage', label: 'Special Elite' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFont(f.id)}
                className={`btn-pill ${font === f.id ? 'active' : ''}`}
                style={{ justifyContent: 'center', padding: '8px', width: '100%' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Caret Style */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Monitor size={16} />
            <span>Caret Style</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {[
              { id: 'line', label: 'Smooth Line' },
              { id: 'block', label: 'Pulse Block' },
              { id: 'underline', label: 'Underline' },
              { id: 'box', label: 'Outline Box' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setCaretStyle(c.id)}
                className={`btn-pill ${caretStyle === c.id ? 'active' : ''}`}
                style={{ justifyContent: 'center', padding: '8px', width: '100%' }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Audio Engine */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Volume2 size={16} />
            <span>Mechanical Switch Audio</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
            {[
              { id: 'thock', label: 'Lubed Thock' },
              { id: 'clicky', label: 'Crisp Clicky' },
              { id: 'typewriter', label: 'Typewriter' },
              { id: 'cyber', label: '8-Bit Arcade' },
              { id: 'off', label: 'Muted' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSoundProfile(s.id)}
                className={`btn-pill ${soundProfile === s.id ? 'active' : ''}`}
                style={{ justifyContent: 'center', padding: '8px', width: '100%' }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: '6px', accentColor: 'var(--accent)' }}
          />
        </div>

        {/* 5. Visual FX Toggles */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Sparkles size={16} />
            <span>Visual Effects</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem' }}>
              <span>Keystroke Particle Sparks</span>
              <input
                type="checkbox"
                checked={particlesEnabled}
                onChange={e => setParticlesEnabled(e.target.checked)}
                style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.85rem' }}>
              <span>Screen Shake on Error</span>
              <input
                type="checkbox"
                checked={screenShakeEnabled}
                onChange={e => setScreenShakeEnabled(e.target.checked)}
                style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
              />
            </label>
          </div>
        </div>

        {/* Reset Personal Best */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onResetPB}
            className="btn-pill"
            style={{ width: '100%', justifyContent: 'center', color: 'var(--char-error)', borderColor: 'rgba(255, 51, 102, 0.2)' }}
          >
            <Trash2 size={15} />
            <span>Reset Personal Best</span>
          </button>
        </div>
      </div>
    </div>
  );
}
