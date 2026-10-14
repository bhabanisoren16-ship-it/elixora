import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, Sparkles, Zap, Radio, Activity } from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { adminStore } from '../utils/adminStore';

/**
 * Next-Gen Futuristic Cyber Festival Loading Screen for ELIXORA 2.0
 * Features:
 * 1. Animated concert stage background with real-time 3D tilt parallax
 * 2. Cyberpunk HUD viewfinders with live pulsing equalizer bars
 * 3. Rotating 3D holographic cyber-mandala portal rings
 * 4. Liquid Chrome 3D typography with chromatic flare
 * 5. Dynamic 16-bar audio frequency visualizer wave
 * 6. High-contrast obsidian glass badges & status badges
 * 7. Real-time numerical progress HUD (0% -> 100%) with travelling spark head
 * 8. Quick skip anytime via ESC / Space / Skip button
 */
export default function CinematicIntro({ onComplete, onRegisterClick }) {
  const [phase, setPhase] = useState(0); // 0: Init, 1: Beam sweep, 2: Atmosphere, 3: 3D Portal, 4: Details, 5: Actions
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

  // Smooth numerical percentage counter (0% to 100% until actions ready)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 35);
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

  // Staged timeline sequence - STAYS ON LOADING SCREEN UNTIL USER CLICKS AN ACTION
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2400);
    const t4 = setTimeout(() => setPhase(4), 3800);
    const t5 = setTimeout(() => setPhase(5), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Atmospheric dust and spark particles in canvas with 3D depth
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

    const particleCount = width > 768 ? 55 : 28;
    const colors = ['#00e5ff', '#38bdf8', '#c084fc', '#e879f9', '#fbbf24', '#ffffff'];
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.9 + 0.3),
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.7 + 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      depth: Math.random() * 0.8 + 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const driftX = mousePosRef.current.x * p.depth * 0.6;
        p.x += p.vx + driftX;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
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

  // Handle immediate exit / skip
  const handleExit = (triggerRegister = false) => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
      if (triggerRegister) {
        onRegisterClick?.();
      }
    }, 600);
  };

  // Keyboard shortcut: Enter, Escape or Space to enter/skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.code === 'Space') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const letters = ['E', 'L', 'I', 'X', 'O', 'R', 'A'];

  const phaseNames = [
    'SYS // INITIATING STAGE 01',
    'LASER MATRIX // CALIBRATING',
    'ATMOSPHERE // SYNCHRONIZING',
    '3D PORTAL // RENDERING',
    'ELIXORA 2.0 // REVEALED',
    'CLICK ENTER TO BEGIN',
  ];
  const currentPhaseText = phaseNames[phase] || 'CLICK ENTER TO BEGIN';

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian-950 overflow-hidden select-none transition-all duration-700 font-outfit ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. 3D Cyber Gateway Tunnel Background with Spatial Tilt Parallax */}
      <div
        className="absolute inset-[-45px] pointer-events-none select-none overflow-hidden will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -7}deg) rotateY(${mousePos.x * 7}deg) translate3d(${mousePos.x * -18}px, ${mousePos.y * -14}px, 0px) scale(${phase >= 3 ? 1.05 : 1.01})`,
          transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        <img
          src="/elixora-3d-tunnel-bg.jpg"
          alt="ELIXORA 3D Cyber Gateway Tunnel"
          className="w-full h-full object-cover object-center filter brightness-[1.05] contrast-[1.10]"
        />

        {/* Ambient 3D Tunnel Depth Vignette for Text Readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(6, 8, 20, 0.22) 0%, rgba(6, 8, 20, 0.55) 55%, rgba(6, 8, 20, 0.90) 100%)',
          }}
        />

        {/* Ambient Top & Bottom Depth Gradients */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-obsidian-950/85 via-obsidian-950/45 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/55 to-transparent pointer-events-none" />

        {/* Dynamic Center Tunnel Energy Pulse in Phase >= 1 */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[110px] pointer-events-none transition-all duration-1000 ${
            phase >= 1
              ? 'opacity-45 bg-gradient-to-tr from-cyan-500/35 via-purple-600/30 to-sky-400/25 scale-105'
              : 'opacity-0 scale-75'
          }`}
        />
      </div>

      {/* 2. Floating Sparkles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* 3. Cyberpunk HUD Corner Brackets & Telemetry */}
      {/* Top-Left Telemetry & Audio Matrix Equalizer */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 flex items-center gap-3 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-cyan-300">
              ELX-NEXUS // ONLINE
            </span>
          </div>
          {/* Animated Audio Equalizer Bars */}
          <div className="flex items-end gap-1 h-3 mt-0.5">
            {[40, 75, 55, 95, 60, 85, 45, 90].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-400 to-sky-200 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top-Right Controls: Skip Intro & ESC Pill Badge */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 flex items-center gap-2.5">
        <button
          onClick={() => handleExit(false)}
          className="group px-4 py-2 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 hover:border-cyan-400/60 text-slate-200 hover:text-white text-xs font-bold tracking-wider transition-all backdrop-blur-xl flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
          title="Skip intro animation (Esc or Space)"
        >
          <span className="tracking-widest">SKIP INTRO</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-cyan-300 border border-white/10 group-hover:bg-cyan-500/20">
            ESC
          </span>
          <X className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* 4. Stage 1: Neon Laser Sweep Beam */}
      <div
        className={`absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none transition-all duration-1000 ${
          phase >= 1
            ? 'top-1/2 -translate-y-1/2 opacity-95 scale-x-100 shadow-[0_0_25px_4px_#00e5ff]'
            : 'top-1/2 -translate-y-1/2 opacity-0 scale-x-0'
        }`}
      />
      <div
        className={`absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent pointer-events-none transition-all duration-1000 delay-150 ${
          phase >= 1
            ? 'top-[52%] opacity-80 scale-x-100 shadow-[0_0_20px_3px_#c084fc]'
            : 'top-[52%] opacity-0 scale-x-0'
        }`}
      />

      {/* 5. Central 3D Holographic Cyber-Portal & Rotating Mandala Rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] pointer-events-none transition-all duration-1000 will-change-transform"
        style={{
          transform: `translate(-50%, -50%) perspective(1000px) rotateX(${mousePos.y * 6}deg) rotateY(${mousePos.x * -6}deg) scale(${phase >= 3 ? 1.0 : 0.7})`,
          opacity: phase >= 2 ? 0.75 : 0,
        }}
      >
        {/* Outer Rotating Dotted Cyan Ring */}
        <div
          className="absolute inset-0 rounded-full border border-cyan-400/30 border-dashed animate-[spin_40s_linear_infinite]"
          style={{
            boxShadow: '0 0 35px rgba(0, 229, 255, 0.15), inset 0 0 35px rgba(0, 229, 255, 0.10)',
          }}
        />

        {/* Middle Counter-Rotating Ultraviolet Ring with Satellite Orbit Nodes */}
        <div className="absolute inset-8 rounded-full border border-purple-500/35 border-dotted animate-[spin_25s_linear_infinite_reverse]">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
          <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
          <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_6px_#38bdf8]" />
        </div>

        {/* Inner Precision Compass Crosshairs */}
        <div className="absolute inset-16 rounded-full border border-cyan-400/20">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
        </div>
      </div>

      {/* 6. Central Cinematic Typography & Experience Reveal */}
      <div
        className="relative z-10 max-w-4xl px-4 text-center flex flex-col items-center will-change-transform"
        style={{
          transform: `perspective(800px) rotateX(${mousePos.y * 4}deg) rotateY(${mousePos.x * -4}deg) translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 20px)`,
          transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        {/* Dark Contrast Shield behind Central Content for 100% Text Legibility */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[380px] sm:h-[460px] bg-obsidian-950/80 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Gala Badge: THE BIOTECHNOLOGY ANNUAL GALA '26 */}
        <div
          className={`mb-3 sm:mb-4 transition-all duration-700 transform ${
            phase >= 2
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-cyan-400/40 text-cyan-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs font-black tracking-[0.22em] uppercase">
              BIOTECHNOLOGY FRESHERS GALA '26
            </span>
          </div>
        </div>

        {/* 3D Chrome Title: ELIXORA 2.0 */}
        <div
          className={`relative select-none transition-all duration-1000 transform ${
            phase >= 3
              ? 'opacity-100 scale-100 filter-none translate-y-0'
              : 'opacity-0 scale-90 filter blur-md translate-y-8'
          }`}
        >
          {/* Chromatic Backing Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 blur-2xl opacity-40 animate-pulse pointer-events-none" />

          {/* Letter Stagger Container */}
          <h1 className="relative font-outfit font-black tracking-tight text-6xl xs:text-7xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 flex items-center justify-center drop-shadow-[0_12px_40px_rgba(0,0,0,1)]">
            {letters.map((char, idx) => (
              <span
                key={idx}
                className="inline-block transition-all duration-700 transform will-change-transform hover:scale-110 hover:text-cyan-200"
                style={{
                  transitionDelay: `${idx * 75}ms`,
                  textShadow: '0 0 25px rgba(0, 229, 255, 0.6), 0 4px 20px rgba(0,0,0,1)',
                }}
              >
                {char}
              </span>
            ))}
            <span className="text-2xl sm:text-4xl text-cyan-400 ml-1.5 sm:ml-2 font-black align-top self-start mt-2 sm:mt-4 text-glow-cyan drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
              2.0
            </span>
          </h1>

          {/* Liquid Chrome Glint Reflection Line */}
          <div className="h-[2px] w-48 sm:w-80 mx-auto mt-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 shadow-[0_0_12px_#ffffff]" />
        </div>

        {/* Tagline: A Night to Remember */}
        <div
          className={`mt-4 sm:mt-5 transition-all duration-700 transform ${
            phase >= 4
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-6 filter blur-sm'
          }`}
        >
          <p className="font-outfit text-sm sm:text-lg md:text-xl text-white font-black tracking-[0.35em] uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,1)] text-glow-cyan">
            A Night to Remember
          </p>
        </div>

        {/* Event Date & Location: Revealed only if officially announced from Admin Portal */}
        <div
          className={`mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-outfit font-extrabold transition-all duration-700 delay-100 transform ${
            phase >= 4
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {isDateVenueAnnounced ? (
            <>
              <span className="px-4 py-2 rounded-xl bg-obsidian-900/90 border border-cyan-400/50 text-cyan-200 shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center gap-2">
                <span>📅</span>
                <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{humanDate}</span>
              </span>
              <span className="hidden sm:inline-block text-white/40">•</span>
              <span className="px-4 py-2 rounded-xl bg-obsidian-900/90 border border-purple-400/50 text-purple-200 shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center gap-2">
                <span>📍</span>
                <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{venueTitle}</span>
              </span>
            </>
          ) : (
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-obsidian-900/90 border border-cyan-400/60 shadow-[0_4px_30px_rgba(0,0,0,0.9),0_0_15px_rgba(0,229,255,0.25)] backdrop-blur-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00e5ff]" />
              <span className="text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                Official Date &amp; Venue Revealing Soon
              </span>
            </div>
          )}
        </div>

        {/* Stage 5: Ultra-Aesthetic Cyber ENTER Action CTA */}
        <div
          className={`mt-6 sm:mt-8 flex items-center justify-center w-full max-w-xs mx-auto transition-all duration-700 transform ${
            phase >= 5
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <button
            onClick={() => handleExit(false)}
            className="group relative inline-flex items-center gap-3.5 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full transition-all duration-500 ease-out hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* 1. Outer Multi-Tone Neon Purple & Magenta EDM Aura Bloom */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 opacity-70 blur-md group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse" />

            {/* 2. Vibrant Electric Purple-Pink Capsule Body with Gloss Highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 border border-pink-300/50 group-hover:border-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(217,70,239,0.55),0_0_25px_rgba(168,85,247,0.45),inset_0_1px_2px_rgba(255,255,255,0.45)] transition-all duration-300 overflow-hidden">
              {/* Gloss overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
              {/* Top Glass Bevel Glint */}
              <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              {/* Shimmer Light Beam on Hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
            </div>

            {/* 3. Button Content: Luminous Crisp White Typography & Icon Capsule */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="font-outfit font-black text-sm sm:text-base tracking-[0.32em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] ml-1">
                ENTER
              </span>
              
              {/* Glowing Icon Capsule */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/60 group-hover:border-white group-hover:bg-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 7. Bottom Fluid Oscilloscope Sine Wave Loading Display */}
      <div className="absolute bottom-0 inset-x-0 z-30 pb-3 sm:pb-4 px-4 sm:px-8 bg-gradient-to-t from-obsidian-950 via-obsidian-950/85 to-transparent">
        <div className="max-w-2xl mx-auto">
          {/* Telemetry Row */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-400 mb-1.5">
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-ping" />
              <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{currentPhaseText}</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono tracking-widest bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                LIVE OSCILLOSCOPE // 48 kHz
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-cyan-300 font-black">{String(progress).padStart(2, '0')}%</span>
              <span className={progress >= 100 ? 'text-pink-400 font-extrabold tracking-widest animate-pulse drop-shadow-[0_0_6px_#ec4899]' : 'text-slate-500'}>
                {progress >= 100 ? 'ONLINE' : 'STREAMING'}
              </span>
            </div>
          </div>

          {/* Fluid Oscilloscope Neon Sine Wave Arena */}
          <div className="relative h-10 sm:h-12 w-full overflow-hidden flex items-center">
            {/* Ambient Background Wave Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl pointer-events-none" />

            {/* Seamless Flowing Harmonic Sine Waves (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 40"
            >
              <defs>
                <linearGradient id="oscCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="oscPinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Baseline Center Dotted Axis */}
              <line
                x1="0"
                y1="20"
                x2="1000"
                y2="20"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Primary Cyan Sine Wave (Wavelength 120, Amplitude 12) */}
              <g className="animate-osc-1">
                <path
                  d="M 0 20 Q 30 8, 60 20 T 120 20 T 180 20 T 240 20 T 300 20 T 360 20 T 420 20 T 480 20 T 540 20 T 600 20 T 660 20 T 720 20 T 780 20 T 840 20 T 900 20 T 960 20 T 1020 20 T 1080 20 T 1140 20 T 1200 20 T 1260 20 T 1320 20 T 1380 20 T 1440 20"
                  fill="none"
                  stroke="url(#oscCyanGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-osc-pulse"
                />
              </g>

              {/* Harmonic Pink / Fuchsia Sine Wave (Wavelength 160, Amplitude 8) */}
              <g className="animate-osc-2">
                <path
                  d="M 0 20 Q 40 12, 80 20 T 160 20 T 240 20 T 320 20 T 400 20 T 480 20 T 560 20 T 640 20 T 720 20 T 800 20 T 880 20 T 960 20 T 1040 20 T 1120 20 T 1200 20 T 1280 20 T 1360 20 T 1440 20"
                  fill="none"
                  stroke="url(#oscPinkGrad)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>
            </svg>

            {/* Precision Laser Horizon Track with Travelling Photon Glint */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] pointer-events-none">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 rounded-full shadow-[0_0_10px_#00e5ff] transition-all duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Leading Edge Electric Travelling Spark */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 ease-linear pointer-events-none z-10"
              style={{ left: `${progress}%` }}
            >
              <span className="absolute -inset-1.5 rounded-full bg-cyan-400/40 animate-ping" />
              <span className="relative block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_16px_#00e5ff,0_0_24px_#ec4899] -translate-x-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
