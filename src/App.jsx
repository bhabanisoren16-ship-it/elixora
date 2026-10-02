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
import { initSmoothScroll, destroySmoothScroll, pauseSmoothScroll, resumeSmoothScroll, scrollToTarget } from './utils/smoothScroll';
import { Shield, Megaphone } from 'lucide-react';
import { adminStore } from './utils/adminStore';

const HolographicTicketModal = lazy(() => import('./components/HolographicTicketModal'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));

function checkIsAdminRoute() {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hash === '#admin' ||
    window.location.pathname === '/admin' ||
    window.location.pathname.endsWith('/admin') ||
    window.location.search.includes('admin')
  );
}

export default function App() {
  const [passData, setPassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeniorPortalOpen, setIsSeniorPortalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(checkIsAdminRoute);
  const [broadcast, setBroadcast] = useState(() => {
    const s = adminStore.getSettings();
    return { active: s.broadcastActive, message: s.broadcastMessage };
  });

  // Initialize high-performance buttery smooth scrolling (Lenis)
  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      destroySmoothScroll();
    };
  }, []);

  // Pause background smooth scroll when modals or admin portal are active
  useEffect(() => {
    if (isModalOpen || isSeniorPortalOpen || isAdminOpen) {
      pauseSmoothScroll();
    } else {
      resumeSmoothScroll();
    }
  }, [isModalOpen, isSeniorPortalOpen, isAdminOpen]);

  // Synchronize Admin Portal URL hash and keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleRouteChange = () => {
      if (checkIsAdminRoute()) {
        setIsAdminOpen(true);
      }
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    const handleAdminStorageUpdate = () => {
      const s = adminStore.getSettings();
      setBroadcast({ active: s.broadcastActive, message: s.broadcastMessage });
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('elixora_admin_update', handleAdminStorageUpdate);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('elixora_admin_update', handleAdminStorageUpdate);
    };
  }, []);

  // Update hash when isAdminOpen changes
  useEffect(() => {
    if (isAdminOpen) {
      if (window.location.hash !== '#admin') {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search + '#admin');
        } catch (e) {}
      }
    } else {
      if (window.location.hash === '#admin') {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {}
      }
    }
  }, [isAdminOpen]);

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
        if (window.location.hash !== '#admin') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }
    } catch (e) {}
  }, []);

  const handlePassGenerated = (generatedPass) => {
    setPassData(generatedPass);
    setIsModalOpen(true);
  };

  const handleScrollToRegister = () => {
    scrollToTarget('#register');
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 selection:bg-cyber-violet selection:text-white">
      
      {/* Live Organizer Broadcast Marquee Banner (Configurable in Admin Portal) */}
      {broadcast?.active && broadcast?.message && (
        <aside 
          aria-label="Live event announcement"
          className="relative z-50 bg-gradient-to-r from-obsidian-950 via-cyan-950/70 to-obsidian-950 border-b border-cyan-500/40 text-cyan-200 px-3 py-1.5 text-xs font-mono flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-2 overflow-hidden">
              <Megaphone className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs truncate font-medium text-cyan-100">
                {broadcast.message}
              </span>
            </div>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[10px] text-cyan-400 hover:text-white underline shrink-0 cursor-pointer hidden sm:block"
            >
              Nexus Control
            </button>
          </div>
        </aside>
      )}

      {/* 1. Fullscreen Poster Background with 2D Lightning & No 3D Effect */}
      <Background />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenPass={() => setIsModalOpen(true)}
        hasGeneratedPass={!!passData}
        onOpenAdmin={() => setIsAdminOpen(true)}
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

      {/* 5. ELIXORA 2.0 Command Nexus & Admin Operations Portal */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminPortal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onOpenTicket={(ticket) => {
              setPassData(ticket);
              setIsModalOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* 6. Quick Floating Back-to-Home Action */}
      <FloatingHomeButton />

    </div>
  );
}
