import React, { useState, useEffect } from 'react';
import { MousePointerClick } from 'lucide-react';

export default function WeddingEnvelope({ onEnvelopeOpened }) {
  const [animStage, setAnimStage] = useState('closed');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const h = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const handleOpen = () => {
    if (animStage !== 'closed') return;

    if (prefersReducedMotion) {
      setAnimStage('revealed');
      setTimeout(() => { setAnimStage('faded'); onEnvelopeOpened?.(); }, 500);
      return;
    }

    setAnimStage('seal-breaking');
    setTimeout(() => setAnimStage('flap-opening'), 250);
    setTimeout(() => setAnimStage('letter-rising'), 650);
    setTimeout(() => setAnimStage('revealed'), 1150);
    setTimeout(() => { setAnimStage('faded'); onEnvelopeOpened?.(); }, 1600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
  };

  if (animStage === 'faded') return null;

  const isFlapOpen    = ['flap-opening','letter-rising','revealed','faded'].includes(animStage);
  const isLetterRising= ['letter-rising','revealed','faded'].includes(animStage);
  const isRevealed    = ['revealed','faded'].includes(animStage);
  const isOpening     = animStage !== 'closed';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 select-none ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'radial-gradient(circle at 55% 40%, #F8F2E5 0%, #EFE3CB 55%, #E0CBA8 100%)' }}
      role="dialog"
      aria-label="Wedding Envelope Invitation"
    >
      {/* Rich vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_50%,rgba(61,43,26,0.18)_100%)]" />

      {/* ── TOP LEFT BOUQUET ── */}
      <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-60 sm:w-80 md:w-96 pointer-events-none z-10 select-none">
        <img
          src="/images/floral_side_left.png"
          alt="Flowers top left"
          className="w-full h-auto object-contain drop-shadow-[0_8px_24px_rgba(61,43,26,0.18)]"
        />
      </div>

      {/* ── BOTTOM RIGHT BOUQUET ── */}
      <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-60 sm:w-80 md:w-96 pointer-events-none z-10 select-none">
        <img
          src="/images/floral_side_right.png"
          alt="Flowers bottom right"
          className="w-full h-auto object-contain drop-shadow-[0_8px_24px_rgba(61,43,26,0.18)]"
        />
      </div>

      {/* Golden particles during opening */}
      {isOpening && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(22)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-slow"
              style={{
                width:  `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                top:  `${18 + (i * 19) % 66}%`,
                left: `${12 + (i * 27) % 74}%`,
                background: 'radial-gradient(circle, #F0D060, #C8A84B)',
                animationDelay: `${i * 0.09}s`,
                boxShadow: '0 0 8px #C8A84B',
              }}
            />
          ))}
        </div>
      )}

      {/* ── CENTER EXPERIENCE ── */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-4 sm:px-6">

        {/* Names above */}
        <div className={`text-center mb-6 transition-all duration-500 ${isOpening ? 'opacity-30 -translate-y-4' : ''}`}>
          <p className="text-[10px] sm:text-xs tracking-[0.38em] uppercase font-poppins font-medium text-gold-dark">
            Wedding Invitation
          </p>
          <h1 className="font-script text-4xl sm:text-5xl text-gold font-normal mt-1" style={{ textShadow: '0 1px 8px rgba(200,168,75,0.25)' }}>
            James &amp; Cristel
          </h1>
          <p className="text-[10px] tracking-[0.28em] text-weddingBrown/70 mt-0.5 font-light uppercase">
            January 28, 2027 &nbsp;•&nbsp; Chateau By The Sea
          </p>
        </div>

        {/* ── THE ENVELOPE ── */}
        <div
          tabIndex={0}
          role="button"
          aria-label="Click or press Enter to open the wedding invitation envelope"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          className="relative w-72 sm:w-96 h-52 sm:h-64 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/60"
          style={{ perspective: '1200px' }}
        >
          {/* Drop shadow beneath */}
          <div className="absolute inset-0 bg-black/14 blur-xl translate-y-5 rounded-sm" />

          {/* ── ENVELOPE BODY ── warm cream with linen texture feel */}
          <div
            className="absolute inset-0 rounded-sm overflow-hidden"
            style={{
              background: 'linear-gradient(175deg, #FBF6EC 0%, #F2E6CE 50%, #EDD9B6 100%)',
              border: '1px solid #D4B87A',
              boxShadow: '0 2px 0 #C8A84B, 0 4px 20px rgba(61,43,26,0.20)',
            }}
          >
            {/* Inner liner – gold damask dot grid */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(#C8A84B 1px, transparent 1px)', backgroundSize: '14px 14px' }}
            />
            {/* Gold foil rim border */}
            <div className="absolute inset-[5px] border border-gold/30 pointer-events-none rounded-sm" />
          </div>

          {/* ── LEFT FLAP TRIANGLE ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: 'polygon(0 0, 0 100%, 50% 50%)',
              background: 'linear-gradient(135deg, #F0E2C4 0%, #E8D5A8 100%)',
              borderRight: '0.5px solid #CBB06A',
            }}
          />
          {/* ── RIGHT FLAP TRIANGLE ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)',
              background: 'linear-gradient(225deg, #F0E2C4 0%, #E8D5A8 100%)',
              borderLeft: '0.5px solid #CBB06A',
            }}
          />
          {/* ── BOTTOM FLAP TRIANGLE ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)',
              background: 'linear-gradient(0deg, #EDD9B6 0%, #F5EAD2 100%)',
              borderTop: '0.5px solid #CBB06A',
              boxShadow: 'inset 0 4px 8px rgba(61,43,26,0.06)',
            }}
          />

          {/* ── INVITATION CARD inside ── rises upward on open */}
          <div
            className={`absolute inset-x-4 bottom-1 h-[86%] rounded-sm transition-all duration-700 ease-in-out ${
              isLetterRising ? '-translate-y-32 sm:-translate-y-40 shadow-2xl scale-105 z-30' : 'translate-y-0 z-10'
            }`}
            style={{
              background: 'linear-gradient(170deg, #FFFDF8 0%, #FBF6EC 100%)',
              border: '1px solid #D4B87A',
              boxShadow: isLetterRising
                ? '0 30px 70px rgba(61,43,26,0.30), 0 0 30px rgba(200,168,75,0.35)'
                : '0 4px 15px rgba(61,43,26,0.12)',
            }}
          >
            {/* Inner gold border */}
            <div className="absolute inset-[5px] border border-gold/25 pointer-events-none" />

            {/* Card Content */}
            <div className="relative flex flex-col items-center justify-between h-full px-5 py-4 text-center">
              <div>
                {/* Top ornament */}
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="h-px w-6 bg-gold/50" />
                  <span className="text-[8px] tracking-[0.3em] uppercase text-gold-dark font-poppins font-medium">
                    Please join us
                  </span>
                  <span className="h-px w-6 bg-gold/50" />
                </div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-weddingBrown/70 font-poppins">
                  at the wedding of
                </p>
              </div>

              <div>
                <p className="font-script text-2xl sm:text-3xl text-gold leading-tight" style={{ textShadow: '0 1px 6px rgba(200,168,75,0.2)' }}>
                  James &amp; Cristel
                </p>
                <p className="text-[9px] tracking-[0.25em] uppercase text-weddingBrown/60 mt-0.5 font-poppins">
                  January 28, 2027
                </p>
              </div>

              <div className="w-full pt-1 border-t border-gold/20">
                <p className="text-[8px] tracking-[0.15em] uppercase text-gold-dark font-poppins font-medium">
                  Chateau By The Sea · Lapu-Lapu City, Cebu
                </p>
              </div>
            </div>
          </div>

          {/* ── TOP FLAP – folds backward in 3D ── */}
          <div
            className="absolute top-0 inset-x-0 z-20"
            style={{
              height: '50%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {/* Outer face of flap */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(175deg, #FBF3DE 0%, #EDD9B6 100%)',
                borderBottom: '0.5px solid #CBB06A',
                boxShadow: isFlapOpen ? 'none' : '0 6px 18px rgba(61,43,26,0.12)',
              }}
            />
          </div>

          {/* ── WAX SEAL ── centered, disappears when flap opens */}
          <div
            className={`absolute inset-0 flex items-center justify-center z-30 transition-all duration-500 ${
              isFlapOpen ? 'opacity-0 scale-150 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          >
            {/* Seal glow ring */}
            <div
              className={`absolute rounded-full transition-all duration-300 ${
                animStage === 'seal-breaking' ? 'scale-150 opacity-60' : 'opacity-0 scale-100'
              }`}
              style={{ width: 80, height: 80, background: 'radial-gradient(circle, rgba(240,208,96,0.7), transparent)' }}
            />

            {/* Wax seal disc */}
            <button
              onClick={handleOpen}
              aria-label="Click wax seal to open invitation"
              className="relative focus:outline-none group"
            >
              {/* Outer drip ring */}
              <div
                className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: 'radial-gradient(circle at 38% 32%, #E8C84A 0%, #C8A84B 45%, #7A5E10 95%)',
                  boxShadow: '0 5px 20px rgba(61,43,26,0.4), inset 0 2px 6px rgba(255,240,150,0.45), inset 0 -2px 6px rgba(0,0,0,0.25)',
                  border: '2px solid #D4B87A',
                }}
              >
                {/* Wax seal inner face */}
                <div
                  className="w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full border border-[#A88830]/60 flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle at center, #C8A84B 0%, #8B6914 100%)' }}
                >
                  <span className="font-serif text-white/95 text-xs sm:text-sm font-bold tracking-wider drop-shadow">
                    J&amp;C
                  </span>
                </div>
              </div>
              {/* Glint */}
              <div className="absolute top-1.5 right-2 w-3 h-3 rounded-full bg-white/45 blur-[1.5px] pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Click prompt below */}
        <div
          className={`mt-7 flex flex-col items-center cursor-pointer transition-all duration-500 ${
            isOpening ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100'
          }`}
          onClick={handleOpen}
        >
          <div
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-full backdrop-blur-sm hover:bg-white/90 transition-all group"
            style={{
              background: 'rgba(255,252,246,0.80)',
              border: '1px solid #D4B87A',
              boxShadow: '0 4px 16px rgba(61,43,26,0.10)',
            }}
          >
            <MousePointerClick className="w-4 h-4 text-gold group-hover:scale-110 transition-transform animate-bounce" />
            <span className="text-xs tracking-[0.25em] uppercase font-poppins font-medium text-weddingBrown">
              Click Seal to Open
            </span>
          </div>
          <span className="text-[10px] text-weddingBrown/50 mt-2 font-light tracking-wider">
            or press Space · Enter
          </span>
        </div>
      </div>
    </div>
  );
}
