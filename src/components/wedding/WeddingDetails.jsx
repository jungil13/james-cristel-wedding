import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Copy, Check, ExternalLink, Compass } from 'lucide-react';
import { GoldBorderFrame, GoldDivider, FloralCornerAccents, SectionHeader } from './GoldBorder';

export default function WeddingDetails() {
  const [copied, setCopied] = useState(false);

  const venueName = 'Chateau By The Sea';
  const address   = 'Brgy. Buot, Punta Engaño, Lapu-Lapu City, Cebu 6015, Philippines';
  const gmapsUrl  = 'https://www.google.com/maps/search/?api=1&query=Chateau+By+The+Sea+Punta+Enga%C3%B1o+Lapu-Lapu+City+Cebu';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${venueName}, ${address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCalendar = () => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE`
      + `&text=${encodeURIComponent('James & Cristel Wedding')}`
      + `&dates=20270128T064500Z/20270128T130000Z`
      + `&details=${encodeURIComponent('Celebrating the wedding of James & Cristel at Chateau By The Sea, Cebu.')}`
      + `&location=${encodeURIComponent(`${venueName}, ${address}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="details"
      className="py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #FAF6EF 0%, #F2E6D0 100%)' }}
    >
      <FloralCornerAccents />
      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader scriptTitle="Details" uppercase="Where & When" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">

          {/* Date & Time Card */}
          <GoldBorderFrame className="rounded-2xl" innerPad={false}>
            <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg,#F5EBDA,#E4D0AC)', border: '1px solid #C8A84B' }}>
                  <Calendar className="w-5 h-5" style={{ color: '#3D2B1A' }} />
                </div>
                <p className="text-[9px] font-semibold tracking-[0.28em] uppercase font-poppins mb-1" style={{ color: '#C8A84B' }}>
                  The Wedding Date
                </p>
                <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-4" style={{ color: '#3D2B1A' }}>
                  Thursday, January 28, 2027
                </h3>
                <div className="space-y-1.5 text-sm font-poppins" style={{ color: '#6B5840' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold" />
                    <span className="font-light">2:45 PM – 9:00 PM</span>
                  </div>
                  <p className="text-xs" style={{ color: '#A8927A' }}>Ceremony begins promptly at 3:30 PM</p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgba(200,168,75,0.25)' }}>
                <button onClick={handleCalendar}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2 font-poppins"
                  style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.4)', color: '#3D2B1A' }}>
                  <Calendar className="w-4 h-4 text-gold" /> Add to Google Calendar
                </button>
              </div>
            </div>
          </GoldBorderFrame>

          {/* Venue Card */}
          <GoldBorderFrame className="rounded-2xl" innerPad={false}>
            <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg,#F5EBDA,#E4D0AC)', border: '1px solid #C8A84B' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#3D2B1A' }} />
                </div>
                <p className="text-[9px] font-semibold tracking-[0.28em] uppercase font-poppins mb-1" style={{ color: '#C8A84B' }}>
                  Reception Venue
                </p>
                <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-2" style={{ color: '#3D2B1A' }}>
                  {venueName}
                </h3>
                <p className="text-sm font-light leading-relaxed font-poppins" style={{ color: '#6B5840' }}>
                  {address}
                </p>
              </div>
              <div className="mt-6 pt-5 border-t flex flex-col sm:flex-row gap-2.5" style={{ borderColor: 'rgba(200,168,75,0.25)' }}>
                <a href={gmapsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2 font-poppins"
                  style={{ background: 'linear-gradient(135deg,#3D2B1A,#5C4228)', color: '#F0E2C4', border: '1px solid #C8A84B' }}>
                  <Compass className="w-4 h-4 text-gold" /> Open Map
                </a>
                <button onClick={handleCopy}
                  className="py-2.5 px-4 rounded-xl text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2 font-poppins"
                  style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.4)', color: '#3D2B1A' }}>
                  {copied ? <><Check className="w-4 h-4 text-emerald-700" />Copied</> : <><Copy className="w-4 h-4" />Address</>}
                </button>
              </div>
            </div>
          </GoldBorderFrame>
        </div>

        {/* Venue note */}
        <GoldBorderFrame className="rounded-2xl" innerPad={false}>
          <div className="p-6 sm:p-8 text-center">
            <h4 className="text-sm font-medium tracking-widest uppercase font-poppins mb-1" style={{ color: '#3D2B1A' }}>
              Chateau By The Sea — Punta Engaño
            </h4>
            <p className="text-xs font-light font-poppins mb-4" style={{ color: '#6B5840' }}>
              Nestled along the pristine coastal waters of Mactan, Cebu. Complimentary guest parking and concierge will be available upon arrival.
            </p>
            <a href={gmapsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest underline underline-offset-4 font-poppins"
              style={{ color: '#C8A84B' }}>
              View on Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </GoldBorderFrame>
      </div>
    </section>
  );
}
