import React, { useState } from 'react';
import { X, Check, XCircle, Clock, Calendar, Mail, Phone, Users, MessageSquare, Utensils, AlertTriangle } from 'lucide-react';

export default function RSVPDetails({ rsvp, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false);

  if (!rsvp) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onUpdateStatus(rsvp.id, newStatus);
    setUpdating(false);
  };

  const formattedDate = rsvp.created_at
    ? new Date(rsvp.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-weddingBrown/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="wedding-card rounded-3xl max-w-lg w-full p-6 sm:p-8 bg-white border-gold shadow-2xl relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-label="RSVP Details"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-ivory border border-taupe/30 flex items-center justify-center text-taupe-dark hover:text-weddingBrown hover:bg-champagne/30 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-champagne/60 pr-8">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-gold uppercase">
            Guest Response Details
          </span>
          <h2 className="text-2xl font-light text-weddingBrown tracking-wide mt-1">
            {rsvp.full_name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                rsvp.attendance === 'accepted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {rsvp.attendance === 'accepted' ? 'Attending' : 'Declined'}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                rsvp.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : rsvp.status === 'declined'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              Status: {rsvp.status}
            </span>
          </div>
        </div>

        {/* Information Grid */}
        <div className="space-y-4 mb-8 text-sm">
          
          <div className="flex items-start gap-3 text-weddingBrown">
            <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-taupe-dark font-medium block">Email Address</span>
              <span className="font-light">{rsvp.email || 'None provided'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-weddingBrown">
            <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-taupe-dark font-medium block">Phone Number</span>
              <span className="font-light">{rsvp.phone || 'None provided'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-weddingBrown">
            <Users className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-taupe-dark font-medium block">Party Size</span>
              <span className="font-light">{rsvp.guest_count} {rsvp.guest_count === 1 ? 'Guest' : 'Guests'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-weddingBrown">
            <Utensils className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-taupe-dark font-medium block">Dietary Restrictions</span>
              <span className="font-light">{rsvp.dietary_restrictions || 'No special dietary requirements stated.'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-weddingBrown">
            <MessageSquare className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-taupe-dark font-medium block">Guest Message</span>
              <p className="font-light italic text-weddingText-muted leading-relaxed mt-0.5">
                "{rsvp.message || 'No personal message included.'}"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-weddingBrown">
            <Calendar className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-taupe-dark font-medium block">Submission Date</span>
              <span className="font-light text-xs text-taupe-dark">{formattedDate}</span>
            </div>
          </div>

        </div>

        {/* Update Status Controls */}
        <div className="pt-5 border-t border-champagne/60">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-weddingBrown block mb-3">
            Change Management Status
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('confirmed')}
              disabled={updating || rsvp.status === 'confirmed'}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 text-white text-xs font-medium tracking-wider uppercase hover:bg-emerald-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm</span>
            </button>

            <button
              onClick={() => handleStatusChange('declined')}
              disabled={updating || rsvp.status === 'declined'}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-800 text-white text-xs font-medium tracking-wider uppercase hover:bg-amber-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Decline</span>
            </button>

            <button
              onClick={() => handleStatusChange('pending')}
              disabled={updating || rsvp.status === 'pending'}
              className="flex-1 py-2 px-3 rounded-xl bg-ivory text-weddingBrown border border-taupe/40 text-xs font-medium tracking-wider uppercase hover:bg-champagne/30 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Set Pending</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
