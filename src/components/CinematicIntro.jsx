import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { adminStore } from '../utils/adminStore';

/**
 * 3–5 Second Cinematic Loading Screen for ELIXORA
 * Features:
 * 1. Simple atmospheric concert background image with soft vignette
 * 2. Sweeping neon laser beam with prismatic lens flare
 * 3. Atmospheric floating smoke & dust motes
 * 4. 3D Chrome "ELIXORA" text emergence with metallic reflections & push-in
 * 5. Chromatic aberration & letter-by-letter stagger
 * 6. "A Night to Remember" luxury reveal
 * 7. Gated schedule & venue (only reveals if announced by Admin Portal)
 * 8. "Register Now" / "Explore the Night" action buttons
 * 9. Seamless exit fade into the live site
 * 10. Instant "Skip Intro" option anytime
 */
export default function CinematicIntro({ onComplete, onRegisterClick }) {
  const [phase, setPhase] = useState(0); // 0: Init, 1: Beam sweep, 2: Particles, 3: 3D Title emerge, 4: Tagline & Details, 5: Ready/Action
  const [isExiting, setIsExiting] = useState(false);
  const [settings, setSettings] = useState(() => adminStore.getSettings());
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

  // Smooth 3D tilt parallax tracking (cursor on desktop, tilt on mobile)
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

  // Staged timeline sequence (Extended to 8.5s for immersive 3D viewing)
  useEffect(() => {
    // Stage 1: Neon beam sweep & 3D stage lighting (at 400ms)
    const t1 = setTimeout(() => setPhase(1), 400);
    // Stage 2: Atmospheric dust & rising pyro sparks (at 1400ms)
    const t2 = setTimeout(() => setPhase(2), 1400);
    // Stage 3: 3D ELIXORA title emerges with chrome reflection (at 2400ms)
    const t3 = setTimeout(() => setPhase(3), 2400);
    // Stage 4: Tagline, Date & Venue reveal (at 4000ms)
    const t4 = setTimeout(() => setPhase(4), 4000);
    // Stage 5: Primary CTAs & Enter site buttons (at 5200ms)
    const t5 = setTimeout(() => setPhase(5), 5200);
    // Stage 6: Seamless auto-transition to website (at 8500ms)
    const tAuto = setTimeout(() => handleExit(false), 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tAuto);
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

  // Keyboard shortcut: Escape or Space to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const letters = ['E', 'L', 'I', 'X', 'O', 'R', 'A'];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian-950 overflow-hidden select-none transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Animated Concert Stage Background Image matching Main Page Theme with 3D Tilt Parallax */}
      <div
        className="absolute inset-[-45px] pointer-events-none select-none overflow-hidden will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * -7}deg) rotateY(${mousePos.x * 7}deg) translate3d(${mousePos.x * -18}px, ${mousePos.y * -14}px, 0px) scale(${phase >= 3 ? 1.05 : 1.01})`,
          transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        <picture>
          <source type="image/webp" srcSet="/elixora-animated-stage.webp" />
          <img
            src="/elixora-animated-stage.gif"
            alt="ELIXORA Animated Concert Stage"
            className="w-full h-full object-cover object-center filter brightness-[1.04] contrast-[1.08]"
          />
        </picture>

        {/* Ambient Concert Stage Lighting Vignette matching Main Page Theme */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 65% at 50% 48%, rgba(6, 8, 20, 0.40) 0%, rgba(6, 8, 20, 0.70) 58%, rgba(6, 8, 20, 0.95) 100%)',
          }}
        />

        {/* Ambient Top & Bottom Gradients for Letterbox & Readability */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-obsidian-950/90 via-obsidian-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-obsidian-950/95 via-obsidian-950/65 to-transparent pointer-events-none" />

        {/* Dynamic Stage Lighting Pulse Glow matching Main Page Theme in Phase >= 1 */}
        <div
          className={`absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] rounded-full blur-[110px] pointer-events-none transition-all duration-1000 ${
            phase >= 1
              ? 'opacity-40 bg-gradient-to-tr from-cyan-500/30 via-purple-600/25 to-amber-500/20 scale-105'
              : 'opacity-0 scale-75'
          }`}
        />
      </div>

      {/* Floating Sparkles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Top Controls: Skip Intro & Keyboard Shortcut Hint */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 flex items-center gap-3">
        <button
          onClick={() => handleExit(false)}
          className="group px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/70 hover:bg-black/90 border border-white/25 hover:border-cyan-400/60 text-slate-100 hover:text-white text-xs font-outfit font-bold tracking-wider transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg"
          title="Skip intro animation (Esc)"
        >
          <span>SKIP INTRO</span>
          <X className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Stage 1: Neon Laser Sweep Beam */}
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

      {/* Central Cinematic Typography & Experience Reveal */}
      <div
        className="relative z-10 max-w-4xl px-4 text-center flex flex-col items-center will-change-transform"
        style={{
          transform: `perspective(800px) rotateX(${mousePos.y * 4}deg) rotateY(${mousePos.x * -4}deg) translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 20px)`,
          transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        {/* Dark Contrast Shield behind Central Content for 100% Text Legibility */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[380px] sm:h-[460px] bg-obsidian-950/80 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 3D Chrome Title: ELIXORA */}
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

        {/* Stage 5: Primary Action CTAs */}
        <div
          className={`mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto transition-all duration-700 transform ${
            phase >= 5
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          {/* Register Now Button */}
          <button
            onClick={() => handleExit(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white font-outfit font-extrabold text-sm tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/25 cursor-pointer group"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Explore the Night Button */}
          <button
            onClick={() => handleExit(false)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-obsidian-900/90 hover:bg-white/10 border border-white/20 text-slate-200 hover:text-white font-outfit font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
          >
            <span>Explore The Night</span>
          </button>
        </div>
      </div>

      {/* Bottom Progress Bar: 8.5-second extended auto completion */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 ease-linear"
          style={{
            width: phase >= 1 ? '100%' : '0%',
            transition: 'width 8100ms linear',
          }}
        />
      </div>
    </div>
  );
}
