import React from 'react';
import { Users, Heart, Camera, Wine, Sparkles, Moon, Clock } from 'lucide-react';
import { GoldDivider, FloralCornerAccents, SectionHeader } from './GoldBorder';

const events = [
  { time: '2:45 PM – 3:15 PM', title: 'Guest Arrival & Seating', desc: 'Welcome refreshments and pre-ceremony seating as guests gather.', Icon: Users },
  { time: '3:30 PM', title: 'Ceremony Begins', desc: 'The sacred marriage rites and exchange of eternal vows.', Icon: Heart, highlight: true },
  { time: '4:10 PM', title: 'Ceremony Ends', desc: 'Pronouncement as husband and wife, followed by recessional.', Icon: Sparkles },
  { time: '4:10 PM – 5:00 PM', title: 'Portraits & Congratulations', desc: 'Family photography, congratulations, and couple sunset portraits.', Icon: Camera },
  { time: '5:00 PM', title: 'Cocktail Hour', desc: "Guests move to the reception garden for hors d'oeuvres and signature drinks.", Icon: Wine },
  { time: '5:30 PM', title: 'Reception & Party Begins', desc: 'Grand entrance of the newlyweds, dinner banquet, speeches, and dances.', Icon: Sparkles, highlight: true },
  { time: '9:00 PM', title: 'Reception Concludes', desc: 'Sparkler send-off and farewell as the celebration comes to a graceful close.', Icon: Moon },
];

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #FAF6EF 0%, #F5EBDA 100%)' }}
    >
      <FloralCornerAccents />
      <div className="max-w-3xl mx-auto relative z-10">
        <SectionHeader scriptTitle="Timeline" uppercase="Order of Events" />

        <div className="relative pl-7 sm:pl-10 space-y-8 sm:space-y-10"
          style={{ borderLeft: '2px solid rgba(200,168,75,0.30)' }}>
          {events.map((ev, i) => (
            <div key={i} className="relative group">

              {/* Node */}
              <div
                className={`absolute -left-[29px] sm:-left-[37px] top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                  ev.highlight
                    ? 'border-weddingBrown'
                    : 'border-gold/60'
                }`}
                style={ev.highlight
                  ? { background: 'linear-gradient(135deg,#C8A84B,#A88830)', color: '#FFFDF6' }
                  : { background: 'linear-gradient(135deg,#FFFDF6,#F0E2C4)', color: '#C8A84B' }}
              >
                <ev.Icon className="w-4 h-4" />
              </div>

              {/* Card */}
              <div
                className="rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: ev.highlight
                    ? 'linear-gradient(135deg, #FFFDF6 0%, #FAF1DC 100%)'
                    : 'rgba(255,252,246,0.88)',
                  border: `1px solid ${ev.highlight ? '#C8A84B' : 'rgba(200,168,75,0.30)'}`,
                  boxShadow: ev.highlight
                    ? '0 10px 30px rgba(61,43,26,0.10)'
                    : '0 6px 18px rgba(61,43,26,0.06)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[10px] font-semibold tracking-wider uppercase font-poppins" style={{ color: '#C8A84B' }}>
                    {ev.time}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-light tracking-wide mb-1 font-serif" style={{ color: '#3D2B1A' }}>
                  {ev.title}
                </h3>
                <p className="text-xs sm:text-sm font-light leading-relaxed font-poppins" style={{ color: '#6B5840' }}>
                  {ev.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
