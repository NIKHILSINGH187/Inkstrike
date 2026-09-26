import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { LiveStatsBar } from './components/LiveStatsBar';
import { TypingArea } from './components/TypingArea';
import { ResultModal } from './components/ResultModal';
import { CommandPalette } from './components/CommandPalette';
import { SettingsDrawer } from './components/SettingsDrawer';
import { ParticleCanvas } from './components/ParticleCanvas';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useDailyStreak } from './hooks/useDailyStreak';
import { soundEngine } from './audio/soundEngine';

export function App() {
  const { streak: dailyStreak, recordPlay } = useDailyStreak();
  // Persistent User Preferences
  const [theme, setTheme] = useLocalStorage('inkstrike_theme', 'cyberpunk');
  const [font, setFont] = useLocalStorage('inkstrike_font', 'jetbrains');
  const [caretStyle, setCaretStyle] = useLocalStorage('inkstrike_caret', 'line');
  const [soundProfile, setSoundProfile] = useLocalStorage('inkstrike_sound', 'thock');
  const [soundMuted, setSoundMuted] = useLocalStorage('inkstrike_muted', false);
  const [volume, setVolume] = useLocalStorage('inkstrike_volume', 0.5);
  const [particlesEnabled, setParticlesEnabled] = useLocalStorage('inkstrike_particles', true);
  const [screenShakeEnabled, setScreenShakeEnabled] = useLocalStorage('inkstrike_shake', true);
  const [personalBest, setPersonalBest] = useLocalStorage('inkstrike_pb', 0);

  // Test Mode & Modifiers
  const [mode, setMode] = useState('time');
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [quoteLength, setQuoteLength] = useState('all');
  const [codeLang, setCodeLang] = useState('all');
  const [learnLevel, setLearnLevel] = useLocalStorage('inkstrike_learn_level', 1);
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);

  // UI Modals
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const particleCanvasRef = useRef(null);
  const lastCaretPosRef = useRef({ x: 0, y: 0 });

  // Synchronize sound engine config with state
  useEffect(() => {
    soundEngine.setProfile(soundMuted ? 'off' : soundProfile);
    soundEngine.setVolume(volume);
  }, [soundProfile, soundMuted, volume]);

  // Set theme attribute and font on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Milestone streak callback (particles explosion)
  const handleStreakMilestone = useCallback((streakCount) => {
    if (particlesEnabled && particleCanvasRef.current) {
      particleCanvasRef.current.spawnBurst(
        window.innerWidth / 2,
        window.innerHeight / 2,
        30
      );
    }
  }, [particlesEnabled]);

  // Typing Engine
  const engine = useTypingEngine({
    mode,
    timeLimit,
    wordLimit,
    quoteLength,
    codeLang,
    learnLevel,
    punctuation,
    numbers,
    soundEnabled: !soundMuted,
    screenShakeEnabled,
    onStreakMilestone: handleStreakMilestone
  });

  // Track if a new PB was established
  const isNewPB = engine.status === 'finished' && engine.wpm > personalBest && engine.wpm > 20;
  useEffect(() => {
    if (isNewPB) {
      setPersonalBest(engine.wpm);
    }
  }, [isNewPB, engine.wpm, setPersonalBest]);

  // Record daily streak when a test finishes
  useEffect(() => {
    if (engine.status === 'finished' && engine.wpm > 5) {
      recordPlay();
    }
  }, [engine.status, engine.wpm, recordPlay]);

  // Trigger particle burst on correct keypress
  const handleInputWithParticles = (val) => {
    if (particlesEnabled && particleCanvasRef.current && val.length > engine.currentInput.length) {
      const { x, y } = lastCaretPosRef.current;
      particleCanvasRef.current.spawnBurst(x, y, 4);
    }
    engine.handleInput(val);
  };

  const handleCaretPositionUpdate = useCallback((x, y) => {
    lastCaretPosRef.current = { x, y };
  }, []);

  // Global Keyboard Shortcuts (Tab+Enter / Esc to restart, Ctrl+K for command palette, Ctrl+M for mute)
  useEffect(() => {
    let tabPressed = false;

    const handleKeyDown = (e) => {
      // Command palette: Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
        return;
      }

      // Sound mute: Ctrl + M
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setSoundMuted(prev => !prev);
        return;
      }

      // Restart: Esc
      if (e.key === 'Escape') {
        if (isPaletteOpen) {
          setIsPaletteOpen(false);
          return;
        }
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        e.preventDefault();
        engine.resetTest();
        return;
      }

      // Restart: Tab + Enter
      if (e.key === 'Tab') {
        tabPressed = true;
      }
      if (e.key === 'Enter' && tabPressed) {
        e.preventDefault();
        engine.resetTest();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Tab') {
        tabPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaletteOpen, isSettingsOpen, engine, setSoundMuted]);

  const toggleSoundMute = () => {
    setSoundMuted(prev => !prev);
  };

  return (
    <div className={`font-${font} ${engine.shake ? 'shake-active' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* CRT Scanline Overlay for Matrix theme */}
      <div className="crt-overlay" />

      {/* Particle Canvas Layer */}
      <ParticleCanvas ref={particleCanvasRef} />

      {/* Top Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
        soundMuted={soundMuted}
        toggleSoundMute={toggleSoundMute}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPalette={() => setIsPaletteOpen(true)}
        dailyStreak={dailyStreak}
      />

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px 20px 60px 20px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%'
      }}>
        {engine.status !== 'finished' ? (
          <>
            {/* Mode & Duration Selector */}
            <ModeSelector
              mode={mode}
              setMode={setMode}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              wordLimit={wordLimit}
              setWordLimit={setWordLimit}
              quoteLength={quoteLength}
              setQuoteLength={setQuoteLength}
              codeLang={codeLang}
              setCodeLang={setCodeLang}
              learnLevel={learnLevel}
              setLearnLevel={setLearnLevel}
              punctuation={punctuation}
              setPunctuation={setPunctuation}
              numbers={numbers}
              setNumbers={setNumbers}
              disabled={engine.status === 'running'}
            />

            {/* Live Stats Header (WPM, Time, Streak) */}
            <LiveStatsBar
              mode={mode}
              timeLeft={engine.timeLeft}
              elapsedSeconds={engine.elapsedSeconds}
              wpm={engine.wpm}
              accuracy={engine.accuracy}
              streak={engine.streak}
              currentWordIndex={engine.currentWordIndex}
              totalWords={engine.words.length}
            />

            {/* Interactive Word Typing Area */}
            <TypingArea
              words={engine.words}
              currentWordIndex={engine.currentWordIndex}
              currentInput={engine.currentInput}
              typedHistory={engine.typedHistory}
              status={engine.status}
              caretStyle={caretStyle}
              onInput={handleInputWithParticles}
              onRestart={engine.resetTest}
              quoteMeta={engine.quoteMeta}
              codeMeta={engine.codeMeta}
              mode={mode}
              onCaretPositionUpdate={handleCaretPositionUpdate}
            />
          </>
        ) : (
          /* Post-Test Analytics & Heatmap Modal */
          <ResultModal
            wpm={engine.wpm}
            rawWpm={engine.rawWpm}
            accuracy={engine.accuracy}
            consistency={engine.consistency}
            timeline={engine.timeline}
            weakKeys={engine.weakKeys}
            totalCharsTyped={engine.totalCharsTyped}
            correctCharsTyped={engine.correctCharsTyped}
            errorCharsTyped={engine.errorCharsTyped}
            elapsedSeconds={engine.elapsedSeconds}
            mode={mode}
            onRestart={engine.resetTest}
            personalBest={personalBest}
            isNewPersonalBest={isNewPB}
          />
        )}
      </main>

      {/* Floating Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '16px',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <span>Inkstrike Ultra v2.0 • Press </span>
        <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
          Ctrl + K
        </kbd>
        <span> for commands • </span>
        <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
          Ctrl + M
        </kbd>
        <span> to mute • </span>
        <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
          Tab + Enter
        </kbd>
        <span> to restart</span>
      </footer>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        setTheme={setTheme}
        setMode={setMode}
        setFont={setFont}
        setSoundProfile={setSoundProfile}
        onRestart={engine.resetTest}
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        font={font}
        setFont={setFont}
        caretStyle={caretStyle}
        setCaretStyle={setCaretStyle}
        soundProfile={soundProfile}
        setSoundProfile={setSoundProfile}
        volume={volume}
        setVolume={setVolume}
        particlesEnabled={particlesEnabled}
        setParticlesEnabled={setParticlesEnabled}
        screenShakeEnabled={screenShakeEnabled}
        setScreenShakeEnabled={setScreenShakeEnabled}
        onResetPB={() => setPersonalBest(0)}
      />
    </div>
  );
}
