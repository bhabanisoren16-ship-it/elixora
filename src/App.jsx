import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import LineupSection from './components/LineupSection';
import RegistrationPayment from './components/RegistrationPayment';
import SeniorSection from './components/SeniorSection';
import FloatingHomeButton from './components/FloatingHomeButton';
import CinematicIntro from './components/CinematicIntro';
import { SciFiOrbitalLoader, CelestialCurtain, initGlobalScrambleListener } from './innovission';
import { initSmoothScroll, destroySmoothScroll, pauseSmoothScroll, resumeSmoothScroll, scrollToTarget } from './utils/smoothScroll';

import HolographicTicketModal from './components/HolographicTicketModal';
import AdminPortal from './components/AdminPortal';

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

/**
 * Distinguish between Home Screen Initial Visit vs Dedicated Refresh Page
 * - Home Screen Loading Page: Celestial Armillary Stargate with ENTER option (strictly requires user to click/press ENTER).
 * - Refresh Page: Automated Real-Time Celestial Telemetry Synchronization (000% -> 100% in ~1.3s, NO enter button).
 */
function detectInitialLoadState() {
  if (typeof window === 'undefined') {
    return { isRefresh: false, isHomeLoading: false };
  }

  // Bypass on direct admin / senior portal hash routes
  if (checkIsAdminRoute() || checkIsSeniorPortalRoute()) {
    return { isRefresh: false, isHomeLoading: false };
  }

  // URL parameters / hashes for previewing or testing
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash;

  if (searchParams.get('loader') === 'refresh' || hash === '#preview-refresh') {
    return { isRefresh: true, isHomeLoading: false };
  }
  if (searchParams.get('loader') === 'home' || hash === '#preview-home-loader') {
    return { isRefresh: false, isHomeLoading: true };
  }

  let isBrowserReload = false;
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      isBrowserReload = navEntries[0].type === 'reload';
    } else if (window.performance && window.performance.navigation) {
      isBrowserReload = window.performance.navigation.type === 1;
    }
  } catch (e) { }

  const hasEnteredHomepage = sessionStorage.getItem('elixora_entered_homepage') === 'true';

  // 1. REFRESH PAGE: Only if the user has ALREADY entered the homepage in this session and then reloads
  if (hasEnteredHomepage && isBrowserReload) {
    return { isRefresh: true, isHomeLoading: false };
  }

  // 2. WHEN USER OPENS WEBSITE: ALWAYS show Home Loading Page and STAY STUCK on it until user clicks ENTER HOME PAGE!
  return { isRefresh: false, isHomeLoading: true };
}

