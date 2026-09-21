import React from 'react';
import { Crown } from 'lucide-react';
import { GoldBorderFrame, GoldDivider, FloralCornerAccents, SectionHeader } from './GoldBorder';

// ─── DATA ───────────────────────────────────────────────────────────────
const principalSponsors = [
  'Felix Jr. & Joanne Gerona',
  'Cesar Jr. & Lotlot Malacura',
];

const groomsmen = [
  'Jake Inoc',
  'Jayson Inoc',
  'Ivan Echavia',
  'Edeson Malacura',
  'Kent Brylle Ybañez',
  'Mike Espejo',
];

const bridesmaids = [
  'Maribeth Tan',
  'Jasmin Malacura',
  'Glyza Mae Casquejo',
];

const bridesmen = [
  'Jon Willie Detal',
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────

function PartyColumn({ title, names, accent }) {
  return (
    <div className="text-center">
      <p
        className="text-[9px] sm:text-[10px] tracking-[0.3em] font-semibold uppercase mb-4 font-poppins"
        style={{ color: '#C8A84B' }}
      >
        {title}
      </p>
      <div className="space-y-2.5">
        {names.map((n) => (
          <p
            key={n}
            className="text-xs sm:text-sm font-light tracking-wide uppercase"
            style={{ color: '#3D2B1A' }}
          >
            {n}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────

export default function Entourage() {
  return (
    <section
      id="entourage"
      className="py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #FAF6EF 0%, #F5EBDA 100%)' }}
    >
      <FloralCornerAccents />

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader scriptTitle="Entourage" uppercase="Those Who Stand With Us" data-aos="fade-down" />

        {/* ── PARENTS ── */}
        <div className="mb-12">
          <p
            className="text-center text-[9px] tracking-[0.35em] uppercase font-semibold font-poppins mb-6"
            style={{ color: '#C8A84B' }}
          >
            Beloved Parents
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Parents of the Groom', names: ['Terry Haigler', '&', 'Debra Hanson'] },
              { label: 'Parents of the Bride',  names: ['Paulito Inoc', '&', 'Nila Inoc'] },
            ].map(({ label, names }) => (
              <GoldBorderFrame key={label} className="rounded-2xl text-center" innerPad={false}
                data-aos="fade-right" data-aos-delay={100}>
                <div className="p-6 sm:p-8">
                  <p
                    className="text-[9px] tracking-[0.28em] uppercase font-medium font-poppins mb-3"
                    style={{ color: '#A8927A' }}
                  >
                    {label}
                  </p>
                  {names.map((n) =>
                    n === '&' ? (
                      <p key="amp" className="font-script text-2xl text-gold my-0.5">&amp;</p>
                    ) : (
                      <p key={n} className="text-lg sm:text-xl font-light tracking-widest uppercase" style={{ color: '#3D2B1A' }}>
                        {n}
                      </p>
                    )
                  )}
                </div>
              </GoldBorderFrame>
            ))}
          </div>
        </div>

        {/* ── PRINCIPAL SPONSORS ── */}
        <div className="mb-12">
          <GoldBorderFrame className="rounded-2xl" innerPad={false} data-aos="zoom-in" data-aos-delay="100">
            <div className="p-6 sm:p-10 text-center">
              <div
                className="w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg,#F5EBDA,#E4D0AC)', border: '1px solid #C8A84B' }}
              >
                <Crown className="w-5 h-5" style={{ color: '#3D2B1A' }} />
              </div>

              <p className="text-[9px] tracking-[0.35em] uppercase font-semibold font-poppins mb-1" style={{ color: '#C8A84B' }}>
                Principal Sponsors
              </p>
              <p className="text-[10px] text-weddingBrown/60 italic font-light mb-6 font-poppins">
                To stand as witnesses to our exchange of vows
              </p>

              {/* Two-column sponsor grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-6">
                {principalSponsors.map((name) => (
                  <div
                    key={name}
                    className="py-3 px-4 rounded-xl text-xs font-medium tracking-wide uppercase font-poppins"
                    style={{
                      background: 'rgba(250,246,239,0.85)',
                      border: '1px solid rgba(200,168,75,0.4)',
                      color: '#3D2B1A',
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>

              <GoldDivider />
              <p className="text-[10px] text-weddingBrown/70 font-light tracking-wide font-poppins">
                <span className="font-semibold" style={{ color: '#C8A84B' }}>Note: </span>
                Principal Sponsors are requested to wear brown, champagne, or gold.
              </p>
            </div>
          </GoldBorderFrame>
        </div>

        {/* ── BRIDAL PARTY ── */}
        <div>
          <p className="text-center text-[9px] tracking-[0.35em] uppercase font-semibold font-poppins mb-6" style={{ color: '#C8A84B' }}>
            The Bridal Party
          </p>

          <GoldBorderFrame className="rounded-2xl" innerPad={false} data-aos="fade-up" data-aos-delay="150">
            <div className="p-6 sm:p-10">

              {/* Groomsmen + Bridesmaids side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <PartyColumn title="Groomsmen" names={groomsmen} />
                <div>
                  <PartyColumn title="Bridesmaids" names={bridesmaids} />
                  <div className="mt-6">
                    <PartyColumn title="Bridesmen" names={bridesmen} />
                  </div>
                </div>
              </div>

              <GoldDivider />

              {/* Little Attendants */}
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mt-6">
                {[
                  { role: 'Ring Bearer', name: 'Mchruls Malacura' },
                  { role: 'Little Bride', name: 'Ruchen Malacura' },
                ].map(({ role, name }) => (
                  <div key={role} className="text-center">
                    <p className="text-[9px] tracking-[0.25em] uppercase font-medium font-poppins mb-1" style={{ color: '#A8927A' }}>
                      {role}
                    </p>
                    <p className="text-xs font-medium tracking-wide uppercase font-poppins" style={{ color: '#3D2B1A' }}>
                      {name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GoldBorderFrame>
        </div>
      </div>
    </section>
  );
}
