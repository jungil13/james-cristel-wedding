import React from 'react';
import { Mail, CheckCircle, XCircle, Clock, Users } from 'lucide-react';

export default function DashboardStats({ rsvps = [] }) {
  const totalRsvps = rsvps.length;
  
  const acceptedRsvps = rsvps.filter(
    (r) => r.attendance === 'accepted' || r.status === 'confirmed'
  ).length;

  const declinedRsvps = rsvps.filter(
    (r) => r.attendance === 'declined' || r.status === 'declined'
  ).length;

  const pendingRsvps = rsvps.filter(
    (r) => r.status === 'pending'
  ).length;

  const totalGuests = rsvps
    .filter((r) => r.attendance === 'accepted' || r.status === 'confirmed')
    .reduce((sum, r) => sum + (parseInt(r.guest_count, 10) || 1), 0);

  const statCards = [
    {
      title: 'TOTAL RSVPs',
      value: totalRsvps,
      icon: Mail,
      accent: 'text-weddingBrown',
      bg: 'bg-white/80',
    },
    {
      title: 'ACCEPTED',
      value: acceptedRsvps,
      icon: CheckCircle,
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50/60',
    },
    {
      title: 'DECLINED',
      value: declinedRsvps,
      icon: XCircle,
      accent: 'text-amber-800',
      bg: 'bg-amber-50/60',
    },
    {
      title: 'PENDING',
      value: pendingRsvps,
      icon: Clock,
      accent: 'text-gold',
      bg: 'bg-champagne/30',
    },
    {
      title: 'TOTAL GUESTS',
      value: totalGuests,
      icon: Users,
      accent: 'text-weddingBrown',
      bg: 'bg-white/90',
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.title}
            className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 hover:shadow-wedding flex flex-col justify-between ${stat.bg} ${
              stat.highlight ? 'border-gold/60 shadow-sm col-span-2 sm:col-span-1' : 'border-champagne/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-taupe-dark">
                {stat.title}
              </span>
              <IconComponent className={`w-4 h-4 ${stat.accent}`} />
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-light text-weddingBrown tracking-tight font-poppins">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
