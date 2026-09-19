import React, { useState, useEffect } from 'react';
import WeddingEnvelope from './components/wedding/WeddingEnvelope';
import Hero from './components/wedding/Hero';
import Countdown from './components/wedding/Countdown';
import CoupleSection from './components/wedding/CoupleSection';
import WeddingDetails from './components/wedding/WeddingDetails';
import Timeline from './components/wedding/Timeline';
import DressCode from './components/wedding/DressCode';
import Entourage from './components/wedding/Entourage';
import RSVPForm from './components/wedding/RSVPForm';
import Footer from './components/wedding/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { supabase } from './lib/supabase';

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname || '/');
  const [adminSession, setAdminSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Sync route with browser popstate and URL
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Check auth session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setAdminSession(data?.session || null);
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnvelopeOpened = () => {
    setEnvelopeOpened(true);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Route Handling
  const isAdminRoute = currentRoute.startsWith('/admin');
  const isAdminLoginRoute = currentRoute === '/admin/login';

  // If visiting an admin protected route without authentication, redirect to /admin/login
  if (isAdminRoute && !isAdminLoginRoute && !adminSession && !checkingAuth) {
    return (
      <AdminLogin
        onLoginSuccess={(session) => {
          setAdminSession(session);
          navigate('/admin');
        }}
        onBackToInvitation={() => navigate('/')}
      />
    );
  }

  // Admin Login Screen
  if (isAdminLoginRoute) {
    return (
      <AdminLogin
        onLoginSuccess={(session) => {
          setAdminSession(session);
          navigate('/admin');
        }}
        onBackToInvitation={() => navigate('/')}
      />
    );
  }

  // Authenticated Admin Dashboard
  if (isAdminRoute && adminSession) {
    return (
      <AdminDashboard
        onLogout={async () => {
          await supabase.auth.signOut();
          setAdminSession(null);
          navigate('/admin/login');
        }}
        onReturnHome={() => navigate('/')}
      />
    );
  }

  // Main Public Wedding Invitation Experience
  return (
    <div className="relative min-h-screen bg-ivory text-weddingText font-poppins selection:bg-champagne selection:text-weddingBrown overflow-x-hidden">
      
      {/* 1. Opening Envelope Experience (Shown until clicked) */}
      {!envelopeOpened && (
        <WeddingEnvelope onEnvelopeOpened={handleEnvelopeOpened} />
      )}

      {/* 2. Main Wedding Invitation Sections */}
      <main className={`relative transition-opacity duration-1000 ${envelopeOpened ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Hero Section */}
        <Hero
          onRsvpClick={() => scrollToSection('rsvp')}
          onDetailsClick={() => scrollToSection('details')}
        />

        {/* Live Countdown to January 28, 2027 */}
        <Countdown />

        {/* Romantic Couple Profile & Welcoming Quote */}
        <CoupleSection />

        {/* Wedding Date, Time & Venue Details (Chateau By The Sea, Cebu) */}
        <WeddingDetails />

        {/* Day-of Timeline Itinerary */}
        <Timeline />

        {/* Attire Guidelines, Palette Swatches, Original Fashion Mockups, Ninong/Ninang */}
        <DressCode />

        {/* Parents, Principal Sponsors & Bridal Entourage */}
        <Entourage />

        {/* Interactive RSVP Form with Supabase Integration */}
        <RSVPForm />

        {/* Footer with Discreet Admin Access */}
        <Footer onAdminClick={() => navigate('/admin/login')} />

      </main>
    </div>
  );
}
