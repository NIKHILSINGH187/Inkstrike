import React, { useEffect, useRef, useState } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Copy, 
  Check, 
  Share2, 
  TrendingUp, 
  Zap, 
  Flame, 
  Target, 
  AlertTriangle 
} from 'lucide-react';

export function ResultModal({
  wpm,
  rawWpm,
  accuracy,
  consistency,
  timeline,
  weakKeys,
  totalCharsTyped,
  correctCharsTyped,
  errorCharsTyped,
  elapsedSeconds,
  mode,
  onRestart,
  personalBest,
  isNewPersonalBest
}) {
  const chartRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Render Canvas Chart for WPM and Error timeline
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas || timeline.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxWpm = Math.max(60, ...timeline.map(d => Math.max(d.wpm, d.raw))) + 10;
    const totalSecs = Math.max(timeline.length, 1);

    // Draw horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = Math.round((maxWpm / gridSteps) * i);
      const y = padding.top + chartH - (yVal / maxWpm) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(yVal.toString(), padding.left - 8, y + 3);
    }

    // Draw Raw WPM Line
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    timeline.forEach((pt, idx) => {
      const x = padding.left + (idx / (totalSecs - 1 || 1)) * chartW;
      const y = padding.top + chartH - (pt.raw / maxWpm) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]); // reset dash

    // Draw Net WPM Line with Fill Gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

    ctx.beginPath();
    timeline.forEach((pt, idx) => {
      const x = padding.left + (idx / (totalSecs - 1 || 1)) * chartW;
      const y = padding.top + chartH - (pt.wpm / maxWpm) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under Net WPM curve
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Plot Error dots (Red dots on timeline)
    timeline.forEach((pt, idx) => {
      if (pt.errors > 0) {
        const x = padding.left + (idx / (totalSecs - 1 || 1)) * chartW;
        const y = padding.top + chartH - 4;

        ctx.fillStyle = '#ff3366';
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

  }, [timeline]);

  // Copy result badge to clipboard
  const handleCopyResult = () => {
    const text = `⚡ INKSTRIKE ULTRA RESULT ⚡\nMode: ${mode.toUpperCase()} | Duration: ${elapsedSeconds}s\nWPM: ${wpm} (Raw: ${rawWpm})\nAccuracy: ${accuracy}%\nConsistency: ${consistency}%\nhttps://nikhilsingh187.github.io/Inkstrike/`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const weakKeyList = Object.entries(weakKeys).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* New Personal Best Banner */}
      {isNewPersonalBest && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, rgba(255, 230, 0, 0.15), rgba(255, 0, 127, 0.15))',
          border: '1px solid var(--accent-tertiary)',
          color: 'var(--accent-tertiary)',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: '1px'
        }}>
          <Trophy size={18} />
          <span>NEW PERSONAL BEST RECORD!</span>
        </div>
      )}

      {/* Hero Stats & Summary Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {/* Left: Huge WPM and Acc */}
        <div className="glass-panel" style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '16px',
          textAlign: 'left'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              NET SPEED
            </div>
            <div style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              lineHeight: 1,
              color: 'var(--accent)',
              textShadow: '0 0 20px var(--accent-glow)',
              letterSpacing: '-2px'
            }}>
              {wpm}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              words per minute
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              ACCURACY
            </div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 700,
              lineHeight: 1,
              color: accuracy >= 95 ? 'var(--text-primary)' : 'var(--accent-secondary)'
            }}>
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Right: Detailed Metric Matrix */}
        <div className="glass-panel" style={{
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          alignContent: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>RAW SPEED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
              {rawWpm}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WPM</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>CONSISTENCY</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {consistency}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>smoothness</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>TIME</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {elapsedSeconds}s
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>duration</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>CHARACTERS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--char-correct)' }}>{correctCharsTyped}</span>/
              <span style={{ color: 'var(--char-error)' }}>{errorCharsTyped}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>correct / err</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>BEST RECORD</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-tertiary)' }}>
              {Math.max(personalBest || 0, wpm)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PB WPM</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>MODE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'capitalize' }}>
              {mode}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>challenge</div>
          </div>
        </div>
      </div>

      {/* Interactive Canvas Graph */}
      {timeline.length > 1 && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              PERFORMANCE TIMELINE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff' }} />
                Net WPM
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff007f' }} />
                Raw WPM
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff3366' }} />
                Errors
              </span>
            </div>
          </div>
          <canvas
            ref={chartRef}
            style={{ width: '100%', height: '180px', display: 'block' }}
          />
        </div>
      )}

      {/* Weak Keys Heatmap */}
      {weakKeyList.length > 0 && (
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '10px'
          }}>
            <AlertTriangle size={15} style={{ color: 'var(--char-error)' }} />
            <span>WEAK KEYS HEATMAP (Keys to Practice)</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {weakKeyList.map(([key, count]) => (
              <div
                key={key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'var(--char-error-bg)',
                  border: '1px solid var(--char-error)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <span style={{ color: 'var(--text-primary)' }}>{key.toUpperCase()}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--char-error)' }}>{count} err</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '8px' }}>
        <button
          onClick={onRestart}
          className="btn-pill active"
          style={{ padding: '10px 24px', fontSize: '0.92rem' }}
          title="Start Next Test (Tab + Enter)"
        >
          <RotateCcw size={16} />
          <span>Next Test (Tab + Enter)</span>
        </button>

        <button
          onClick={handleCopyResult}
          className="btn-pill"
          style={{ padding: '10px 20px', fontSize: '0.92rem' }}
          title="Copy result to clipboard"
        >
          {copied ? <Check size={16} style={{ color: 'var(--accent)' }} /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : 'Copy Result'}</span>
        </button>
      </div>
    </div>
  );
}
