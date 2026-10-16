import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Compass, Star } from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { adminStore } from '../utils/adminStore';
import { soundController } from '../utils/audio';

/**
 * Celestial Gateway Home Screen Loading Page for ELIXORA 2.0
 * 
 * Distinctive Features:
 * 1. Deep Celestial Cosmic Space with procedural twinkling stars, stardust sparks, & nebula aura
 * 2. SVG Constellation Charts in 3D parallax depth (Cassiopeia, Cygnus, Orion star matrices)
 * 3. Grand Rotating 3D Celestial Armillary Stargate with astronomical coordinate rings & orbiting planetary bodies
 * 4. 3D Liquid Chrome Typography for ELIXORA 2.0 with chromatic flare
 * 5. Official Gala Badge & Announced/Revealing Soon Date & Venue pill
 * 6. Centerpiece CELESTIAL ENTER OPTION:
 *    - Luminous Celestial Capsule Button with pulsating cosmic plasma aura
 *    - Orbiting stellar satellite particles
 *    - Keyboard shortcut listener: strictly Enter key (or click) to enter homepage
 *    - Stargate warp jump transition on enter
 * 7. Edge-to-edge celestial harmonic frequency sine wave along the base
 */
export default function CinematicIntro({ onComplete, onRegisterClick }) {
  const [phase, setPhase] = useState(0); // 0: Cosmic Ignition, 1: Constellation Grid, 2: Stargate Assembly, 3: Title Reveal, 4: Gala Coordinates, 5: Enter Option Ready
  const [isExiting, setIsExiting] = useState(false);
  const [settings, setSettings] = useState(() => adminStore.getSettings());
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const tiltAnimRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Sync settings dynamically with Admin Portal updates
  useEffect(() => {
    const handleUpdate = () => {
      setSettings(adminStore.getSettings());
    };
    window.addEventListener('elixora_admin_update', handleUpdate);
    return () => window.removeEventListener('elixora_admin_update', handleUpdate);
  }, []);

  // Smooth numerical percentage counter calibrating celestial coordinates (0% to 100% across extended duration)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 3800; // Extended cinematic duration for majestic celestial experience
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // Smooth 3D tilt parallax tracking (cursor on desktop, gyro tilt on mobile)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseTargetRef.current = { x, y };
    };

    const handleDeviceOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.max(-1, Math.min(1, e.gamma / 25));
        const y = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        mouseTargetRef.current = { x, y };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });

    const animateTilt = () => {
      mousePosRef.current.x += (mouseTargetRef.current.x - mousePosRef.current.x) * 0.08;
      mousePosRef.current.y += (mouseTargetRef.current.y - mousePosRef.current.y) * 0.08;
      setMousePos({ x: mousePosRef.current.x, y: mousePosRef.current.y });
      tiltAnimRef.current = requestAnimationFrame(animateTilt);
    };
    tiltAnimRef.current = requestAnimationFrame(animateTilt);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (tiltAnimRef.current) cancelAnimationFrame(tiltAnimRef.current);
    };
  }, []);

  const isDateVenueAnnounced = Boolean(settings.isDateVenueAnnounced);
  const humanDate = settings.eventHumanDate || EVENT_DETAILS.humanDate;
  const venueTitle = settings.venueTitle || EVENT_DETAILS.location;

  // Staged timeline sequence - EXTENDED PACING FOR MAJESTIC CELESTIAL ALIGNMENT
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 350);  // 1: Constellation Grid Awakening
    const t2 = setTimeout(() => setPhase(2), 1000); // 2: 3D Armillary Stargate Assembly
    const t3 = setTimeout(() => setPhase(3), 1800); // 3: Chrome Title & Enter Option Revealed
    const t4 = setTimeout(() => setPhase(4), 2600); // 4: Gala Coordinates & Details
    const t5 = setTimeout(() => setPhase(5), 3500); // 5: Stargate Fully Aligned & Supercharged

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Atmospheric celestial stardust and spark particles in canvas with 3D depth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = width > 768 ? 65 : 35;
    const colors = ['#00f2fe', '#38bdf8', '#c084fc', '#e879f9', '#fbbf24', '#ffffff'];
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.7 + 0.2),
      size: Math.random() * 2.2 + 0.7,
      alpha: Math.random() * 0.7 + 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      depth: Math.random() * 0.8 + 0.4,
      twinkleSpeed: Math.random() * 0.04 + 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const driftX = mousePosRef.current.x * p.depth * 0.5;
        p.x += p.vx + driftX;
        p.y += p.vy;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.twinklePhase) * 0.25);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size > 1.8 ? 12 : 6;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Handle Enter trigger: Warp expansion transition into the homepage
  const handleEnterHomepage = (triggerRegister = false) => {
    if (isExiting) return;
    soundController.playClick?.();
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
      if (triggerRegister) {
        onRegisterClick?.();
      }
    }, 650);
  };

  // Keyboard shortcut: strictly Enter key to enter homepage
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleEnterHomepage(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const letters = ['E', 'L', 'I', 'X', 'O', 'R', 'A'];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05060f] text-white select-none overflow-hidden transition-all duration-700 font-outfit ${
        isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* =========================================================================
          1. DEEP CELESTIAL COSMOS & NEBULA BACKDROP (Parallax Tilt)
         ========================================================================= */}
      <div
        className="absolute inset-[-40px] pointer-events-none select-none overflow-hidden will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg) translate3d(${mousePos.x * -16}px, ${mousePos.y * -12}px, 0px) scale(${phase >= 3 ? 1.04 : 1.0})`,
          transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        {/* Base Deep Cosmic Space Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0f0c29_0%,_#090918_45%,_#03040a_100%)]" />

        {/* Ambient Cosmic Nebula Glowing Clouds */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-fuchsia-600/12 blur-[150px] pointer-events-none" />

        {/* Starlight Conic Array & Cosmic Dust Texture */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vmax] h-[160vmax] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(0,242,254,0.025)_0deg_0.5deg,transparent_0.5deg_8deg)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1.5px)] bg-[size:32px_32px] opacity-45 pointer-events-none" />

        {/* Embedded High-Fidelity Starfield Layer */}
        <img
          src="/assets/starfield.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
        />

        {/* SVG Constellation Matrices (Drifting Cosmic Sky Maps) */}
        <svg
          viewBox="0 0 1200 800"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 transition-opacity duration-1000"
          style={{ opacity: phase >= 1 ? 0.45 : 0 }}
        >
          <defs>
            <linearGradient id="constellationLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Left Celestial Constellation (Cassiopeia / Astral Crown) */}
          <g transform="translate(120, 140) scale(0.9)">
            <polyline
              points="0,60 55,15 110,75 180,25 240,80"
              fill="none"
              stroke="url(#constellationLine)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            {[[0, 60], [55, 15], [110, 75], [180, 25], [240, 80]].map(([cx, cy], idx) => (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#00f2fe]" />
                <circle cx={cx} cy={cy} r="6" fill="none" stroke="#00f2fe" strokeWidth="0.8" opacity="0.6" />
              </g>
            ))}
            <text x="60" y="110" fill="#38bdf8" fontSize="10" fontFamily="monospace" letterSpacing="0.25em" opacity="0.6">
              α-CASSIOPEIA // 01.44°
            </text>
          </g>

          {/* Right Celestial Constellation (Cygnus / Northern Cross) */}
          <g transform="translate(860, 180) scale(0.85)">
            <line x1="80" y1="0" x2="80" y2="160" stroke="url(#constellationLine)" strokeWidth="1.2" strokeDasharray="4 3" />
            <line x1="10" y1="60" x2="150" y2="60" stroke="url(#constellationLine)" strokeWidth="1.2" strokeDasharray="4 3" />
            {[[80, 0], [80, 60], [80, 160], [10, 60], [150, 60]].map(([cx, cy], idx) => (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#c084fc]" />
                <circle cx={cx} cy={cy} r="6" fill="none" stroke="#c084fc" strokeWidth="0.8" opacity="0.6" />
              </g>
            ))}
            <text x="35" y="190" fill="#c084fc" fontSize="10" fontFamily="monospace" letterSpacing="0.25em" opacity="0.6">
              CYGNUS · DENEB // 20.41°
            </text>
          </g>
        </svg>

        {/* Ambient Top & Bottom Depth Vignettes */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#05060f]/90 via-[#05060f]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05060f]/95 via-[#05060f]/50 to-transparent pointer-events-none" />
      </div>

      {/* Floating Sparkles & Dust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* =========================================================================
          2. TOP CELESTIAL TELEMETRY & ASTRONOMICAL HUD
         ========================================================================= */}
      <header className="absolute top-5 left-5 right-5 sm:top-8 sm:left-10 sm:right-10 z-30 flex items-center justify-between pointer-events-none select-none font-mono text-[10px] sm:text-xs">
        {/* Left: Celestial Gateway Identification */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,254,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f2fe]" />
          <span className="font-bold uppercase tracking-[0.22em] text-cyan-300">
            CELESTIAL GATEWAY // ONLINE
          </span>
        </div>

        {/* Right: Astronomical Calibration Status */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-purple-400/30 backdrop-blur-md text-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="font-bold tracking-[0.20em] uppercase">
            ASTRAL SECTOR 2026.04
          </span>
        </div>
      </header>

      {/* =========================================================================
          3. GRAND 3D ROTATING CELESTIAL ARMILLARY STARGATE RINGS
         ========================================================================= */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[620px] md:w-[720px] h-[380px] sm:h-[620px] md:h-[720px] pointer-events-none transition-all duration-1000 will-change-transform"
        style={{
          transform: `translate(-50%, -50%) perspective(1000px) rotateX(${mousePos.y * 7}deg) rotateY(${mousePos.x * -7}deg) scale(${
            isExiting ? 2.2 : phase >= 2 ? 1.0 : 0.75
          })`,
          opacity: phase >= 2 ? (isExiting ? 0 : 0.85) : 0,
        }}
      >
        {/* Outer Astrolabe Horizon Ring with 360-degree Radial Ticks */}
        <div
          className="absolute inset-0 rounded-full border border-cyan-400/25 animate-[spin_60s_linear_infinite]"
          style={{
            boxShadow: '0 0 45px rgba(0, 242, 254, 0.12), inset 0 0 35px rgba(0, 242, 254, 0.08)',
          }}
        >
          {/* Astrolabe Degree Cardinal Markers */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cyan-300/80 tracking-widest">
            000° // NORTH
          </span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cyan-300/80 tracking-widest">
            180° // SOUTH
          </span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 font-mono text-[9px] text-cyan-300/80 tracking-widest">
            270°
          </span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[9px] text-cyan-300/80 tracking-widest">
            090°
          </span>
        </div>

        {/* Orbit Ring 1: Celestial Equator with Orbiting Ringed Planet */}
        <div className="absolute inset-8 sm:inset-12 rounded-full border border-purple-400/35 border-dashed animate-[spin_40s_linear_infinite_reverse]">
          {/* Orbiting Planet Ringed */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src="/assets/planet-ringed.webp"
              alt="Orbiting Ringed Celestial Body"
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_16px_rgba(168,85,247,0.7)]"
            />
          </div>
          {/* Opposite Orbit Node */}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f2fe]" />
        </div>

        {/* Orbit Ring 2: Ecliptic Orbit with Cratered Moon & Asteroids */}
        <div className="absolute inset-20 sm:inset-28 rounded-full border border-pink-400/30 border-dotted animate-[spin_28s_linear_infinite]">
          {/* Orbiting Moon */}
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src="/assets/moon-cratered.webp"
              alt="Orbiting Moon"
              className="w-7 h-7 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_12px_rgba(236,72,153,0.7)]"
            />
          </div>
          {/* Orbiting Asteroid Node */}
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
            <img
              src="/assets/asteroid.webp"
              alt="Asteroid Cluster"
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]"
            />
          </div>
        </div>

        {/* Inner Luminous Stargate Aperture & Celestial Compass Crosshair */}
        <div className="absolute inset-32 sm:inset-44 rounded-full border border-cyan-400/20">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
        </div>

        {/* Central Luminous Celestial Plasma Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-60 h-44 sm:h-60 rounded-full bg-gradient-to-tr from-cyan-500/25 via-purple-600/30 to-pink-500/20 blur-2xl animate-pulse" />
      </div>

      {/* =========================================================================
          4. CENTRAL HERO REVEAL: GALA TITLE & ENTER OPTION
         ========================================================================= */}
      <div
        className="relative z-10 max-w-4xl px-4 text-center flex flex-col items-center will-change-transform"
        style={{
          transform: `perspective(800px) rotateX(${mousePos.y * 4}deg) rotateY(${mousePos.x * -4}deg) translate3d(${mousePos.x * 10}px, ${mousePos.y * 8}px, 20px)`,
          transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        {/* Obsidian Glass Depth Shield behind Central Text for 100% Readability */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[850px] h-[420px] sm:h-[480px] bg-[#05060f]/85 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 1. Celestial Gala Badge */}
        <div
          className={`mb-3 sm:mb-4 transition-all duration-700 transform ${
            phase >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-cyan-400/50 text-cyan-300 shadow-[0_4px_25px_rgba(0,0,0,0.9),0_0_15px_rgba(0,242,254,0.2)] backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase">
              BIOTECHNOLOGY ANNUAL GALA '26 · CELESTIAL ODYSSEY
            </span>
          </div>
        </div>

        {/* 2. 3D Chrome Liquid Typography: ELIXORA 2.0 */}
        <div
          className={`relative select-none transition-all duration-1000 transform ${
            phase >= 3 ? 'opacity-100 scale-100 filter-none translate-y-0' : 'opacity-0 scale-90 filter blur-md translate-y-8'
          }`}
        >
          {/* Chromatic Backing Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 blur-2xl opacity-45 animate-pulse pointer-events-none" />

          {/* Letter Stagger Container */}
          <h1 className="relative font-outfit font-black tracking-tight text-6xl xs:text-7xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 flex items-center justify-center drop-shadow-[0_12px_45px_rgba(0,0,0,1)]">
            {letters.map((char, idx) => (
              <span
                key={idx}
                className="inline-block transition-all duration-700 transform will-change-transform hover:scale-110 hover:text-cyan-200"
                style={{
                  transitionDelay: `${idx * 70}ms`,
                  textShadow: '0 0 30px rgba(0, 242, 254, 0.65), 0 4px 25px rgba(0,0,0,1)',
                }}
              >
                {char}
              </span>
            ))}
            <span className="text-2xl sm:text-4xl text-cyan-400 ml-1.5 sm:ml-2 font-black align-top self-start mt-2 sm:mt-4 drop-shadow-[0_0_18px_rgba(0,242,254,0.9)]">
              2.0
            </span>
          </h1>

          {/* Starlight Glint Horizon Reflection Line */}
          <div className="h-[2px] w-48 sm:w-80 mx-auto mt-2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-85 shadow-[0_0_15px_#00f2fe]" />
        </div>

        {/* 3. Celestial Tagline */}
        <div
          className={`mt-3 sm:mt-4 transition-all duration-700 transform ${
            phase >= 4 ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-6 filter blur-sm'
          }`}
        >
          <p className="font-outfit text-sm sm:text-lg md:text-xl text-white font-black tracking-[0.35em] uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
            A Night to Remember
          </p>
        </div>

        {/* 4. Date & Venue Coordinates Pill */}
        <div
          className={`mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-outfit font-extrabold transition-all duration-700 delay-100 transform ${
            phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {isDateVenueAnnounced ? (
            <>
              <span className="px-4 py-2 rounded-xl bg-black/80 border border-cyan-400/50 text-cyan-200 shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center gap-2">
                <span>📅</span>
                <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{humanDate}</span>
              </span>
              <span className="hidden sm:inline-block text-white/40">•</span>
              <span className="px-4 py-2 rounded-xl bg-black/80 border border-purple-400/50 text-purple-200 shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center gap-2">
                <span>📍</span>
                <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{venueTitle}</span>
              </span>
            </>
          ) : (
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/85 border border-cyan-400/60 shadow-[0_4px_30px_rgba(0,0,0,0.95),0_0_15px_rgba(0,242,254,0.25)] backdrop-blur-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f2fe]" />
              <span className="text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                Official Date &amp; Venue Revealing Soon
              </span>
            </div>
          )}
        </div>

        {/* =========================================================================
            5. THE CELESTIAL ENTER OPTION (CENTERPIECE INTERACTIVE CTA)
            Strictly requires user click/enter to open homepage; stays on loading screen until clicked.
           ========================================================================= */}
        <div
          className={`mt-5 sm:mt-7 flex flex-col items-center justify-center w-full max-w-md mx-auto transition-all duration-700 transform ${
            phase >= 1 ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          {/* Celestial Gateway Calibration Status Line with Mini Progress Track */}
          <div className="flex flex-col items-center gap-1.5 mb-3.5 w-full max-w-xs">
            <div className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.22em] flex items-center justify-center gap-2 select-none">
              <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#00f2fe] ${progress >= 100 ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'}`} />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]">
                {progress >= 100 ? '✦ STARGATE READY // 100% · CLICK ENTER ✦' : `CALIBRATING STARGATE // ${progress}%`}
              </span>
            </div>

            {/* Glowing Celestial Mini Progress Track */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden border border-cyan-400/20 backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 rounded-full shadow-[0_0_8px_#00f2fe] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* THE ENTER HOME PAGE BUTTON - STAYS STUCK ON LOADING PAGE UNTIL USER CLICKS */}
          <button
            id="homescreen-enter-button"
            onClick={() => handleEnterHomepage(false)}
            className="group relative inline-flex items-center justify-center gap-3.5 px-9 py-4 sm:px-12 sm:py-4.5 rounded-full transition-all duration-500 ease-out hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_45px_rgba(217,70,239,0.55),0_0_30px_rgba(0,242,254,0.4)]"
            title="Click to enter ELIXORA 2.0 Home Page"
          >
            {/* Outer Cosmic Multi-Tone Aura Bloom */}
            <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 opacity-75 blur-md group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 ${progress >= 100 ? 'animate-pulse' : ''}`} />

            {/* Orbiting Satellite Particle around the Enter Button */}
            <div className="absolute -inset-2.5 rounded-full border border-cyan-400/30 border-dotted animate-[spin_12s_linear_infinite] pointer-events-none">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f2fe]" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_#e879f9]" />
            </div>

            {/* Vibrant Electric Cosmic Capsule Body with Glass Highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 border border-pink-300/60 group-hover:border-white/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(217,70,239,0.55),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 overflow-hidden">
              {/* Gloss overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/25 pointer-events-none" />
              {/* Top Glass Bevel Glint */}
              <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              {/* Shimmer Light Beam on Hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
            </div>

            {/* Button Content: Luminous Crisp Typography & Icon Capsule */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="font-outfit font-black text-sm sm:text-base tracking-[0.28em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] ml-1">
                ENTER HOME PAGE
              </span>

              {/* Glowing Arrow Capsule */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/60 group-hover:border-white group-hover:bg-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </button>

          {/* Interactive Keyboard Hotkey Prompt */}
          <p className="mt-2.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-300/80 select-none flex items-center gap-1.5">
            <span>[ CLICK BUTTON OR PRESS</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-cyan-400/40 text-cyan-200 font-bold">↵ ENTER</kbd>
            <span>TO ENTER HOME PAGE ]</span>
          </p>
        </div>
      </div>

      {/* =========================================================================
          6. BOTTOM CELESTIAL HARMONIC OSCILLOSCOPE WAVE
         ========================================================================= */}
      <div className="absolute bottom-0 inset-x-0 z-30 pb-2 sm:pb-3 pointer-events-none">
        <div className="relative w-full h-8 sm:h-10 overflow-hidden flex items-center">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 2400 40">
            <defs>
              <linearGradient id="celestialWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="70%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Dotted Baseline Axis */}
            <line x1="0" y1="20" x2="2400" y2="20" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Flowing Harmonic Sine Wave */}
            <path
              d="M 0 20 Q 30 8, 60 20 T 120 20 T 180 20 T 240 20 T 300 20 T 360 20 T 420 20 T 480 20 T 540 20 T 600 20 T 660 20 T 720 20 T 780 20 T 840 20 T 900 20 T 960 20 T 1020 20 T 1080 20 T 1140 20 T 1200 20 T 1260 20 T 1320 20 T 1380 20 T 1440 20 T 1500 20 T 1560 20 T 1620 20 T 1680 20 T 1740 20 T 1800 20 T 1860 20 T 1920 20 T 1980 20 T 2040 20 T 2100 20 T 2160 20 T 2220 20 T 2280 20 T 2340 20 T 2400 20"
              fill="none"
              stroke="url(#celestialWaveGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>

          {/* Full Screen Edge-to-Edge Progress Laser Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 rounded-full shadow-[0_0_10px_#00f2fe] transition-all duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Leading Edge Spark */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 ease-linear pointer-events-none z-10"
            style={{ left: `${progress}%` }}
          >
            <span className="absolute -inset-1.5 rounded-full bg-cyan-400/40 animate-ping" />
            <span className="relative block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_16px_#00f2fe,0_0_24px_#ec4899] -translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
