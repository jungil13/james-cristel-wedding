import React from 'react';
import { Heart } from 'lucide-react';
import { GoldBorderFrame, GoldDivider, FloralCornerAccents } from './GoldBorder';

export default function CoupleSection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #F5EBDA 0%, #FAF6EF 100%)' }}
    >
      <FloralCornerAccents />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <GoldBorderFrame className="rounded-3xl" innerPad={false} data-aos="fade-up">
          <div className="p-8 sm:p-14">
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-6"
              style={{ background: 'linear-gradient(135deg, #F5EBDA, #E4D0AC)', border: '1px solid #C8A84B' }}
            >
              <Heart className="w-5 h-5" style={{ color: '#3D2B1A' }} />
            </div>

            <blockquote
              className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide leading-relaxed italic max-w-2xl mx-auto mb-6 font-serif"
              style={{ color: '#3D2B1A' }}
              data-aos="fade-up" data-aos-delay="150"
            >
              "Two lives, two hearts, joined together in friendship, united forever in love."
            </blockquote>

            <GoldDivider />

            <p className="text-xs sm:text-sm font-light leading-relaxed max-w-xl mx-auto mt-4 font-poppins" style={{ color: '#6B5840' }}>
              With grateful hearts, James and Cristel invite you to share in the joy and blessings as they exchange their
              sacred marriage vows before God, family, and cherished friends.
            </p>
          </div>
        </GoldBorderFrame>
      </div>
    </section>
  );
}
