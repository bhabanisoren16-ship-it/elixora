import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, X, Volume2, Play } from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { adminStore } from '../utils/adminStore';

/**
 * 3–5 Second Cinematic Opening Sequence for ELIXORA
 * Features:
 * 1. Dark obsidian opening
 * 2. Sweeping neon laser beam with prismatic lens flare
 * 3. Atmospheric floating smoke & dust motes
 * 4. 3D Chrome "ELIXORA" text emergence with metallic reflections & push-in
 * 5. Chromatic aberration & letter-by-letter stagger
 * 6. "A Night to Remember" luxury reveal
 * 7. Verified date & venue presentation
 * 8. "Register Now" / "Explore the Night" action buttons
 * 9. Seamless exit fade into the live site
 * 10. Instant "Skip Intro" option anytime
 */
export default function CinematicIntro({ onComplete, onRegisterClick }) {
  const [phase, setPhase] = useState(0); // 0: Init, 1: Beam sweep, 2: Particles, 3: 3D Title emerge, 4: Tagline & Details, 5: Ready/Action
  const [isExiting, setIsExiting] = useState(false);
  const [settings, setSettings] = useState(() => adminStore.getSettings());
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const humanDate = settings.eventHumanDate || EVENT_DETAILS.humanDate;
  const venueTitle = settings.venueTitle || EVENT_DETAILS.location;

  // Staged timeline sequence
  useEffect(() => {
    // Stage 1: Neon beam sweep (at 250ms)
    const t1 = setTimeout(() => setPhase(1), 250);
    // Stage 2: Atmospheric dust & haze (at 900ms)
    const t2 = setTimeout(() => setPhase(2), 900);
    // Stage 3: 3D ELIXORA title emerges with chrome reflection (at 1700ms)
    const t3 = setTimeout(() => setPhase(3), 1700);
    // Stage 4: Tagline, Date & Venue reveal (at 2800ms)
    const t4 = setTimeout(() => setPhase(4), 2800);
    // Stage 5: Primary CTAs & Enter site buttons (at 3700ms)
    const t5 = setTimeout(() => setPhase(5), 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Atmospheric dust and spark particles in canvas
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

    const particleCount = width > 768 ? 45 : 22;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.8 + 0.3),
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.5 ? '#00e5ff' : '#c084fc',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
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
        ctx.shadowBlur = 10;
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
      {/* Background Volumetric Gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-900/20 via-obsidian-950/90 to-obsidian-950 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating Sparkles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Top Controls: Skip Intro & Keyboard Shortcut Hint */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 flex items-center gap-3">
        <button
          onClick={() => handleExit(false)}
          className="group px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 hover:border-cyan-400/50 text-slate-300 hover:text-white text-xs font-outfit font-semibold tracking-wider transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg"
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
            ? 'top-1/2 -translate-y-1/2 opacity-90 scale-x-100 shadow-[0_0_25px_4px_#00e5ff]'
            : 'top-1/2 -translate-y-1/2 opacity-0 scale-x-0'
        }`}
      />
      <div
        className={`absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent pointer-events-none transition-all duration-1000 delay-150 ${
          phase >= 1
            ? 'top-[52%] opacity-75 scale-x-100 shadow-[0_0_20px_3px_#c084fc]'
            : 'top-[52%] opacity-0 scale-x-0'
        }`}
      />

      {/* Central Cinematic Typography & Experience Reveal */}
      <div className="relative z-10 max-w-4xl px-4 text-center flex flex-col items-center">
        
        {/* Subtitle Badge: Biotechnology Freshers '26 */}
        <div
          className={`transition-all duration-700 transform mb-3 sm:mb-4 ${
            phase >= 2
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-4 filter blur-sm'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] sm:text-xs font-outfit font-bold tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>BIOTECHNOLOGY FRESHERS '26</span>
          </div>
        </div>

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
          <h1 className="relative font-outfit font-black tracking-tight text-6xl xs:text-7xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 flex items-center justify-center drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            {letters.map((char, idx) => (
              <span
                key={idx}
                className="inline-block transition-all duration-700 transform will-change-transform hover:scale-110 hover:text-cyan-200"
                style={{
                  transitionDelay: `${idx * 75}ms`,
                  textShadow: '0 0 20px rgba(0, 229, 255, 0.45), 0 0 50px rgba(168, 85, 247, 0.35)',
                }}
              >
                {char}
              </span>
            ))}
            <span className="text-2xl sm:text-4xl text-cyan-400 ml-1.5 sm:ml-2 font-black align-top self-start mt-2 sm:mt-4 text-glow-cyan">
              2.0
            </span>
          </h1>

          {/* Liquid Chrome Glint Reflection Line */}
          <div className="h-[2px] w-48 sm:w-80 mx-auto mt-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 shadow-[0_0_12px_#ffffff]" />
        </div>

        {/* Tagline: A Night to Remember */}
        <div
          className={`mt-3 sm:mt-5 transition-all duration-700 transform ${
            phase >= 4
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-6 filter blur-sm'
          }`}
        >
          <p className="font-outfit text-sm sm:text-lg md:text-xl text-slate-200 font-extrabold tracking-[0.3em] uppercase drop-shadow-md text-glow-violet">
            A Night to Remember
          </p>
        </div>

        {/* Event Date & Location Pill */}
        <div
          className={`mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-outfit font-bold text-slate-300 transition-all duration-700 delay-100 transform ${
            phase >= 4
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="px-3 py-1 rounded-lg bg-black/50 border border-white/10 text-cyan-300 shadow-sm">
            📅 {humanDate}
          </span>
          <span className="hidden sm:inline-block text-white/30">•</span>
          <span className="px-3 py-1 rounded-lg bg-black/50 border border-white/10 text-purple-300 shadow-sm">
            📍 {venueTitle}
          </span>
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

      {/* Bottom Progress Bar: 4-second auto completion */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 transition-all duration-[4200ms] ease-linear"
          style={{ width: phase >= 1 ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}
