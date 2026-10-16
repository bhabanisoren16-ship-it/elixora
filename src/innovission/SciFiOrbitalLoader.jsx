import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { scrambleText } from './scrambleText';

const ORBS = [
  { 
    inset: '0%', 
    border: '1px dotted rgba(0, 242, 254, 0.55)', 
    lockBorder: 'border-cyan-400 shadow-[0_0_16px_#00f2fe]', 
    i: 2, 
    a0: 236, 
    size: 12, 
    img: 'planet-tide.webp', 
    radius: 50 
  },
  { 
    inset: '14%', 
    border: '1px dashed rgba(168, 85, 247, 0.55)', 
    lockBorder: 'border-purple-400 shadow-[0_0_16px_#a855f7]', 
    i: 1, 
    a0: -148, 
    size: 13, 
    img: 'planet-earth.webp', 
    radius: 36 
  },
  { 
    inset: '26%', 
    border: '1px solid rgba(236, 72, 153, 0.55)', 
    lockBorder: 'border-pink-400 shadow-[0_0_16px_#ec4899]', 
    i: 0, 
    a0: 128, 
    size: 16, 
    img: 'planet-mars.webp', 
    radius: 24 
  },
];

const STATUSES = [
  'CALIBRATING ORBITAL TELEMETRY',
  'ALIGNING PLANETARY VECTORS',
  'SYNCHRONIZING CELESTIAL FREQUENCIES',
  'CELESTIAL GATEWAY ALIGNED · READY TO ENTER',
];