export default function App() {
  const [passData, setPassData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('elixora_last_generated_pass');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeniorPortalOpen, setIsSeniorPortalOpen] = useState(checkIsSeniorPortalRoute);
  const [isAdminOpen, setIsAdminOpen] = useState(checkIsAdminRoute);

  // Separate states for Home Screen Loading Page and dedicated Refresh Page
  const [initialLoad] = useState(detectInitialLoadState);
  const [showHomeLoadingPage, setShowHomeLoadingPage] = useState(initialLoad.isHomeLoading);
  const [showRefreshPage, setShowRefreshPage] = useState(initialLoad.isRefresh);
  const [showCurtain, setShowCurtain] = useState(false);

  // Initialize global hover ScrambleText listener
  useEffect(() => {
    const cleanupScramble = initGlobalScrambleListener();
    return () => cleanupScramble?.();
  }, []);

  // Initialize high-performance buttery smooth scrolling (Lenis)
  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      destroySmoothScroll();
    };
  }, []);


  // Pause background smooth scroll when modals, admin portal, or loading screen are active
  useEffect(() => {
    if (isModalOpen || isSeniorPortalOpen || isAdminOpen || showRefreshPage || showHomeLoadingPage) {
      pauseSmoothScroll();
    } else {
      resumeSmoothScroll();
    }
  }, [isModalOpen, isSeniorPortalOpen, isAdminOpen, showRefreshPage, showHomeLoadingPage]);

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
        } catch (e) { }
      }
    } else {
      if (window.location.hash === '#admin') {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) { }
      }
    }
  }, [isAdminOpen]);

  // Handle page load: on refresh, never show or scroll to register option; display loading page from top
  useEffect(() => {
    try {
      const isSeniorPortalActive = checkIsSeniorPortalRoute();
      if (isSeniorPortalActive) {
        setIsSeniorPortalOpen(true);
        return;
      }

      const isAdminActive = checkIsAdminRoute();
      if (isAdminActive) {
        setIsAdminOpen(true);
        return;
      }

      // Always clear any #register or section hash on refresh so the user is never sent to register
      const hash = window.location.hash;
      if (hash && hash !== '#admin' && !hash.includes('senior')) {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) { }
      }

      // Reset scroll position to absolute top
      window.scrollTo(0, 0);

      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
      document.body.classList.remove('lenis-stopped');

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    } catch (e) { }
  }, []);

  const handlePassGenerated = (generatedPass) => {
    try {
      sessionStorage.setItem('elixora_last_generated_pass', JSON.stringify(generatedPass));
    } catch (e) {}
    setPassData(generatedPass);
    setIsModalOpen(true);
  };

  const handleScrollToRegister = () => {
    scrollToTarget('#register');
  };

  const handleCurtainComplete = useCallback(() => {
    setShowCurtain(false);
  }, []);

  // When user clicks the ENTER button on the Home Screen Loading Page:
  const handleHomeLoadingEnter = () => {
    try {
      sessionStorage.setItem('elixora_entered_homepage', 'true');
    } catch (e) { }
    setShowHomeLoadingPage(false);
    setShowCurtain(true);
  };

  // When the Refresh Page finishes its telemetry synchronization:
  const handleRefreshComplete = () => {
    setShowRefreshPage(false);
    setShowCurtain(true);
  };

  // Replaying intro from HUD replays the Home Screen Loading Page with the ENTER button:
  const handleReplayIntro = () => {
    setShowHomeLoadingPage(true);
  };

  return (
    <div className="relative min-h-screen bg-[#040508] text-slate-100 selection:bg-purple-600 selection:text-white font-outfit">

      {/* 0. Home Screen Loading Page (Celestial Orbital Planetary Gateway from Screenshot - STRICTLY requires user to click/press ENTER to open homepage) */}
      {showHomeLoadingPage && (
        <CinematicIntro
          duration={2.4}
          onComplete={handleHomeLoadingEnter}
        />
      )}

      {/* 0.1. Dedicated Real-Time Refresh Page (Celestial Conjunction & Telemetry Sync - Automated, NO enter button) */}
      {showRefreshPage && (
        <SciFiOrbitalLoader
          duration={1.2}
          onComplete={handleRefreshComplete}
        />
      )}

      {/* 0.2. Celestial Curtains Reveal (Plays exclusively after loading the page) */}
      {showCurtain && (
        <CelestialCurtain
          duration={0.85}
          onComplete={handleCurtainComplete}
        />
      )}

      {/* 1. Fullscreen Concert Poster & Lighting Atmosphere Background */}
      <Background />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenPass={() => {
          if (!passData) {
            try {
              const saved = sessionStorage.getItem('elixora_last_generated_pass');
              if (saved) {
                setPassData(JSON.parse(saved));
                setIsModalOpen(true);
                return;
              }
            } catch (e) {}
            scrollToTarget('#register');
            return;
          }
          setIsModalOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        hasGeneratedPass={!!passData}
      />

      {/* 3. Main Content Flow */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <HeroSection
          onGrabPassClick={handleScrollToRegister}
        />

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
        <HolographicTicketModal
          passData={passData}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* 5. ELIXORA 2.0 Command Nexus & Admin Operations Portal */}
      {isAdminOpen && (
        <AdminPortal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onOpenTicket={(ticket) => {
            setPassData(ticket);
            setIsModalOpen(true);
          }}
        />
      )}



      {/* 7. Quick Floating Back-to-Home Action */}
      <FloatingHomeButton />

    </div>
  );
}

