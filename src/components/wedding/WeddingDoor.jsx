import React, { useState, useEffect } from 'react';
import { Sparkles, MousePointerClick } from 'lucide-react';

export default function WeddingDoor({ onDoorOpened }) {
  const [animStage, setAnimStage] = useState('closed'); // 'closed' | 'opening' | 'light' | 'particles' | 'fully-open' | 'faded'
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleOpen = () => {
    if (animStage !== 'closed') return;

    if (prefersReducedMotion) {
      setAnimStage('fully-open');
      setTimeout(() => {
        setAnimStage('faded');
        onDoorOpened?.();
      }, 600);
      return;
    }

    // Exact timeline sequence:
    // 0.1s: Gold glow
    setAnimStage('opening');

    // 0.3s - 0.5s: Panels open & warm champagne light shines
    setTimeout(() => {
      setAnimStage('light');
    }, 400);

    // 0.8s: Soft particles appear & florals move
    setTimeout(() => {
      setAnimStage('particles');
    }, 800);

    // 1.2s: Doors open completely
    setTimeout(() => {
      setAnimStage('fully-open');
    }, 1200);

    // 1.5s: Opening screen transitions into invitation
    setTimeout(() => {
      setAnimStage('faded');
      onDoorOpened?.();
    }, 1600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  if (animStage === 'faded') {
    return null;
  }

  const isOpening = animStage !== 'closed';
  const isLight = ['light', 'particles', 'fully-open', 'faded'].includes(animStage);
  const isParticles = ['particles', 'fully-open', 'faded'].includes(animStage);
  const isFullyOpen = ['fully-open', 'faded'].includes(animStage);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 select-none ${
        isFullyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #FBF8F2 0%, #F5EFE6 60%, #E8D7B5 100%)',
      }}
      role="dialog"
      aria-label="Enchanted Wedding Invitation Entrance"
    >
      {/* Background Soft Texture & Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-taupe/10 to-weddingBrown/25" />
      
      {/* Delicate Ambient Floral Elements (Top Left & Top Right) */}
      <div 
        className={`absolute -top-12 -left-12 w-64 h-64 opacity-40 transition-transform duration-1000 pointer-events-none ${
          isParticles ? 'scale-105 -translate-x-2 -translate-y-2' : ''
        }`}
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-gold">
          <path d="M40 0C60 40 100 60 140 40C160 80 140 120 100 140C60 160 40 140 0 100C40 100 40 40 40 0Z" fill="currentColor" fillOpacity="0.18" />
          <circle cx="90" cy="80" r="4" fill="currentColor" />
          <circle cx="110" cy="95" r="3" fill="currentColor" />
          <circle cx="70" cy="110" r="3" fill="currentColor" />
          <path d="M10 10 Q 70 80 140 20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      </div>

      <div 
        className={`absolute -top-12 -right-12 w-64 h-64 opacity-40 transition-transform duration-1000 pointer-events-none transform -scale-x-100 ${
          isParticles ? 'scale-105 translate-x-2 -translate-y-2' : ''
        }`}
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-gold">
          <path d="M40 0C60 40 100 60 140 40C160 80 140 120 100 140C60 160 40 140 0 100C40 100 40 40 40 0Z" fill="currentColor" fillOpacity="0.18" />
          <circle cx="90" cy="80" r="4" fill="currentColor" />
          <circle cx="110" cy="95" r="3" fill="currentColor" />
          <path d="M10 10 Q 70 80 140 20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* Behind the Door: Warm Golden Light Beam & Invitation Silhouette */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ${
          isLight ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-champagne via-gold/30 to-champagne blur-3xl opacity-80 animate-pulse-subtle" />
      </div>

      {/* Floating Sparkle Particles (0.8s) */}
      {isParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gold/70 animate-float-slow"
              style={{
                top: `${15 + (i * 17) % 70}%`,
                left: `${10 + (i * 23) % 80}%`,
                animationDelay: `${(i * 0.15)}s`,
                animationDuration: `${3 + (i % 4)}s`,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 8px #C6A15B',
              }}
            />
          ))}
        </div>
      )}

      {/* Centered Wedding Door Structure */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-4 sm:px-6">
        
        {/* Monogram / Header Above Door */}
        <div 
          className={`text-center mb-6 transition-all duration-700 ${
            isOpening ? 'opacity-40 -translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="inline-flex items-center gap-3 text-gold/80 mb-2">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-[10px] tracking-[0.35em] uppercase font-poppins font-medium text-weddingBrown">
              You are cordially invited
            </span>
            <span className="h-px w-8 bg-gold/50" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-light tracking-[0.25em] text-weddingBrown uppercase">
            James
            <span className="block text-2xl sm:text-3xl text-gold font-normal my-0.5">&amp;</span>
            Cristel
          </h1>

          <p className="mt-2 text-xs sm:text-sm font-light tracking-[0.25em] text-taupe-dark">
            JANUARY 28, 2027
          </p>
        </div>

        {/* 3D Door Container */}
        <div 
          tabIndex={0}
          role="button"
          aria-label="Click or press Enter to open the wedding invitation"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          className={`relative w-72 sm:w-84 h-[380px] sm:h-[440px] perspective-1000 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 rounded-t-full transition-transform duration-700 ${
            isOpening ? 'scale-105' : 'hover:scale-[1.01]'
          }`}
        >
          {/* Outer Arched Frame */}
          <div className="absolute inset-0 rounded-t-full border-[6px] border-champagne-dark/60 bg-ivory shadow-wedding-lg overflow-hidden flex">
            
            {/* Background glowing aura between doors */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none flex items-center justify-center ${
                isOpening ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(198,161,91,0.5) 0%, rgba(232,215,181,0.2) 60%, transparent 100%)'
              }}
            >
              <Sparkles className="w-10 h-10 text-gold/70 animate-spin" style={{ animationDuration: '10s' }} />
            </div>

            {/* Left Door Leaf */}
            <div 
              className={`door-panel-left relative w-1/2 h-full bg-gradient-to-b from-[#F3ECE0] via-[#EADBCA] to-[#DFD0BC] border-r border-champagne-dark/50 flex flex-col justify-between p-3.5 shadow-md ${
                isOpening ? 'door-open' : ''
              }`}
              style={{
                boxShadow: isOpening ? 'none' : 'inset -4px 0 10px rgba(74,52,39,0.08)',
              }}
            >
              {/* Luxury Inset Carvings / Panels */}
              <div className="w-full h-[40%] rounded-t-full border-2 border-gold/40 bg-white/30 p-2 flex flex-col items-center justify-center">
                <div className="w-full h-full rounded-t-full border border-gold/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center">
                    <span className="text-[9px] font-semibold text-gold">J</span>
                  </div>
                </div>
              </div>

              {/* Gold Door Handle (Left) */}
              <div className="self-end my-auto -mr-1.5 flex items-center">
                <div className="w-2.5 h-12 rounded-full bg-gradient-to-r from-gold-dark via-gold-light to-gold shadow-md border border-gold-dark flex items-center justify-center">
                  <div className="w-1 h-8 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Lower Panel */}
              <div className="w-full h-[42%] rounded border-2 border-gold/40 bg-white/25 p-2">
                <div className="w-full h-full border border-gold/20 flex items-center justify-center">
                  <div className="w-8 h-8 rotate-45 border border-gold/30" />
                </div>
              </div>
            </div>

            {/* Right Door Leaf */}
            <div 
              className={`door-panel-right relative w-1/2 h-full bg-gradient-to-b from-[#F3ECE0] via-[#EADBCA] to-[#DFD0BC] border-l border-champagne-dark/50 flex flex-col justify-between p-3.5 shadow-md ${
                isOpening ? 'door-open' : ''
              }`}
              style={{
                boxShadow: isOpening ? 'none' : 'inset 4px 0 10px rgba(74,52,39,0.08)',
              }}
            >
              {/* Luxury Inset Carvings / Panels */}
              <div className="w-full h-[40%] rounded-t-full border-2 border-gold/40 bg-white/30 p-2 flex flex-col items-center justify-center">
                <div className="w-full h-full rounded-t-full border border-gold/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center">
                    <span className="text-[9px] font-semibold text-gold">C</span>
                  </div>
                </div>
              </div>

              {/* Gold Door Handle (Right) */}
              <div className="self-start my-auto -ml-1.5 flex items-center">
                <div className="w-2.5 h-12 rounded-full bg-gradient-to-r from-gold-dark via-gold-light to-gold shadow-md border border-gold-dark flex items-center justify-center">
                  <div className="w-1 h-8 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Lower Panel */}
              <div className="w-full h-[42%] rounded border-2 border-gold/40 bg-white/25 p-2">
                <div className="w-full h-full border border-gold/20 flex items-center justify-center">
                  <div className="w-8 h-8 rotate-45 border border-gold/30" />
                </div>
              </div>
            </div>

          </div>

          {/* Golden edge glow upon click (0.1s) */}
          <div 
            className={`absolute -inset-2 rounded-t-full pointer-events-none transition-opacity duration-500 ${
              isOpening ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              boxShadow: '0 0 35px 8px rgba(198, 161, 91, 0.65)',
            }}
          />
        </div>

        {/* Action Prompt Below Door */}
        <div 
          onClick={handleOpen}
          className={`mt-6 flex flex-col items-center cursor-pointer transition-all duration-500 ${
            isOpening ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-gold/40 shadow-sm backdrop-blur hover:bg-white transition-all hover:border-gold group">
            <MousePointerClick className="w-4 h-4 text-gold group-hover:scale-110 transition-transform animate-bounce" />
            <span className="text-xs tracking-[0.2em] uppercase font-poppins font-medium text-weddingBrown">
              Click to Open
            </span>
          </div>
          <span className="text-[10px] text-taupe mt-1.5 font-light tracking-wider">
            (or press Enter / Space)
          </span>
        </div>

      </div>
    </div>
  );
}
