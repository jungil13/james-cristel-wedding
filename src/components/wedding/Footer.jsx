import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';

export default function Footer({ onAdminClick }) {
  return (
    <footer
      className="pt-16 pb-12 px-4 sm:px-6 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(170deg, #F5EBDA 0%, #EFE0C5 100%)',
        borderTop: '1px solid rgba(200,168,75,0.30)',
      }}
    >
      {/* Top gold hairline accent */}
      <div className="w-48 h-px mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, #C8A84B, transparent)' }} />

      <div className="max-w-4xl mx-auto flex flex-col items-center">

        {/* Monogram Seal */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{
            background: 'radial-gradient(circle, #FFFDF6, #FAF1DC)',
            border: '2px solid #C8A84B',
            boxShadow: '0 0 16px rgba(200,168,75,0.25)',
          }}
        >
          <span className="font-serif text-sm font-bold tracking-widest" style={{ color: '#3D2B1A' }}>J&amp;C</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-light tracking-[0.28em] uppercase mb-1 font-poppins" style={{ color: '#3D2B1A' }}>
          James &amp; Cristel
        </h3>
        <p className="text-[10px] tracking-widest uppercase mb-7 font-poppins" style={{ color: '#A8927A' }}>
          January 28, 2027 &nbsp;•&nbsp; Chateau By The Sea, Cebu
        </p>

        {/* Bottom gold divider */}
        <div className="w-32 h-px mb-7" style={{ background: 'linear-gradient(90deg, transparent, #C8A84B, transparent)' }} />

        <div className="flex items-center gap-6 text-[11px] mb-7 font-poppins" style={{ color: '#A8927A' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 hover:text-gold transition-colors tracking-wider uppercase"
          >
            <ArrowUp className="w-3.5 h-3.5" /> Back to Top
          </button>
          <span className="w-1 h-1 rounded-full bg-gold/30" />
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 hover:text-gold transition-colors tracking-wider uppercase"
            title="Organizer and Admin Login"
          >
            <Lock className="w-3.5 h-3.5" /> Admin Portal
          </button>
        </div>

        <p className="text-[10px] font-light font-poppins" style={{ color: '#A8927A' }}>
          Designed with love for James &amp; Cristel's Wedding Celebration. 🤍
        </p>
      </div>
    </footer>
  );
}
