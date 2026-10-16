import React, { useState, useEffect, Suspense, lazy } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import LineupSection from './components/LineupSection';
import RegistrationPayment from './components/RegistrationPayment';
import SeniorSection from './components/SeniorSection';
import FloatingHomeButton from './components/FloatingHomeButton';
import { SciFiOrbitalLoader, CelestialCurtain, CyberneticHud, initGlobalScrambleListener } from './innovission';
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

  // Cinematic Sci-Fi Orbital Loader & Curtain State
  const [showOrbitalLoader, setShowOrbitalLoader] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isDirectRoute =
      window.location.hash.includes('admin') ||
      window.location.pathname.includes('admin');
    return !isDirectRoute;
  });
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
    if (isModalOpen || isSeniorPortalOpen || isAdminOpen || showCurtain || showOrbitalLoader) {
      pauseSmoothScroll();
    } else {
      resumeSmoothScroll();
    }
  }, [isModalOpen, isSeniorPortalOpen, isAdminOpen, showCurtain, showOrbitalLoader]);

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
        } catch (e) {}
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
    } catch (e) {}
  }, []);

  const handlePassGenerated = (generatedPass) => {
    setPassData(generatedPass);
    setIsModalOpen(true);
  };

  const handleScrollToRegister = () => {
    scrollToTarget('#register');
  };

  // Dynamic Loading Screen Speed: Automatically increased speed on page refresh
  const [loaderDuration, setLoaderDuration] = useState(() => {
    if (typeof window === 'undefined') return 1.1;
    try {
      const navEntries = performance.getEntriesByType('navigation');
      const isReload =
        (navEntries && navEntries[0]?.type === 'reload') ||
        window.performance?.navigation?.type === 1 ||
        sessionStorage.getItem('elixora_visited') === 'true';

      sessionStorage.setItem('elixora_visited', 'true');
      // When refreshed or reloaded, increase speed to 1.1s (crisp and high-speed)
      return isReload ? 1.1 : 1.4;
    } catch (e) {
      return 1.1;
    }
  });
  const [isReplayingIntro, setIsReplayingIntro] = useState(false);

  const handleOrbitalLoaderComplete = () => {
    setShowOrbitalLoader(false);
    setShowCurtain(true);
    setIsReplayingIntro(false);
  };

  const handleCurtainComplete = () => {
    setShowCurtain(false);
  };

  const handleReplayIntro = () => {
    setIsReplayingIntro(true);
    setLoaderDuration(1.2);
    setShowOrbitalLoader(true);
  };

  return (
    <div className="relative min-h-screen bg-[#040508] text-slate-100 selection:bg-purple-600 selection:text-white font-outfit">
      
      {/* 0. Sci-Fi Orbital Alignment Preloader Animation */}
      {showOrbitalLoader && (
        <SciFiOrbitalLoader
          duration={loaderDuration}
          onComplete={handleOrbitalLoaderComplete}
        />
      )}

      {/* 0.5. Procedural SVG Celestial Cloud Curtain Transition */}
      {showCurtain && (
        <CelestialCurtain
          isActive={showCurtain}
          onComplete={handleCurtainComplete}
        />
      )}

      {/* 1. Fullscreen Concert Poster & Lighting Atmosphere Background */}
      <Background />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenPass={() => setIsModalOpen(true)}
        hasGeneratedPass={!!passData}
      />

      {/* 3. Main Content Flow */}
      <main className="relative z-10 flex flex-col">
        {/* Hero Section with Celestial Disc & Orbiting Rings Parallax */}
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

      {/* 6. Cybernetic Telemetry HUD with ScrambleText & Replay Trigger */}
      <CyberneticHud
        onReplayIntro={handleReplayIntro}
        onOpenPass={() => setIsModalOpen(true)}
        hasPass={!!passData}
      />

      {/* 7. Quick Floating Back-to-Home Action */}
      <FloatingHomeButton />

    </div>
  );
}

