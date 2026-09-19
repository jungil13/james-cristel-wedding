import React, { useState } from 'react';
import { Sparkles, Gift, ZoomIn, X } from 'lucide-react';
import { GoldBorderFrame, GoldDivider, FloralCornerAccents, SectionHeader } from './GoldBorder';

export default function DressCode() {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const paletteSwatches = [
    { name: 'Espresso',  hex: '#3D2B1A' },
    { name: 'Brown',     hex: '#6B5028' },
    { name: 'Mocha',     hex: '#8A7260' },
    { name: 'Beige',     hex: '#C8A878' },
    { name: 'Champagne', hex: '#E8D5A8' },
    { name: 'Gold',      hex: '#C8A84B' },
  ];

  const attireBoards = [
    {
      id: 'ladies',
      category: 'Female Guests',
      title: 'Ladies Attire Guide',
      subtitle: 'Semi-formal to formal long gowns and refined dresses',
      image: '/images/guests_female.jpg',
      instruction: 'Floor-length gowns in rich chocolate brown, mocha, taupe, warm beige, and luminous champagne.',
    },
    {
      id: 'gentlemen',
      category: 'Male Guests',
      title: 'Gentlemen Attire Guide',
      subtitle: 'Semi-formal to formal tailored suits, blazers & trousers',
      image: '/images/guests_male.jpg',
      instruction: 'Tailored suits, linen shirts, or clean polo shirts paired with smart trousers in brown, taupe, beige, and cream.',
    },
    {
      id: 'ninang',
      category: 'Honored Sponsor',
      title: 'Ninang Attire Guide',
      subtitle: 'Formal long gown in shades of beige, taupe, and champagne',
      image: '/images/ninang_attire.jpg',
      instruction: 'Formal Long Gown in the shade of Beige, Taupe and Champagne.',
      quote: "Dear Ninang, thank you so much for saying 'yes' for being our Ninang. Having your love and support as we take this big step means everything to us!",
    },
    {
      id: 'ninong',
      category: 'Honored Sponsor',
      title: 'Ninong Attire Guide',
      subtitle: 'Formal open coat that suits our color motif',
      image: '/images/ninong_attire.jpg',
      instruction: 'Formal open coat or suit in beige, sand, and warm brown with matching necktie and boutonniere.',
      quote: "Dear Ninong, thank you so much for saying 'yes' for being our Ninong. Having your love and support as we take this big step means everything to us!",
    },
  ];

  const displayedBoards = activeTab === 'all'
    ? attireBoards
    : attireBoards.filter((b) => b.id === activeTab);

  return (
    <section
      id="dresscode"
      className="py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #F2E6D0 0%, #FAF6EF 100%)' }}
    >
      <FloralCornerAccents />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader scriptTitle="Guests" uppercase="What to Wear" />

        {/* Subtitle */}
        <p className="text-center text-xs sm:text-sm font-light font-poppins mb-6 -mt-4" style={{ color: '#6B5840' }}>
          We would love to see you in semi-formal to formal attire that suits our wedding motif
        </p>

        {/* Palette swatches */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          {paletteSwatches.map((s) => (
            <div key={s.name} className="flex flex-col items-center group">
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-md border-2 border-white/60 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: s.hex, boxShadow: '0 4px 10px rgba(61,43,26,0.15)' }}
                title={s.name}
              />
              <span className="text-[9px] uppercase tracking-wider mt-1 font-medium hidden sm:block font-poppins" style={{ color: '#A8927A' }}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all',       label: 'All Guides' },
            { id: 'ladies',    label: 'Female Guests' },
            { id: 'gentlemen', label: 'Male Guests' },
            { id: 'ninang',    label: 'Ninang' },
            { id: 'ninong',    label: 'Ninong' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all font-poppins"
              style={activeTab === tab.id
                ? { background: 'linear-gradient(135deg,#3D2B1A,#5C4228)', color: '#F0E2C4', border: '1px solid #C8A84B' }
                : { background: 'rgba(255,252,246,0.85)', color: '#6B5840', border: '1px solid rgba(200,168,75,0.35)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Boards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-14">
          {displayedBoards.map((board) => (
            <div key={board.id} className="group">
              <GoldBorderFrame className="rounded-3xl h-full" innerPad={false}>
                <div className="p-5 sm:p-7 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] tracking-[0.25em] font-semibold uppercase font-poppins" style={{ color: '#C8A84B' }}>
                      {board.category}
                    </span>
                    <button
                      onClick={() => setLightboxImage(board.image)}
                      className="flex items-center gap-1 text-[11px] font-poppins hover:text-gold transition-colors"
                      style={{ color: '#A8927A' }}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-gold" /> Fullscreen
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-0.5 font-serif" style={{ color: '#3D2B1A' }}>
                    {board.title}
                  </h3>
                  <p className="text-xs font-light mb-4 font-poppins" style={{ color: '#A8927A' }}>
                    {board.subtitle}
                  </p>

                  {/* Image */}
                  <div
                    onClick={() => setLightboxImage(board.image)}
                    className="relative rounded-2xl overflow-hidden cursor-pointer shadow-md"
                    style={{ border: '1px solid rgba(200,168,75,0.30)' }}
                  >
                    <img
                      src={board.image}
                      alt={board.title}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-weddingBrown text-xs font-medium tracking-wider uppercase shadow-md flex items-center gap-1.5 font-poppins" style={{ color: '#3D2B1A' }}>
                        <ZoomIn className="w-4 h-4 text-gold" /> Tap to Enlarge
                      </span>
                    </div>
                  </div>

                  {/* Quote for ninang/ninong */}
                  {board.quote && (
                    <div
                      className="mt-4 p-4 rounded-2xl"
                      style={{ background: 'rgba(200,168,75,0.08)', border: '1px solid rgba(200,168,75,0.28)' }}
                    >
                      <p className="text-xs font-light italic leading-relaxed font-poppins" style={{ color: '#6B5840' }}>
                        "{board.quote}"
                      </p>
                      <p className="font-script text-right text-gold text-lg mt-1">Love, James &amp; Cristel</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: '1px solid rgba(200,168,75,0.25)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <p className="text-xs font-light leading-relaxed font-poppins" style={{ color: '#6B5840' }}>
                      {board.instruction}
                    </p>
                  </div>
                </div>
              </GoldBorderFrame>
            </div>
          ))}
        </div>

        {/* Gifts note */}
        <GoldBorderFrame className="rounded-3xl max-w-xl mx-auto" innerPad={false}>
          <div className="p-6 sm:p-8 text-center">
            <div
              className="w-11 h-11 rounded-full mx-auto flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg,#F5EBDA,#E4D0AC)', border: '1px solid #C8A84B' }}
            >
              <Gift className="w-5 h-5" style={{ color: '#3D2B1A' }} />
            </div>
            <h4 className="text-xs font-semibold tracking-[0.25em] uppercase mb-2 font-poppins" style={{ color: '#3D2B1A' }}>
              A Note on Gifts
            </h4>
            <p className="text-xs sm:text-sm font-light leading-relaxed font-poppins" style={{ color: '#6B5840' }}>
              Your presence on our wedding is enough. However, if you wish to honor us with a gift, a monetary blessing toward our new journey together will be greatly appreciated.
            </p>
          </div>
        </GoldBorderFrame>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/88 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-label="Enlarged Attire Guide"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 sm:right-2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Attire Guide Full View"
              className="w-auto h-auto max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain"
              style={{ border: '2px solid rgba(200,168,75,0.35)' }}
            />
            <p className="text-white/60 text-xs tracking-wider uppercase mt-3 font-poppins">
              Click outside or close to return
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
