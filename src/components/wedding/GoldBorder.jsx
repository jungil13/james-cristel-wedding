import React from 'react';

// Reusable elegant gold corner ornament SVG border wrapper
// Matches the reference image: inner double-line frame with ornate corner flourishes
export function GoldBorderFrame({ children, className = '', innerPad = true, ...props }) {
  return (
    <div className={`relative ${className}`}
      style={{
        border: '1.5px solid #C8A84B',
        boxShadow: '0 0 0 5px rgba(200,168,75,0.10), 0 0 0 9px rgba(200,168,75,0.04), 0 20px 50px -15px rgba(61,43,26,0.14)',
      }}
      {...props}
    >
      {/* Inner hairline */}
      <div className="absolute inset-[7px] pointer-events-none"
        style={{ border: '0.5px solid rgba(200,168,75,0.35)' }}
      />

      {/* Corner ornaments */}
      <CornerFlourish position="tl" />
      <CornerFlourish position="tr" />
      <CornerFlourish position="bl" />
      <CornerFlourish position="br" />

      {/* Content */}
      <div className={innerPad ? 'relative z-10 p-6 sm:p-10' : 'relative z-10'}>
        {children}
      </div>
    </div>
  );
}

function CornerFlourish({ position }) {
  const posMap = {
    tl: { top: -2, left: -2, rotate: 0 },
    tr: { top: -2, right: -2, rotate: 90 },
    bl: { bottom: -2, left: -2, rotate: 270 },
    br: { bottom: -2, right: -2, rotate: 180 },
  };
  const { rotate, ...pos } = posMap[position];

  return (
    <div
      className="absolute w-10 h-10 pointer-events-none z-10"
      style={{ ...pos, transform: `rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        {/* L-shaped double lines */}
        <path d="M2 2 L2 20" stroke="#C8A84B" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 2 L20 2" stroke="#C8A84B" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 6 L6 16" stroke="#C8A84B" strokeWidth="0.6" strokeLinecap="round"/>
        <path d="M6 6 L16 6" stroke="#C8A84B" strokeWidth="0.6" strokeLinecap="round"/>
        {/* Tiny fleur dot */}
        <circle cx="2" cy="2" r="2" fill="#C8A84B"/>
        <circle cx="2" cy="2" r="1" fill="#F0D060"/>
        {/* Tiny flourish curl */}
        <path d="M10 2 Q14 5 12 10" stroke="#C8A84B" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
        <path d="M2 10 Q5 14 10 12" stroke="#C8A84B" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// Simple horizontal gold divider with optional small diamond
export function GoldDivider({ diamond = true }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8A84B, transparent)' }} />
      {diamond && (
        <div className="w-2 h-2 rotate-45 bg-gold flex-shrink-0" />
      )}
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C8A84B, transparent)' }} />
    </div>
  );
}

// Floral corner accents (disabled so flowers only appear on the hero section as requested)
export function FloralCornerAccents() {
  return null;
}

// Floral side accents (disabled so flowers only appear on the hero section as requested)
export function FloralSideAccents() {
  return null;
}

// Section header with script title + uppercase subtitle
export function SectionHeader({ scriptTitle, uppercase, noMarginBottom, ...props }) {
  return (
    <div className={`text-center ${noMarginBottom ? '' : 'mb-12 sm:mb-16'}`} {...props}>
      {scriptTitle && (
        <p className="font-script text-5xl sm:text-6xl text-gold font-normal leading-tight"
          style={{ textShadow: '0 1px 10px rgba(200,168,75,0.22)' }}>
          {scriptTitle}
        </p>
      )}
      {uppercase && (
        <span className="text-[10px] sm:text-xs tracking-[0.38em] uppercase font-poppins font-semibold text-weddingBrown block mt-0.5">
          {uppercase}
        </span>
      )}
      <GoldDivider />
    </div>
  );
}
