import React, { useState, useEffect, Suspense, lazy } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import LineupSection from './components/LineupSection';
import RegistrationPayment from './components/RegistrationPayment';
import SeniorSection from './components/SeniorSection';
import FloatingHomeButton from './components/FloatingHomeButton';
import { initSmoothScroll, destroySmoothScroll, pauseSmoothScroll, resumeSmoothScroll, scrollToTarget } from './utils/smoothScroll';

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

function checkIsSeniorPortalRoute() {
  if (typeof window === 'undefined') return false;
  return window.location.hash === '#senior-portal';
}

export default function App() {
  const [passData, setPassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeniorPortalOpen, setIsSeniorPortalOpen] = useState(checkIsSeniorPortalRoute);
  const [isAdminOpen, setIsAdminOpen] = useState(checkIsAdminRoute);

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

  // Synchronize URL hash for Admin Portal and Senior VIP Portal
  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminOpen(checkIsAdminRoute());
      setIsSeniorPortalOpen(checkIsSeniorPortalRoute());
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
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

  // Handle page load: ensure clean default state for regular users on every visit (admin data preserved)
  useEffect(() => {
    try {
      localStorage.removeItem('elixora_senior_roll');
      localStorage.removeItem('elixora_senior_portal_open');
      localStorage.removeItem('elixora_senior_form');
      sessionStorage.removeItem('elixora_senior_roll');
      sessionStorage.removeItem('elixora_senior_portal_open');
      sessionStorage.removeItem('elixora_senior_form');

      // Explicitly reset any lingering body scroll lock styles
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      if (typeof window !== 'undefined') {
        if (!window.location.hash && !window.location.pathname.includes('admin')) {
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
    scrollToTarget('#seniors');
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

        {/* Senior VIP Portal & Gated Access (Default Registration Pass) */}
        <SeniorSection
          onPassGenerated={handlePassGenerated}
          onPortalToggle={setIsSeniorPortalOpen}
        />

        {/* Registration & Dynamic UPI Payment (Freshers Checkout) */}
        <RegistrationPayment
          onPassGenerated={handlePassGenerated}
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
