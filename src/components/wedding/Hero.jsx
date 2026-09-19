import React, { useEffect, useRef } from 'react';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import { GoldDivider } from './GoldBorder';

export default function Hero({ onRsvpClick, onDetailsClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const pts = Array.from({ length: 28 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.0 + 0.7,
      vy: Math.random() * 0.32 + 0.10,
      vx: (Math.random() - 0.5) * 0.12,
      op: Math.random() * 0.4 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.y -= p.vy; p.x += p.vx;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        ctx.fillStyle = `rgba(200,168,75,${p.op})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      className="relative min-h-[96vh] flex items-center justify-center text-center px-4 sm:px-6 pt-10 pb-20 overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #FAF6EF 0%, #F5EBDA 55%, #EFE0C5 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* ── FLOWERS ON THE SIDES OF THE HERO SECTION ── */}
      {/* Left side floral bouquet */}
      <div className="absolute top-0 left-0 -translate-x-4 sm:-translate-x-8 md:-translate-x-12 -translate-y-4 sm:-translate-y-8 w-52 sm:w-72 md:w-96 lg:w-[460px] pointer-events-none z-0 select-none">
        <img
          src="/images/floral_side_left.png"
          alt="Flowers left"
          className="w-full h-auto object-contain drop-shadow-[0_12px_28px_rgba(61,43,26,0.15)] opacity-95"
          loading="eager"
        />
      </div>

      {/* Right side floral bouquet */}
      <div className="absolute bottom-0 right-0 translate-x-4 sm:translate-x-8 md:translate-x-12 translate-y-4 sm:translate-y-8 w-52 sm:w-72 md:w-96 lg:w-[460px] pointer-events-none z-0 select-none">
        <img
          src="/images/floral_side_right.png"
          alt="Flowers right"
          className="w-full h-auto object-contain drop-shadow-[0_12px_28px_rgba(61,43,26,0.15)] opacity-95"
          loading="eager"
        />
      </div>

      {/* Arched golden halos */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="w-[310px] sm:w-[510px] md:w-[670px] h-[520px] sm:h-[700px] rounded-t-full"
          style={{ border: '1px solid #C8A84B' }} />
        <div className="absolute w-[290px] sm:w-[480px] md:w-[638px] h-[500px] sm:h-[678px] rounded-t-full"
          style={{ border: '0.5px solid rgba(200,168,75,0.4)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

        {/* Monogram */}
        <div className="mb-5 relative">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #FFFDF6, #FAF1DC)',
              border: '2px solid #C8A84B',
              boxShadow: '0 0 20px rgba(200,168,75,0.35), inset 0 1px 3px rgba(255,240,160,0.4)',
            }}
          >
            <span className="font-serif text-xl sm:text-2xl font-bold text-gold-dark tracking-widest">
              J&amp;C
            </span>
          </div>
          <div className="absolute -inset-1.5 rounded-full pointer-events-none animate-spin-slow"
            style={{ border: '1px dashed rgba(200,168,75,0.35)' }} />
        </div>

        {/* Calligraphy label */}
        <p className="font-script text-2xl sm:text-3xl text-gold font-normal mb-1"
          style={{ textShadow: '0 1px 8px rgba(200,168,75,0.25)' }}>
          Save the Date
        </p>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-weddingBrown/70 font-medium mb-3">
          Together with their families
        </p>

        {/* Names */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.16em] uppercase mb-2"
          style={{ color: '#3D2B1A' }}
        >
          James
          <span className="font-script lowercase text-4xl sm:text-6xl text-gold font-normal sm:mx-3 my-1 sm:my-0 inline-block"
            style={{ textShadow: '0 1px 10px rgba(200,168,75,0.3)' }}>
            &amp;
          </span>
          Cristel
        </h1>

        {/* Intro text */}
        <p className="text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed mb-8"
          style={{ color: '#6B5840' }}>
          Request the honour of your presence at the celebration of their holy matrimony and sacred union.
        </p>

        {/* Gold divider */}
        <GoldDivider diamond />

        {/* Date & Venue badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-5 mb-8 w-full">
          {[
            { Icon: Calendar, text: 'Thursday, January 28, 2027' },
            { Icon: MapPin,   text: 'Chateau By The Sea, Cebu' },
          ].map(({ Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{
                background: 'rgba(255,252,246,0.85)',
                border: '1px solid #D4B87A',
                boxShadow: '0 4px 14px rgba(61,43,26,0.08)',
              }}
            >
              <Icon className="w-4 h-4 text-gold" />
              <span className="text-xs sm:text-sm font-medium tracking-wider text-weddingBrown uppercase">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onRsvpClick}
            className="px-8 py-3.5 rounded-full font-medium text-xs sm:text-sm tracking-[0.22em] uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3D2B1A, #5C4228)',
              color: '#F0E2C4',
              border: '1px solid #C8A84B',
              boxShadow: '0 8px 25px rgba(61,43,26,0.22), inset 0 1px 0 rgba(255,240,160,0.15)',
            }}
          >
            RSVP Invitation
          </button>
          <button
            onClick={onDetailsClick}
            className="px-7 py-3.5 rounded-full font-medium text-xs sm:text-sm tracking-[0.22em] uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255,252,246,0.92)',
              color: '#3D2B1A',
              border: '1px solid #C8A84B',
              boxShadow: '0 8px 25px rgba(61,43,26,0.10)',
            }}
          >
            Wedding Details
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 animate-bounce">
          <button onClick={onDetailsClick} aria-label="Scroll down" className="p-2 text-gold/60 hover:text-gold transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
