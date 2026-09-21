import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sendRsvpNotification } from '../../lib/notifications';
import { GoldBorderFrame, GoldDivider, FloralCornerAccents, SectionHeader } from './GoldBorder';

const RSVP_LIMIT = 100;

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attendance: 'accepted', // 'accepted' | 'declined'
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedAttendance, setSubmittedAttendance] = useState('accepted');

  // Capacity tracking
  const [capacityLoading, setCapacityLoading] = useState(true);
  const [isFull, setIsFull] = useState(false);

  // Fetch total confirmed guest count on mount
  useEffect(() => {
    const checkCapacity = async () => {
      try {
        const { data, error } = await supabase
          .from('rsvps')
          .select('guest_count')
          .eq('attendance', 'accepted');

        if (!error && data) {
          const total = data.reduce((sum, r) => sum + (parseInt(r.guest_count, 10) || 0), 0);
          if (total >= RSVP_LIMIT) setIsFull(true);
        }
      } catch (_) {
        // silently fail — form stays open if check cannot complete
      } finally {
        setCapacityLoading(false);
      }
    };
    checkCapacity();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMsg) setErrorMsg('');
  };

  const validate = () => {
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }


    if (!formData.attendance) {
      setErrorMsg('Please indicate your attendance.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      // Re-check capacity right before submitting (race-condition guard)
      if (formData.attendance === 'accepted') {
        const { data: capData, error: capError } = await supabase
          .from('rsvps')
          .select('guest_count')
          .eq('attendance', 'accepted');

        if (!capError && capData) {
          const total = capData.reduce((sum, r) => sum + (parseInt(r.guest_count, 10) || 0), 0);
          if (total >= RSVP_LIMIT) {
            setIsFull(true);
            setLoading(false);
            return;
          }
        }
      }

      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email ? formData.email.trim().toLowerCase() : null,
        phone: formData.phone ? formData.phone.trim() : null,
        guest_count: formData.attendance === 'accepted' ? 1 : 0,
        attendance: formData.attendance,
        message: formData.message.trim() || null,
        status: 'pending',
      };

      const { data, error } = await supabase.from('rsvps').insert(payload);

      if (error) {
        throw error;
      }

      // Dispatch instant email notification to jamesandcristel@gmail.com
      sendRsvpNotification(payload).catch((notifErr) => {
        console.warn('Notification dispatch error (non-blocking):', notifErr);
      });

      // Also cache locally on this browser as a reliable instant backup
      try {
        const localSaved = JSON.parse(localStorage.getItem('james_cristel_submitted_rsvps') || '[]');
        const newLocalItem = {
          id: 'local-' + Date.now(),
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem('james_cristel_submitted_rsvps', JSON.stringify([newLocalItem, ...localSaved]));
      } catch (e) {
        // ignore localStorage error
      }

      setSubmittedAttendance(formData.attendance);
      setSubmitted(true);

      if (formData.attendance === 'accepted') {
        // Luxury golden & champagne confetti celebration
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#C8A84B', '#F0D060', '#E8D5A8', '#FFFFFF', '#D4AF37'],
        });
        setTimeout(() => confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 }, colors: ['#C8A84B', '#FAF6EF', '#FFFFFF'] }), 400);
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      setErrorMsg('Unable to submit your RSVP at this time. Please try again or reach out to us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      attendance: 'accepted',
      message: '',
    });
  };

  // Show a simple skeleton while checking capacity
  if (capacityLoading) {
    return (
      <section id="rsvp" className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(170deg, #FAF6EF 0%, #F5EBDA 100%)' }}>
        <FloralCornerAccents />
        <div className="max-w-2xl mx-auto relative z-10">
          <SectionHeader scriptTitle="R.S.V.P" uppercase="Response Requested" />
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C8A84B' }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #FAF6EF 0%, #F5EBDA 100%)' }}>
      <FloralCornerAccents />
      <div className="max-w-2xl mx-auto relative z-10">
        <SectionHeader scriptTitle="R.S.V.P" uppercase="Response Requested" />
        <p className="text-center text-sm font-light leading-relaxed max-w-md mx-auto -mt-6 mb-10 font-poppins" style={{ color: '#6B5840' }}>
          Your presence would mean so much to us as we celebrate this special day.
        </p>

        {/* Capacity Reached Banner */}
        {isFull ? (
          <GoldBorderFrame className="rounded-3xl animate-fadeIn" innerPad={false}>
            <div className="p-8 sm:p-14 text-center">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg,#F5EBDA,#E4D0AC)', border: '1.5px solid #C8A84B' }}>
                <Heart className="w-8 h-8" style={{ color: '#C8A84B' }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase mb-4 font-poppins" style={{ color: '#3D2B1A' }}>
                Guest List Full
              </h3>
              <div className="py-5 px-6 rounded-2xl max-w-md mx-auto"
                style={{ background: 'rgba(200,168,75,0.08)', border: '1px solid rgba(200,168,75,0.30)' }}>
                <p className="text-sm font-light leading-relaxed font-poppins" style={{ color: '#6B5840' }}>
                  Thank you for visiting our wedding invitation. We have reached our guest capacity and are not accepting additional RSVPs at this time. Thank you for understanding!&nbsp;<Heart className="inline-block w-4 h-4 align-middle" style={{ color: '#C8A84B', fill: '#C8A84B' }} />
                </p>
              </div>
            </div>
          </GoldBorderFrame>
        ) : submitted ? (
          <GoldBorderFrame className="rounded-3xl animate-fadeIn" innerPad={false}>
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg,#F5EBDA,#E4D0AC)', border: '1.5px solid #C8A84B' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: '#3D2B1A' }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase mb-3 font-poppins" style={{ color: '#3D2B1A' }}>
                Thank You
              </h3>
              <p className="text-sm font-light mb-4 font-poppins" style={{ color: '#6B5840' }}>
                Your RSVP has been received.
              </p>
              <div className="py-4 px-6 rounded-2xl max-w-md mx-auto mb-8"
                style={{ background: 'rgba(200,168,75,0.08)', border: '1px solid rgba(200,168,75,0.30)' }}>
                <p className="text-sm font-medium font-poppins" style={{ color: '#3D2B1A' }}>
                  {submittedAttendance === 'accepted'
                    ? 'We look forward to celebrating with you at Chateau By The Sea.'
                    : 'Thank you for letting us know. You will be missed!'}
                </p>
              </div>
              <button onClick={handleReset}
                className="py-2.5 px-6 rounded-full text-xs font-medium tracking-wider uppercase transition-colors font-poppins"
                style={{ background: 'rgba(255,252,246,0.90)', border: '1px solid rgba(200,168,75,0.40)', color: '#3D2B1A' }}>
                Submit Another Response
              </button>
            </div>
          </GoldBorderFrame>
        ) : (
          /* RSVP Form */
          <GoldBorderFrame className="rounded-3xl" innerPad={false}>
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Attendance Selection Cards */}
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-weddingBrown mb-3">
                  Will You Attend? <span className="text-gold">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Accept Card */}
                  <label
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center text-center ${
                      formData.attendance === 'accepted'
                        ? 'border-gold bg-champagne/25 shadow-sm'
                        : 'border-taupe/30 hover:border-gold/50 bg-white/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value="accepted"
                      checked={formData.attendance === 'accepted'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weddingBrown mb-1">
                      Accepts with Pleasure
                    </span>
                    <span className="text-[11px] text-taupe-dark font-light">
                      Can’t wait to celebrate with you
                    </span>
                  </label>

                  {/* Decline Card */}
                  <label
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center text-center ${
                      formData.attendance === 'declined'
                        ? 'border-gold bg-champagne/25 shadow-sm'
                        : 'border-taupe/30 hover:border-gold/50 bg-white/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value="declined"
                      checked={formData.attendance === 'declined'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weddingBrown mb-1">
                      Declines with Regret
                    </span>
                    <span className="text-[11px] text-taupe-dark font-light">
                      Sending love from afar
                    </span>
                  </label>

                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold tracking-[0.2em] uppercase text-weddingBrown mb-2">
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-taupe/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm text-weddingBrown placeholder:text-taupe/60 transition-all"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-[0.2em] uppercase text-weddingBrown mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/80 border border-taupe/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm text-weddingBrown placeholder:text-taupe/60 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold tracking-[0.2em] uppercase text-weddingBrown mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/80 border border-taupe/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm text-weddingBrown placeholder:text-taupe/60 transition-all"
                  />
                </div>
              </div>

              {/* Attendance note: each guest RSVPs individually */}
              {formData.attendance === 'accepted' && (
                <div className="p-3 rounded-xl text-xs font-light font-poppins flex items-start gap-2"
                  style={{ background: 'rgba(200,168,75,0.08)', border: '1px solid rgba(200,168,75,0.25)', color: '#6B5840' }}>
                  <Heart className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#C8A84B' }} />
                  <span>Each guest is kindly requested to RSVP individually. Your reservation covers yourself only.</span>
                </div>
              )}

              {/* Message to the Couple */}
              <div>
                <label htmlFor="message" className="block text-xs font-semibold tracking-[0.2em] uppercase text-weddingBrown mb-2">
                  Special Message to the Couple <span className="text-taupe font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  placeholder="Share your warm wishes or memories..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-taupe/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm text-weddingBrown placeholder:text-taupe/60 transition-all resize-none"
                />
              </div>

              {/* Validation / Error Banner */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-weddingBrown hover:bg-weddingBrown-light disabled:opacity-70 text-champagne-light text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase transition-all shadow-wedding hover:shadow-wedding-lg flex items-center justify-center gap-2 border border-gold/40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Submitting RSVP...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-gold" />
                    <span>Send RSVP</span>
                  </>
                )}
              </button>

            </form>
          </div>
          </GoldBorderFrame>
        )}

      </div>
    </section>
  );
}
