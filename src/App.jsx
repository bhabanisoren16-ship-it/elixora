import React, { useState, useEffect, Suspense, lazy } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import LineupSection from './components/LineupSection';
import RegistrationPayment from './components/RegistrationPayment';
import SeniorSection from './components/SeniorSection';
import FloatingHomeButton from './components/FloatingHomeButton';
import { soundController } from './utils/audio';
import { Shield } from 'lucide-react';

const HolographicTicketModal = lazy(() => import('./components/HolographicTicketModal'));

export default function App() {
  const [passData, setPassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeniorPortalOpen, setIsSeniorPortalOpen] = useState(false);

  // Guarantee that loading the website always opens the main page by default
  useEffect(() => {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      localStorage.removeItem('elixora_senior_portal_open');
      sessionStorage.removeItem('elixora_senior_portal_open');
      localStorage.removeItem('elixora_senior_roll');
      sessionStorage.removeItem('elixora_senior_roll');
      if (typeof window !== 'undefined') {
        if (window.location.hash === '#senior-portal' || window.location.hash === '#seniors') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } catch (e) {}
  }, []);

  const handlePassGenerated = (generatedPass) => {
    setPassData(generatedPass);
    setIsModalOpen(true);
  };

  const handleScrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 selection:bg-cyber-violet selection:text-white">
      
      {/* 1. Fullscreen Poster Background with 2D Lightning & No 3D Effect */}
      <Background />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenPass={() => setIsModalOpen(true)}
        hasGeneratedPass={!!passData}
      />

      {/* 3. Main Content Flow */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <HeroSection onGrabPassClick={handleScrollToRegister} />

        {/* Event Details & Navigation Grid */}
        <EventDetails />

        {/* Festival Highlights & Lineup */}
        <LineupSection />

        {/* Registration & Dynamic UPI Payment */}
        <RegistrationPayment
          onPassGenerated={handlePassGenerated}
        />

        {/* Senior VIP Portal & Gated Access */}
        <SeniorSection
          onPassGenerated={handlePassGenerated}
          onPortalToggle={setIsSeniorPortalOpen}
        />
      </main>

      {/* 4. Interactive 3D Holographic Pass Modal */}
      {isModalOpen && passData && (
        <Suspense fallback={null}>
          <HolographicTicketModal
            passData={passData}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}

      {/* 5. Quick Floating Back-to-Home Action */}
      <FloatingHomeButton />

    </div>
  );
}
