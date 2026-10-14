import React, { useState, useEffect, Suspense, lazy } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import PartyExperience from './components/PartyExperience';
import InteractiveGallery from './components/InteractiveGallery';
import LineupSection from './components/LineupSection';
import RegistrationPayment from './components/RegistrationPayment';
import SeniorSection from './components/SeniorSection';
import FinalCinematicSection from './components/FinalCinematicSection';
import FloatingHomeButton from './components/FloatingHomeButton';
import CinematicIntro from './components/CinematicIntro';
import { initSmoothScroll, destroySmoothScroll, pauseSmoothScroll, resumeSmoothScroll, scrollToTarget } from './utils/smoothScroll';
import { initScrollStory } from './utils/scrollStory';

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
  try {
    return (
      window.location.hash === '#senior-portal' ||
      sessionStorage.getItem('elixora_senior_portal_open') === 'true'
    );
  } catch (e) {
    return false;
  }
}

export default function App() {
  const [passData, setPassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeniorPortalOpen, setIsSeniorPortalOpen] = useState(checkIsSeniorPortalRoute);
  const [isAdminOpen, setIsAdminOpen] = useState(checkIsAdminRoute);

  // Cinematic 3-5s opening sequence state
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const hasSeen = sessionStorage.getItem('elixora_intro_seen');
      const isDirectRoute = window.location.hash && window.location.hash !== '#hero';
      return !hasSeen && !isDirectRoute;
    } catch (e) {
      return false;
    }
  });

  // Initialize high-performance buttery smooth scrolling (Lenis)
  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      destroySmoothScroll();
    };
  }, []);

  // Initialize GSAP ScrollTrigger Choreography
  useEffect(() => {
    const cleanupStory = initScrollStory();
    return () => {
      cleanupStory?.();
    };
  }, []);

  // Pause background smooth scroll when modals, admin portal, or cinematic intro are active
  useEffect(() => {
    if (isModalOpen || isSeniorPortalOpen || isAdminOpen || showIntro) {
      pauseSmoothScroll();
    } else {
      resumeSmoothScroll();
    }
  }, [isModalOpen, isSeniorPortalOpen, isAdminOpen, showIntro]);

  // Synchronize URL hash for Admin Portal and Senior VIP Portal
  useEffect(() => {
    const handleRouteChange = () => {
      if (checkIsAdminRoute()) {
        setIsAdminOpen(true);
      }
      if (checkIsSeniorPortalRoute()) {
        setIsSeniorPortalOpen(true);
      }
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

  // Handle page load: preserve senior portal on refresh if active, otherwise default to main page
  useEffect(() => {
    try {
      const isSeniorPortalActive = checkIsSeniorPortalRoute();
      if (isSeniorPortalActive) {
        setIsSeniorPortalOpen(true);
        // User refreshed while inside Senior Portal - stay inside portal, do not reset!
        return;
      }

      // Explicitly reset any lingering body scroll lock styles
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
      document.body.classList.remove('lenis-stopped');
      resumeSmoothScroll();

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      if (typeof window !== 'undefined') {
        if (window.location.hash === '#seniors') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        if (window.location.hash !== '#admin' && !window.location.hash.includes('senior')) {
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

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('elixora_intro_seen', 'true');
    } catch (e) {}
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 selection:bg-cyber-violet selection:text-white">
      
      {/* 0. Cinematic Opening Sequence (3–5s Staged Arrival) */}
      {showIntro && (
        <CinematicIntro
          onComplete={handleIntroComplete}
          onRegisterClick={handleScrollToRegister}
        />
      )}

      {/* 1. Fullscreen Concert Poster & Lighting Atmosphere Background */}
      <Background />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenPass={() => setIsModalOpen(true)}
        hasGeneratedPass={!!passData}
      />

      {/* 3. Main Content Flow with Choreographed Storytelling */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Section with 3D Chrome Centerpiece & Live Event Countdown */}
        <HeroSection onGrabPassClick={handleScrollToRegister} />

        {/* Event Blueprint, Schedule & Venue Navigation */}
        <EventDetails />

        {/* Confirmed Party Experiences & Activities */}
        <PartyExperience />

        {/* Interactive Visual Atmosphere & Style Gallery */}
        <InteractiveGallery />

        {/* Mr. & Ms. Fresher Runway Contest */}
        <LineupSection />

        {/* Junior Pass Registration & Dynamic UPI Payment */}
        <RegistrationPayment
          onPassGenerated={handlePassGenerated}
        />

        {/* Senior VIP Portal & Gated Roster Access */}
        <SeniorSection
          onPassGenerated={handlePassGenerated}
          onPortalToggle={setIsSeniorPortalOpen}
        />

        {/* Final Cinematic Climax: "YOUR NIGHT. YOUR PEOPLE. YOUR ELIXORA." */}
        <FinalCinematicSection
          onReplayIntro={handleReplayIntro}
          onRegisterClick={handleScrollToRegister}
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
