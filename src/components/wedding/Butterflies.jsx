import React, { useEffect, useRef, useState } from 'react';

/* ─── Butterfly SVG (two mirrored wings) ─── */
const ButterflyIcon = ({ color1, color2, glowColor }) => (
  <svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
    <defs>
      <radialGradient id={`lg1-${glowColor}`} cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor={color1} stopOpacity="1" />
        <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
      </radialGradient>
      <radialGradient id={`lg2-${glowColor}`} cx="60%" cy="40%" r="60%">
        <stop offset="0%" stopColor={color1} stopOpacity="1" />
        <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
      </radialGradient>
      <filter id={`glow-${glowColor}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Left upper wing */}
    <path
      d="M40 25 C30 10, 5 5, 8 20 C10 30, 28 32, 40 25Z"
      fill={`url(#lg1-${glowColor})`}
      filter={`url(#glow-${glowColor})`}
      opacity="0.92"
    />
    {/* Left lower wing */}
    <path
      d="M40 25 C28 32, 10 38, 12 48 C16 56, 34 44, 40 25Z"
      fill={`url(#lg1-${glowColor})`}
      filter={`url(#glow-${glowColor})`}
      opacity="0.75"
    />
    {/* Right upper wing */}
    <path
      d="M40 25 C50 10, 75 5, 72 20 C70 30, 52 32, 40 25Z"
      fill={`url(#lg2-${glowColor})`}
      filter={`url(#glow-${glowColor})`}
      opacity="0.92"
    />
    {/* Right lower wing */}
    <path
      d="M40 25 C52 32, 70 38, 68 48 C64 56, 46 44, 40 25Z"
      fill={`url(#lg2-${glowColor})`}
      filter={`url(#glow-${glowColor})`}
      opacity="0.75"
    />
    {/* Wing shimmer veins */}
    <path d="M40 25 C30 15, 15 10, 10 18" stroke={color1} strokeWidth="0.5" fill="none" opacity="0.5" />
    <path d="M40 25 C50 15, 65 10, 70 18" stroke={color1} strokeWidth="0.5" fill="none" opacity="0.5" />
    {/* Body */}
    <ellipse cx="40" cy="25" rx="1.5" ry="10" fill="#5c3d1e" opacity="0.8" />
    {/* Antennae */}
    <line x1="40" y1="16" x2="34" y2="8" stroke="#5c3d1e" strokeWidth="0.8" opacity="0.7" />
    <line x1="40" y1="16" x2="46" y2="8" stroke="#5c3d1e" strokeWidth="0.8" opacity="0.7" />
    <circle cx="34" cy="7" r="1.2" fill={color1} opacity="0.9" />
    <circle cx="46" cy="7" r="1.2" fill={color1} opacity="0.9" />
  </svg>
);

/* ─── Sparkle SVG ─── */
const SparkleSvg = ({ color }) => (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="sparkle-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g filter="url(#sparkle-glow)">
      {/* 4-point star */}
      <path d="M10 2 L11.2 8.8 L18 10 L11.2 11.2 L10 18 L8.8 11.2 L2 10 L8.8 8.8 Z" fill={color} />
      {/* Diagonal cross */}
      <path d="M5 5 L9.2 9.2 M10.8 10.8 L15 15 M15 5 L10.8 9.2 M9.2 10.8 L5 15"
        stroke={color} strokeWidth="0.6" opacity="0.5" />
    </g>
  </svg>
);

/* ─── Palette for butterflies ─── */
const BUTTERFLY_PALETTES = [
  { color1: '#f9c5d1', color2: '#e8a0b0', glowColor: 'pink', shadow: 'rgba(249,197,209,0.6)' },
  { color1: '#ffd700', color2: '#b8860b', glowColor: 'gold', shadow: 'rgba(255,215,0,0.6)' },
  { color1: '#e8c4f0', color2: '#c77dff', glowColor: 'lavender', shadow: 'rgba(232,196,240,0.6)' },
  { color1: '#fff0a0', color2: '#f0c040', glowColor: 'cream', shadow: 'rgba(255,240,160,0.6)' },
  { color1: '#c8e6ff', color2: '#90bce0', glowColor: 'sky', shadow: 'rgba(200,230,255,0.6)' },
];

const SPARKLE_COLORS = ['#ffd700', '#fff0c0', '#f9c5d1', '#e8c4f0', '#ffffff'];

/* ─── Seeded pseudo-random (deterministic positions) ─── */
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Generate butterfly configs ─── */
function generateButterflies(count) {
  const rand = seededRand(42);
  return Array.from({ length: count }, (_, i) => {
    const palette = BUTTERFLY_PALETTES[i % BUTTERFLY_PALETTES.length];
    const size = 40 + rand() * 40; // 40–80px
    const startX = rand() * 100;   // vw %
    const startY = 10 + rand() * 80; // vh %
    const duration = 12 + rand() * 18; // animation duration s
    const delay = rand() * 10;
    const amplitude = 80 + rand() * 120; // px horizontal drift
    const verticalDrift = -60 + rand() * 120;
    const flapSpeed = 0.3 + rand() * 0.4;
    return { id: i, ...palette, size, startX, startY, duration, delay, amplitude, verticalDrift, flapSpeed };
  });
}

/* ─── Generate sparkle configs ─── */
function generateSparkles(count) {
  const rand = seededRand(99);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: SPARKLE_COLORS[Math.floor(rand() * SPARKLE_COLORS.length)],
    size: 6 + rand() * 14,
    x: rand() * 100,
    y: rand() * 100,
    duration: 2 + rand() * 3,
    delay: rand() * 6,
  }));
}

