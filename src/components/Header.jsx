import React from 'react';
import { 
  Keyboard, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Command, 
  Palette, 
  Sparkles,
  Zap
} from 'lucide-react';

export const THEMES = [
  { id: 'cyberpunk', name: 'Cyberpunk', color: '#00f0ff', secondary: '#ff007f' },
  { id: 'obsidian', name: 'Obsidian', color: '#10b981', secondary: '#3b82f6' },
  { id: 'matrix', name: 'Matrix', color: '#00ff66', secondary: '#040804' },
  { id: 'dracula', name: 'Dracula', color: '#bd93f9', secondary: '#ff79c6' },
  { id: 'nord', name: 'Nord', color: '#88c0d0', secondary: '#81a1c1' },
  { id: 'sakura', name: 'Sakura', color: '#e05374', secondary: '#fff8f8' },
  { id: 'synthwave', name: 'Synthwave', color: '#f43f5e', secondary: '#06b6d4' },
  { id: 'vintage-ink', name: 'Vintage Ink', color: '#8b1e0f', secondary: '#f4eee1' }
];

export function Header({
  theme,
  setTheme,
  soundProfile,
  setSoundProfile,
  soundMuted,
  toggleSoundMute,
  onOpenSettings,
  onOpenPalette
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 32px',
      maxWidth: '1240px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bg-primary)',
          boxShadow: '0 0 16px var(--accent-glow)'
        }}>
          <Zap size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>INKSTRIKE</span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              ULTRA
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Next-Gen Mechanical Typing Engine
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick Theme Swatch Picker */}
        <div className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px'
        }}>
          <Palette size={15} style={{ color: 'var(--text-secondary)', marginRight: '2px' }} />
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.name}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${t.color} 50%, ${t.secondary} 50%)`,
                border: theme === t.id ? '2px solid var(--text-primary)' : '1px solid rgba(255,255,255,0.15)',
                transform: theme === t.id ? 'scale(1.25)' : 'scale(1)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none'
              }}
            />
          ))}
        </div>

        {/* Sound Switcher */}
        <button
          onClick={toggleSoundMute}
          className="btn-pill"
          title={`Sound: ${soundMuted ? 'Muted' : soundProfile} (Ctrl+M)`}
        >
          {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span style={{ textTransform: 'capitalize' }}>
            {soundMuted ? 'Muted' : soundProfile}
          </span>
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenPalette}
          className="btn-pill"
          title="Command Palette (Ctrl + K)"
        >
          <Command size={14} />
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Ctrl K</span>
        </button>

        {/* Settings Drawer Button */}
        <button
          onClick={onOpenSettings}
          className="btn-pill"
          title="Settings"
        >
          <Sliders size={16} />
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/NIKHILSINGH187/Inkstrike"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill"
          title="View GitHub Repository"
          style={{ textDecoration: 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
    </header>
  );
}
