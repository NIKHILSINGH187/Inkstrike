# ⚡ INKSTRIKE ULTRA

> A 100x upgraded, ultra-high performance mechanical typing speed test engine with procedural switch audio synthesis, smooth gliding caret, deep analytics, and customizable cyber themes.

---

## 🚀 Features (What makes it 100x better)

### 🎨 8 Curated Aesthetics & Themes
- **Cyberpunk 2077**: Deep OLED dark, electric cyan, and hot magenta glow.
- **Obsidian**: Ultra-minimal matte dark slate with emerald accents.
- **Matrix Terminal**: Phosphor green monochrome with vintage CRT scanline overlay.
- **Dracula**: Iconic purple, pastel pink, and cyan highlights.
- **Nord**: Polar arctic blues and ice crystal tones.
- **Sakura**: Soft cherry blossom rose and delicate cream paper.
- **Synthwave**: 80s dusk violet and sunset amber.
- **Vintage Ink Remastered**: Textured aged parchment, deep archival ink, and wax seal stamps.

### 🔊 Procedural Web Audio Mechanical Sound Engine
*Zero audio files or download latency! Pure mathematical Web Audio synthesis.*
- **Lubed Linear Thock**: Deep, bass-heavy bottom-out impact.
- **Crisp Tactile Clicky**: Blue switch dual-stage spring click.
- **Vintage Typewriter**: Metallic striker impact + carriage return bell chime!
- **8-Bit Cyber**: Retro arcade synthesizer tone.
- **Mute / Quick Toggle**: Single key toggle (`Ctrl + M`).

### ⚡ Monkeytype-Grade Typing Mechanics
- **Smooth Gliding Caret**: Hardware-accelerated sub-pixel interpolated cursor movement (`transform: translate3d`) that slides smoothly between characters.
- **Caret Styles**: Smooth Line, Pulse Block, Underline, and Outline Box.
- **Dynamic Word Stream**: Automatically generates more words as you type with smooth scrolling viewport.
- **Real-Time Combo Multiplier**: Streak counter with fire / lightning tier badges (`10x`, `25x`, `50x GODLIKE`).
- **Interactive Sparks**: Particle sparks burst from your cursor as you maintain high accuracy.

### 🎮 6 Game Modes & Custom Modifiers
- **Time Challenge**: 15s, 30s, 60s, 120s.
- **Word Sprint**: 10, 25, 50, 100 words.
- **Quote Mode**: Real quotes from literature, philosophy, and tech icons with author attribution.
- **Code Mode**: Real syntax typing for JavaScript, Python, Rust, and SQL.
- **Zen Mode**: Timer-free, distraction-free flow typing.
- **Sudden Death Mode**: Instant restart upon a single error.
- **Modifiers**: Punctuation (`!?,.`) and Numbers (`0-9`) toggles.

### 📊 Deep Analytics & Heatmap
- **Interactive Canvas Graph**: Second-by-second timeline tracking Net WPM, Raw WPM, and error dots.
- **Consistency %**: Coefficient of variation calculation to measure typing rhythm smoothness.
- **Weak Keys Heatmap**: Automatically identifies and ranks the exact keys you mistyped.
- **Personal Best Tracker**: Automatically saved in `localStorage` with celebratory confetti on new records.
- **Shareable Result Badge**: 1-click formatted badge ready to paste into Discord or Twitter.

### ⌨️ Keyboard Shortcuts
- `Tab` + `Enter` or `Esc` — Instant restart.
- `Ctrl` + `K` — Open Command Palette.
- `Ctrl` + `M` — Toggle sound mute.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Modern CSS Variables + Glassmorphism + Native CSS Top-layer animations
- **Audio**: Web Audio API (real-time procedural oscillator & noise synthesis)
- **Visuals & Charts**: HTML5 Canvas API + Canvas Confetti
- **Icons**: Lucide React

---

## 📦 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/NIKHILSINGH187/Inkstrike.git
cd Inkstrike

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🚢 Deploying to GitHub Pages

This project comes pre-configured with:
1. **Automated GitHub Action**: `.github/workflows/deploy.yml` will automatically build and publish to GitHub Pages whenever you push to `main`.
2. **One-Command CLI Deploy**:
   ```bash
   npm run deploy
   ```

### Enabling GitHub Pages on your repository:
1. Go to your repo on GitHub: `https://github.com/NIKHILSINGH187/Inkstrike`
2. Click **Settings** → **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions** (or `Deploy from a branch` and choose `gh-pages` / `root`).
4. Your upgraded site will go live at: `https://nikhilsingh187.github.io/Inkstrike/`!
