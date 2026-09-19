import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { GoldBorderFrame, GoldDivider } from './GoldBorder';

export default function Countdown() {
  const targetDate = new Date('2027-01-28T14:45:00+08:00').getTime();

  const calc = () => {
    const diff = targetDate - Date.now();
    if (diff <= 0) return { isArrived: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      isArrived: false,
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [tl, setTl] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTl(calc()), 1000);
    return () => clearInterval(t);
  }, []);

  const boxes = [
    { label: 'Days',    value: tl.days },
    { label: 'Hours',   value: tl.hours },
    { label: 'Minutes', value: tl.minutes },
    { label: 'Seconds', value: tl.seconds },
  ];

  return (
    <section className="py-12 px-4 sm:px-6" style={{ background: 'linear-gradient(170deg,#F5EBDA,#FAF6EF)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <div
          data-aos="fade-down"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase font-poppins mb-6"
          style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.4)', color: '#3D2B1A' }}
        >
          <Clock className="w-3.5 h-3.5 text-gold" /> Counting Down to Forever
        </div>

        {tl.isArrived ? (
          <GoldBorderFrame className="rounded-2xl max-w-md mx-auto">
            <p className="text-2xl font-light tracking-[0.2em] uppercase font-poppins" style={{ color: '#C8A84B' }}>
              THE DAY HAS ARRIVED
            </p>
            <p className="text-sm font-light font-poppins mt-2" style={{ color: '#6B5840' }}>
              Today, James and Cristel pledge their everlasting love.
            </p>
          </GoldBorderFrame>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-2xl mx-auto">
            {boxes.map((b, i) => (
              <div
                key={b.label}
                data-aos="zoom-in-up"
                data-aos-delay={i * 80}
                className="rounded-2xl p-5 sm:p-7 text-center transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(170deg, #FFFDF6, #FAF1DC)',
                  border: '1.5px solid #C8A84B',
                  boxShadow: '0 8px 25px rgba(61,43,26,0.08)',
                }}
              >
                <span className="block text-3xl sm:text-5xl font-light tracking-tight font-poppins" style={{ color: '#3D2B1A' }}>
                  {String(b.value).padStart(2, '0')}
                </span>
                <span className="block text-[10px] sm:text-xs tracking-[0.28em] font-semibold font-poppins mt-2" style={{ color: '#C8A84B' }}>
                  {b.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
