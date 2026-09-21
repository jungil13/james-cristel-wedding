import React, { useState, useEffect, useRef } from 'react';

const MUSIC_SRC = '/music/bgmusic.mp3';

export default function MusicPlayer({ autoPlayTrigger }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef(null);

  /* ── Init audio ───────────────────────────────────────── */
  useEffect(() => {
    const audio  = new Audio(MUSIC_SRC);
    audio.loop   = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.addEventListener('play',  () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  /* ── Auto-play after envelope opens ──────────────────── */
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    isPlaying ? a.pause() : a.play().catch(() => {});
  };

  return (
    <>
      <style>{`
        @keyframes cdSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes cdGlow {
          0%, 100% { box-shadow: 0 8px 32px rgba(61,43,26,0.35), 0 0 0 1px rgba(200,168,75,0.25); }
          50%       { box-shadow: 0 8px 40px rgba(200,168,75,0.30), 0 0 0 1px rgba(200,168,75,0.50); }
        }
        @keyframes noteFloat {
          0%, 100% { transform: translateY(0) rotate(-12deg); opacity: 0.9; }
          50%       { transform: translateY(-5px) rotate(8deg); opacity: 1; }
        }
        .cd-disc {
          animation: cdSpin 5s linear infinite;
          animation-play-state: paused;
        }
        .cd-disc.spinning {
          animation-play-state: running;
        }
        .cd-wrap {
          animation: cdGlow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Floating CD wrapper */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Tooltip label */}
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#C8A84B',
          opacity: isPlaying ? 1 : 0.55,
          transition: 'opacity 0.4s',
          pointerEvents: 'none',
          textShadow: '0 1px 4px rgba(0,0,0,0.25)',
        }}>
          {isPlaying ? '♪ Playing' : 'Tap to play'}
        </div>

        {/* CD Disc button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className={`cd-wrap`}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            background: 'transparent',
            position: 'relative',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* ── Disc layers (spinning) ───────────────────── */}
          <div
            className={`cd-disc${isPlaying ? ' spinning' : ''}`}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              position: 'relative',
              /* Vinyl conic gradient */
              background:
                'conic-gradient(from 0deg, #1a0e04, #3D2B1A 12%, #C8A84B 22%, #F0D060 28%, #C8A84B 34%, #2a1c0e 45%, #C8A84B 55%, #F0D060 62%, #C8A84B 68%, #1a0e04 80%, #2a1c0e 90%, #1a0e04)',
            }}
          >
            {/* Middle dark ring */}
            <div style={{
              position: 'absolute',
              inset: '10px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #100804 50%, #1e1308)',
              border: '1px solid rgba(200,168,75,0.30)',
            }} />

            {/* Inner ring */}
            <div style={{
              position: 'absolute',
              inset: '22px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #0c0602 55%, #1e1308)',
              border: '1px solid rgba(200,168,75,0.40)',
            }} />

            {/* Center hole */}
            <div style={{
              position: 'absolute',
              inset: '30px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #C8A84B 30%, #A88830)',
              boxShadow: '0 0 6px rgba(200,168,75,0.8)',
            }} />

            {/* Glare highlight */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '10px',
              width: '18px',
              height: '9px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.13)',
              transform: 'rotate(-35deg)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* ── Static play/pause icon (always centered, never spins) ── */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            /* subtle darkening overlay on hover handled by scale */
          }}>
            {isPlaying ? (
              /* Pause — two small bars */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(240,226,196,0.85)">
                <rect x="5"  y="4" width="4" height="16" rx="1.5"/>
                <rect x="15" y="4" width="4" height="16" rx="1.5"/>
              </svg>
            ) : (
              /* Play triangle */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(240,226,196,0.85)">
                <path d="M6 4.75C6 4.02 6.79 3.58 7.4 3.97l13 7.25a1 1 0 010 1.56l-13 7.25C6.79 20.42 6 19.98 6 19.25V4.75z"/>
              </svg>
            )}
          </div>
        </button>
      </div>
    </>
  );
}