export default function SciFiOrbitalLoader({ onComplete, duration = 1.2 }) {
  const containerRef = useRef(null);
  const statusRef = useRef(null);
  const countRef = useRef(null);
  const progressCircleRef = useRef(null);
  const flareRef = useRef(null);
  const polylineRef = useRef(null);
  const orbRefs = useRef([]);
  const lockRefs = useRef([]);
  const [percent, setPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    let currentPercent = 0;
    const startTime = performance.now();
    const totalMs = duration * 1000;
    let animId;
    let lastStatusIdx = 0;
    const doneLocks = [false, false, false];

    const entranceDuration = Math.max(0.22, Math.min(0.32, duration * 0.25));
    const entranceStagger = Math.max(0.015, Math.min(0.03, duration * 0.025));

    // GSAP Entrance
    const ctx = gsap.context(() => {
      gsap.from('.loader-ring', {
        scale: 0.35,
        opacity: 0,
        duration: entranceDuration,
        ease: 'expo.out',
        stagger: entranceStagger,
      });

      gsap.from('.loader-disc', {
        scale: 0,
        duration: entranceDuration,
        ease: 'back.out(1.6)',
      });

      gsap.from('.loader-header', {
        y: -20,
        opacity: 0,
        duration: entranceDuration * 0.8,
        ease: 'power3.out',
      });

      gsap.from('.loader-footer', {
        y: 20,
        opacity: 0,
        duration: entranceDuration * 0.8,
        ease: 'power3.out',
      });
    }, containerRef);

    const updateLoader = (now) => {
      const elapsed = now - startTime;
      currentPercent = Math.min(100, (elapsed / totalMs) * 100);
      setPercent(Math.floor(currentPercent));

      // Circular gauge update
      if (progressCircleRef.current) {
        const offset = 307.9 * (1 - currentPercent / 100);
        progressCircleRef.current.style.strokeDashoffset = String(offset);
      }

      // Format tabular count (000 - 100)
      if (countRef.current) {
        countRef.current.textContent = String(Math.floor(currentPercent)).padStart(3, '0');
      }

      // Update planetary alignment rotation & laser alignment trajectory
      const normProgress = currentPercent / 100;
      const pts = ['50,50'];
      const thresholds = [0.34, 0.67, 1.0];

      ORBS.forEach((orb, idx) => {
        const q = Math.min(1, normProgress / thresholds[orb.i]);
        const angle = orb.a0 * Math.pow(1 - q, 3);
        const rad = (angle * Math.PI) / 180;

        const orbEl = orbRefs.current[idx];
        if (orbEl) {
          orbEl.style.transform = `rotate(${angle}deg)`;
        }

        const px = (50 + orb.radius * Math.sin(rad)).toFixed(2);
        const py = (50 - orb.radius * Math.cos(rad)).toFixed(2);
        pts.push(`${px},${py}`);

        // Shockwave lock animation when planet aligns at top
        if (q >= 1 && !doneLocks[orb.i]) {
          doneLocks[orb.i] = true;
          const lockEl = lockRefs.current[idx];
          if (lockEl) {
            gsap.fromTo(
              lockEl,
              { scale: 0.6, opacity: 1 },
              { scale: 2.8, opacity: 0, duration: Math.max(0.4, Math.min(0.7, duration * 0.45)), ease: 'expo.out' }
            );
          }
        }
      });

      if (polylineRef.current) {
        polylineRef.current.setAttribute('points', pts.join(' '));
      }

      // Status text updates with ScrambleText (scaled dynamically to duration)
      const statusIdx = Math.min(3, Math.floor(currentPercent / 25));
      if (statusIdx !== lastStatusIdx) {
        lastStatusIdx = statusIdx;
        if (statusRef.current) {
          scrambleText(statusRef.current, STATUSES[statusIdx], { duration: Math.min(0.24, duration * 0.18) });
        }
      }

      if (currentPercent < 100) {
        animId = requestAnimationFrame(updateLoader);
      } else {
        // Alignment complete! Halt auto-exit; wait for user to click ENTER
        setIsReady(true);
        if (statusRef.current) {
          scrambleText(statusRef.current, STATUSES[3], { duration: 0.35 });
        }
        if (flareRef.current) {
          gsap.fromTo(
            flareRef.current,
            { scale: 0.8, opacity: 1 },
            { scale: 2.6, opacity: 0, duration: 0.8, ease: 'expo.out' }
          );
        }
      }
    };

    animId = requestAnimationFrame(updateLoader);

    return () => {
      cancelAnimationFrame(animId);
      ctx.revert();
    };
  }, [duration]);

  const triggerExit = () => {
    if (isExiting) return;
    setIsExiting(true);

    const exitDuration = Math.max(0.3, Math.min(0.45, duration * 0.3));
    if (flareRef.current) {
      gsap.fromTo(
        flareRef.current,
        { scale: 0.9, opacity: 1 },
        { scale: 2.6, opacity: 0, duration: exitDuration * 1.5, ease: 'expo.out' }
      );
    }

    gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    })
      .to('.loader-ring', { scale: 1.8, opacity: 0, duration: exitDuration, ease: 'power2.in' }, 0)
      .to('.loader-disc', { scale: 0.6, opacity: 0, duration: exitDuration, ease: 'power2.in' }, 0)
      .to('.loader-fade', { opacity: 0, duration: exitDuration * 0.8 }, 0)
      .to(containerRef.current, { opacity: 0, duration: exitDuration }, exitDuration * 0.2);
  };

  const handleEnter = () => {
    triggerExit();
  };

  const handleSkip = () => {
    if (isSkipped || isExiting) return;
    setIsSkipped(true);
    triggerExit();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        if (isReady) {
          handleEnter();
        } else {
          handleSkip();
        }
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, isSkipped, isExiting]);

  const DISC_SIZE = 'min(56vmin, 480px)';

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[120] bg-[#0c0922] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Radial Cybernetic Starlight & Homepage EDM Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Homepage Ambient Spotlights (Cyber Cyan, Neon Purple, Hot Magenta) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-fuchsia-600/10 blur-[130px]" />

        {/* Rotating Starlight Conic Array */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vmax] h-[160vmax] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(0,242,254,0.03)_0deg_0.5deg,transparent_0.5deg_6deg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1.5px)] bg-[size:28px_28px] opacity-40" />
      </div>

      {/* Top Header Information Bar with Homepage Branding */}
      <header className="loader-fade loader-header w-full max-w-6xl flex items-center justify-between relative z-10 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f2fe]" />
          <span className="font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-400 tracking-[0.25em]" data-scr>
            ELIXORA MMXXVI
          </span>
        </div>
        <div className="font-outfit font-bold tracking-[0.20em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-300 to-cyan-300">
          <span data-scr>CELESTIAL ODYSSEY · BIOTECH '26</span>
        </div>
      </header>

      {/* Central 3-Orbital Planetary Alignment Stage */}
      <div
        className="relative my-auto flex items-center justify-center"
        style={{ width: DISC_SIZE, height: DISC_SIZE }}
      >
        {/* Outer Circular Radial Calibration Ticks with Cyan-Purple Aura */}
        <div className="loader-ring absolute inset-[-6%] rounded-full bg-[repeating-conic-gradient(from_-0.25deg,rgba(0,242,254,0.35)_0deg_0.5deg,transparent_0.5deg_3.6deg)] [mask-image:radial-gradient(circle_closest-side,transparent_93%,#000_94%,#000_98%,transparent_99%)] pointer-events-none drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]" />
        <div className="loader-ring absolute inset-[-3%] rounded-full border border-purple-500/20 pointer-events-none" />

        {/* Dynamic Multi-Color Laser Alignment Trajectory (Cyan -> Fuchsia -> Purple) */}
        <svg
          viewBox="0 0 100 100"
          className="loader-fade absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10"
        >
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <polyline
            ref={polylineRef}
            points="50,50 50,26 50,14 50,0"
            fill="none"
            stroke="url(#laserGrad)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="1.2 1.8"
            className="drop-shadow-[0_0_10px_#00f2fe]"
          />
        </svg>

        {/* The 3 Concentric Planetary Alignment Rings (Outer Cyan, Middle Purple, Inner Pink) */}
        {ORBS.map((orb, idx) => (
          <div
            key={orb.i}
            className="loader-ring absolute rounded-full"
            style={{
              inset: orb.inset,
              border: orb.border,
            }}
          >
            {/* Orbiting Planet Container */}
            <div
              ref={(el) => (orbRefs.current[idx] = el)}
              className="absolute inset-0 pointer-events-none"
            >
              <div
                className="absolute left-1/2 top-0"
                style={{
                  width: `${orb.size}%`,
                  height: `${orb.size}%`,
                  margin: `-${orb.size / 2}% 0 0 -${orb.size / 2}%`,
                }}
              >
                {/* Lock Shockwave Ring */}
                <span
                  ref={(el) => (lockRefs.current[idx] = el)}
                  className={`absolute inset-[-40%] rounded-full border-2 ${orb.lockBorder} opacity-0 pointer-events-none`}
                />
                <img
                  src={`/assets/${orb.img}`}
                  alt=""
                  className="w-full h-full object-contain drop-shadow-[0_0_14px_rgba(168,85,247,0.7)]"
                />
              </div>
            </div>
          </div>
        ))}

        {/* SVG Circular Loading Progress Ring (Homepage Signature Gradient) */}
        <svg
          viewBox="0 0 100 100"
          className="loader-fade absolute inset-[30%] w-[40%] h-[40%] overflow-visible pointer-events-none z-20"
        >
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
          />
          <circle
            ref={progressCircleRef}
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="url(#progressGrad)"
            strokeWidth="2.4"
            strokeDasharray="307.9"
            strokeDashoffset="307.9"
            transform="rotate(-90 50 50)"
            className="drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]"
          />
        </svg>

        {/* Flare Shockwave on Alignment Completion */}
        <span
          ref={flareRef}
          className="absolute inset-[24%] rounded-full border-2 border-fuchsia-400 shadow-[0_0_30px_#d946ef] opacity-0 pointer-events-none z-30"
        />

        {/* Center Cosmic Starfield Disc with Live Numeric Counter */}
        <div
          className="loader-disc absolute inset-[33%] rounded-full bg-[#060810] border border-fuchsia-500/40 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.4),0_0_20px_rgba(0,242,254,0.3)] flex flex-col items-center justify-center z-10"
        >
          <img
            src="/assets/starfield.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
          />
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span
              ref={countRef}
              className="font-outfit font-black text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-purple-200 tabular-nums leading-none tracking-tight drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]"
            >
              000
            </span>
            <span className="mt-1 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-cyan-300/90 font-bold">
              PERCENT
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Status & Enter / Skip Action Control */}
      <footer className="loader-fade loader-footer w-full max-w-xl flex flex-col items-center gap-3.5 relative z-10 text-center">
        {/* Status Line with Pulsing Neon Dot */}
        <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.28em] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_#d946ef] animate-pulse" />
          <span
            ref={statusRef}
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]"
            data-scr
          >
            {STATUSES[0]}
          </span>
        </div>

        {/* Action Button: Prominent ENTER button when ready (required to enter homepage), or SKIP while loading */}
        {isReady ? (
          <button
            onClick={handleEnter}
            id="enter-elixora-button"
            className="group relative inline-flex items-center gap-3.5 px-9 py-3.5 sm:px-11 sm:py-4 rounded-full transition-all duration-500 ease-out hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_40px_rgba(217,70,239,0.55),0_0_25px_rgba(168,85,247,0.45)] animate-bounce-subtle"
          >
            {/* Outer Multi-Tone Neon Purple & Magenta EDM Aura Bloom */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 opacity-80 blur-md group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse" />

            {/* Vibrant Electric Purple-Pink-Cyan Body with Gloss Highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-cyan-600 border border-pink-300/60 group-hover:border-white/90 backdrop-blur-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.45)] transition-all duration-300 overflow-hidden">
              {/* Gloss overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
              {/* Top Glass Bevel Glint */}
              <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              {/* Shimmer Light Beam on Hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
            </div>

            {/* Content: Luminous Crisp Typography & Icon Capsule */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="font-outfit font-black text-sm sm:text-base tracking-[0.32em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ml-1">
                ENTER ELIXORA
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/60 group-hover:border-white group-hover:bg-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={handleSkip}
            className="mt-1 px-5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-white/60 hover:text-white font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer backdrop-blur-sm"
          >
            [ SKIP INTRO · ESC ]
          </button>
        )}
      </footer>
    </div>
  );
}

