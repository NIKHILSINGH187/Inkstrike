/**
 * Inkstrike Ultra Procedural Audio Engine
 * High-performance Web Audio API synthesizer for mechanical switches,
 * typewriter strikes, return bells, and error clunks with zero external audio assets.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.5; // 0.0 to 1.0
    this.enabled = true;
    this.profile = 'thock'; // 'thock' | 'clicky' | 'typewriter' | 'cyber' | 'off'
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  setProfile(profile) {
    this.profile = profile;
    this.enabled = profile !== 'off';
  }

  toggleMute() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playKey(isError = false) {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    if (isError) {
      this.playErrorClunk();
      return;
    }

    switch (this.profile) {
      case 'thock':
        this.playThock();
        break;
      case 'clicky':
        this.playClicky();
        break;
      case 'typewriter':
        this.playTypewriter();
        break;
      case 'cyber':
        this.playCyber();
        break;
      default:
        break;
    }
  }

  // --- Profile 1: Deep Thock (Lubed Linear / Holy Panda) ---
  playThock() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Random pitch micro-variation for realistic typing feel
    const pitchJitter = (Math.random() - 0.5) * 20;
    const baseFreq = 160 + pitchJitter;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.035);

    // Lowpass filter for deep thud
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    // Subtle noise burst for key contact
    this.playNoiseBurst(now, 0.015, 800, this.volume * 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // --- Profile 2: Crisp Clicky (Cherry MX Blue / Kailh Box White) ---
  playClicky() {
    const now = this.ctx.currentTime;
    const pitchJitter = (Math.random() - 0.5) * 150;

    // High frequency click transient
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200 + pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.012);

    gain.gain.setValueAtTime(this.volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);

    // Secondary spring snap click
    setTimeout(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1400 + pitchJitter, t);
      osc2.frequency.exponentialRampToValueAtTime(300, t + 0.02);
      gain2.gain.setValueAtTime(this.volume * 0.5, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.03);
    }, 8);
  }

  // --- Profile 3: Vintage Typewriter Hammer ---
  playTypewriter() {
    const now = this.ctx.currentTime;
    const pitchJitter = (Math.random() - 0.5) * 40;

    // Heavy mechanical platen impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380 + pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(this.volume * 0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    // Metallic latch click
    this.playNoiseBurst(now, 0.02, 2200, this.volume * 0.5);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  // --- Profile 4: Cyber Arcade Tone ---
  playCyber() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // --- Noise Burst Helper for mechanical texture ---
  playNoiseBurst(now, duration, filterFreq, volume) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // --- Error Feedback: Muted Clunk ---
  playErrorClunk() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.07);

    gain.gain.setValueAtTime(this.volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // --- Typewriter Carriage Return Bell (Played on Test Complete) ---
  playBell() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Harmonic chime with multiple crystal sines
    const harmonics = [2093.00, 3135.96, 4186.01]; // C7 chime triad
    harmonics.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = (this.volume * 0.7) / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    });
  }
}

export const soundEngine = new SoundEngine();