const BUTTERFLIES = generateButterflies(12);
const SPARKLES = generateSparkles(30);

/* ─── Single Butterfly ─── */
function Butterfly({ cfg }) {
  const [flap, setFlap] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFlap(f => !f), cfg.flapSpeed * 1000);
    return () => clearInterval(interval);
  }, [cfg.flapSpeed]);

  const keyframes = `
    @keyframes fly-${cfg.id} {
      0%   { transform: translate(0px, 0px) rotate(-5deg); }
      25%  { transform: translate(${cfg.amplitude * 0.4}px, ${cfg.verticalDrift * 0.3}px) rotate(5deg); }
      50%  { transform: translate(${cfg.amplitude}px, ${cfg.verticalDrift}px) rotate(-3deg); }
      75%  { transform: translate(${cfg.amplitude * 0.6}px, ${cfg.verticalDrift * 0.6}px) rotate(4deg); }
      100% { transform: translate(0px, 0px) rotate(-5deg); }
    }
    @keyframes drift-y-${cfg.id} {
      0%, 100% { margin-top: 0px; }
      50%       { margin-top: ${-20 + (cfg.id % 5) * 8}px; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          position: 'fixed',
          left: `${cfg.startX}vw`,
          top: `${cfg.startY}vh`,
          width: cfg.size,
          height: cfg.size * 0.65,
          zIndex: 9,
          pointerEvents: 'none',
          animation: `fly-${cfg.id} ${cfg.duration}s ease-in-out ${cfg.delay}s infinite, drift-y-${cfg.id} ${cfg.duration * 0.6}s ease-in-out ${cfg.delay}s infinite`,
          filter: `drop-shadow(0 0 8px ${cfg.shadow}) drop-shadow(0 0 16px ${cfg.shadow})`,
          // Wing flap: scaleX on the whole butterfly gives a depth-flap illusion
          transform: `scaleX(${flap ? 1 : 0.35})`,
          transition: `transform ${cfg.flapSpeed * 0.9}s ease-in-out`,
        }}
      >
        <ButterflyIcon color1={cfg.color1} color2={cfg.color2} glowColor={cfg.glowColor} />
      </div>
    </>
  );
}

/* ─── Single Sparkle ─── */
function Sparkle({ cfg }) {
  const keyframes = `
    @keyframes sparkle-${cfg.id} {
      0%, 100% { opacity: 0; transform: scale(0.2) rotate(0deg); }
      30%       { opacity: 1; transform: scale(1) rotate(45deg); }
      60%       { opacity: 0.6; transform: scale(0.8) rotate(90deg); }
      80%       { opacity: 0; transform: scale(0.4) rotate(135deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          position: 'fixed',
          left: `${cfg.x}vw`,
          top: `${cfg.y}vh`,
          width: cfg.size,
          height: cfg.size,
          zIndex: 8,
          pointerEvents: 'none',
          animation: `sparkle-${cfg.id} ${cfg.duration}s ease-in-out ${cfg.delay}s infinite`,
          filter: `drop-shadow(0 0 4px ${cfg.color})`,
        }}
      >
        <SparkleSvg color={cfg.color} />
      </div>
    </>
  );
}

/* ─── Main Export ─── */
export default function Butterflies() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 8, overflow: 'hidden' }}>
      {SPARKLES.map(cfg => <Sparkle key={cfg.id} cfg={cfg} />)}
      {BUTTERFLIES.map(cfg => <Butterfly key={cfg.id} cfg={cfg} />)}
    </div>
  );
}
