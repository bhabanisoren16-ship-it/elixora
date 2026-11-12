import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { soundController } from '../utils/audio';
import { scrambleText } from '../innovission/scrambleText';

/**
 * Celestial Orbital Planetary Gateway - Home Screen Loading Page
 * Exact design from the Celestial Orbital Conjunction with the ENTER HOME PAGE option.
 * 
 * Performance Optimized:
 * 1. Zero React re-renders during 0-100% progress animation (pure direct DOM updates via refs).
 * 2. Hardware-accelerated GPU layer promotion (transform-gpu, translateZ(0), contain: paint layout).
 * 3. Prevents layout thrashing, backdrop-blur rasterization stalls, and sub-pixel repaint cycles.
 */

const CELESTIAL_ORBS = [
  { 
    inset: '0%', 
    border: '1px dotted rgba(0, 242, 254, 0.55)', 
    lockBorder: 'border-cyan-400 shadow-[0_0_18px_#00f2fe]', 
    i: 2, 
    a0: 236, 
    size: 12, 
    img: 'planet-tide.webp', 
    name: 'TIDAL WORLD',
    radius: 50 
  },
  { 
    inset: '14%', 
    border: '1px dashed rgba(168, 85, 247, 0.55)', 
    lockBorder: 'border-purple-400 shadow-[0_0_18px_#a855f7]', 
    i: 1, 
    a0: -148, 
    size: 13, 
    img: 'planet-earth.webp', 
    name: 'TERRA SPHERE',
    radius: 36 
  },
  { 
    inset: '26%', 
    border: '1px solid rgba(236, 72, 153, 0.55)', 
    lockBorder: 'border-pink-400 shadow-[0_0_18px_#ec4899]', 
    i: 0, 
    a0: 128, 
    size: 16, 
    img: 'planet-mars.webp', 
    name: 'ASTRAL MARS',
    radius: 24 
  },
];

export default function CinematicIntro({ onComplete, duration = 2.4 }) {
  const containerRef = useRef(null);
  const countRef = useRef(null);
  const progressCircleRef = useRef(null);
  const flareRef = useRef(null);
  const polylineRef = useRef(null);
  const orbRefs = useRef([]);
  const lockRefs = useRef([]);
  const gatewayTextRef = useRef(null);
  const enterBtnTextRef = useRef(null);
  const [isAligned, setIsAligned] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Helper to trigger cyber scramble text effect on the ENTER button
  const triggerEnterScramble = (dur = 0.45) => {
    if (enterBtnTextRef.current && !isExiting) {
      soundController.playHover?.();
      scrambleText(enterBtnTextRef.current, 'ENTER', { duration: dur });
    }
  };

  // Automatically trigger cybernetic scramble effect on ELIXORA GATEWAY when opening the site
  useEffect(() => {
    const scrambleTimer = setTimeout(() => {
      if (gatewayTextRef.current) {
        scrambleText(gatewayTextRef.current, 'ELIXORA GATEWAY', { duration: 2.2 });
      }
    }, 100);

    return () => {
      clearTimeout(scrambleTimer);
      if (gatewayTextRef.current?._scrambleRaf) {
        cancelAnimationFrame(gatewayTextRef.current._scrambleRaf);
      }
    };
  }, []);

  // Cybernetic Scramble Decode Effect on ENTER button when conjunction achieves 100%
  useEffect(() => {
    if (!isAligned) return;

    // Immediate decode on conjunction alignment entrance
    const entranceTimer = setTimeout(() => {
      if (enterBtnTextRef.current && !isExiting) {
        scrambleText(enterBtnTextRef.current, 'ENTER', { duration: 0.65 });
      }
    }, 120);

    // Periodic ambient scramble pulse while waiting for user to click
    const ambientInterval = setInterval(() => {
      if (enterBtnTextRef.current && !isExiting) {
        scrambleText(enterBtnTextRef.current, 'ENTER', { duration: 0.42 });
      }
    }, 4500);

    return () => {
      clearTimeout(entranceTimer);
      clearInterval(ambientInterval);
      if (enterBtnTextRef.current?._scrambleRaf) {
        cancelAnimationFrame(enterBtnTextRef.current._scrambleRaf);
      }
    };
  }, [isAligned, isExiting]);

  useEffect(() => {
    let currentPercent = 0;
    const startTime = performance.now();
    const totalMs = duration * 1000;
    let animId;
    const doneLocks = [false, false, false];

    const entranceDuration = Math.max(0.3, Math.min(0.5, duration * 0.2));
    const entranceStagger = 0.03;

    // GSAP Entrance with hardware acceleration
    const ctx = gsap.context(() => {
      gsap.from('.loader-ring', {
        scale: 0.35,
        opacity: 0,
        duration: entranceDuration,
        ease: 'expo.out',
        stagger: entranceStagger,
        force3D: true,
      });

      gsap.from('.loader-disc', {
        scale: 0,
        duration: entranceDuration,
        ease: 'back.out(1.6)',
        force3D: true,
      });

      gsap.from('.loader-header', {
        y: -20,
        opacity: 0,
        duration: entranceDuration * 0.8,
        ease: 'power3.out',
        force3D: true,
      });


    }, containerRef);

    // Direct high-performance DOM update loop without React re-renders
    const updateLoader = (now) => {
      const elapsed = now - startTime;
      currentPercent = Math.min(100, (elapsed / totalMs) * 100);

      // 1. Circular gauge update
      if (progressCircleRef.current) {
        const offset = 307.9 * (1 - currentPercent / 100);
        progressCircleRef.current.style.strokeDashoffset = String(offset);
      }

      // 2. Format tabular count (000 - 100) directly in DOM
      if (countRef.current) {
        countRef.current.textContent = String(Math.floor(currentPercent)).padStart(3, '0');
      }

      // 3. Update planetary alignment rotation & laser alignment trajectory
      const normProgress = currentPercent / 100;
      const pts = ['50,50'];
      const thresholds = [0.34, 0.67, 1.0];

      for (let idx = 0; idx < CELESTIAL_ORBS.length; idx++) {
        const orb = CELESTIAL_ORBS[idx];
        const q = Math.min(1, normProgress / thresholds[orb.i]);
        const angle = orb.a0 * Math.pow(1 - q, 3);
        const rad = (angle * Math.PI) / 180;

        const orbEl = orbRefs.current[idx];
        if (orbEl) {
          orbEl.style.transform = `rotate(${angle}deg) translateZ(0)`;
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
              { scale: 2.8, opacity: 0, duration: 0.6, ease: 'expo.out', force3D: true }
            );
          }
        }
      }

      if (polylineRef.current) {
        polylineRef.current.setAttribute('points', pts.join(' '));
      }

      if (currentPercent < 99.5) {
        animId = requestAnimationFrame(updateLoader);
      } else {
        // Conjunction achieved! Align planets at top and trigger Enter button
        currentPercent = 100;
        if (progressCircleRef.current) {
          progressCircleRef.current.style.strokeDashoffset = '0';
        }
        if (countRef.current) {
          countRef.current.textContent = '100';
        }
        CELESTIAL_ORBS.forEach((_, idx) => {
          const orbEl = orbRefs.current[idx];
          if (orbEl) orbEl.style.transform = 'rotate(0deg) translateZ(0)';
        });
        if (polylineRef.current) {
          polylineRef.current.setAttribute('points', '50,50 50,26 50,14 50,0');
        }

        setIsAligned(true);
        if (flareRef.current) {
          gsap.fromTo(
            flareRef.current,
            { scale: 0.8, opacity: 1 },
            { scale: 2.6, opacity: 0, duration: 0.8, ease: 'expo.out', force3D: true }
          );
        }
      }
    };

    animId = requestAnimationFrame(updateLoader);

    // Guaranteed safety fallback: activate Enter button after duration + buffer
    const safetyTimer = setTimeout(() => {
      setIsAligned((prev) => {
        if (!prev) {
          if (countRef.current) countRef.current.textContent = '100';
          if (progressCircleRef.current) progressCircleRef.current.style.strokeDashoffset = '0';
          CELESTIAL_ORBS.forEach((_, idx) => {
            const orbEl = orbRefs.current[idx];
            if (orbEl) orbEl.style.transform = 'rotate(0deg) translateZ(0)';
          });
          return true;
        }
        return prev;
      });
    }, (duration + 0.3) * 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, [duration]);

  // Handle User clicking ENTER HOME PAGE (or pressing Enter key)
  const handleEnterHomepage = () => {
    if (isExiting) return;
    soundController.playClick?.();
    setIsExiting(true);

    const exitDuration = 0.45;
    if (flareRef.current) {
      gsap.fromTo(
        flareRef.current,
        { scale: 0.9, opacity: 1 },
        { scale: 2.8, opacity: 0, duration: exitDuration * 1.5, ease: 'expo.out', force3D: true }
      );
    }

    gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    })
      .to('.loader-ring', { scale: 1.8, opacity: 0, duration: exitDuration, ease: 'power2.in', force3D: true }, 0)
      .to('.loader-disc', { scale: 0.6, opacity: 0, duration: exitDuration, ease: 'power2.in', force3D: true }, 0)
      .to('.loader-fade', { opacity: 0, duration: exitDuration * 0.8, force3D: true }, 0)
      .to(containerRef.current, { opacity: 0, duration: exitDuration, force3D: true }, exitDuration * 0.2);
  };

  // Keyboard Enter key shortcut listener (strictly active only after rotation completes)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isAligned) {
        handleEnterHomepage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAligned]);

  return (
    <div
      ref={containerRef}
      id="loading-screen-container"
      className={`fixed inset-0 z-[120] text-white flex flex-col items-center justify-between p-3 sm:p-6 py-2.5 sm:py-4 select-none overflow-hidden transition-all duration-700 font-outfit ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#040508',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(26, 14, 56, 0.75) 0%, rgba(10, 8, 26, 0.96) 55%, #040508 100%)',
        willChange: isExiting ? 'opacity, transform' : 'auto',
      }}
    >
      {/* =========================================================================
          1. RADIAL CELESTIAL NEBULA & STARLIGHT BACKGROUND (Exact Match to Screenshot)
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none transform-gpu">
        {/* Deep Cosmic Ambient Glowing Auroras - Hardware accelerated */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[100px] transform-gpu pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px] transform-gpu pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-violet-600/15 blur-[110px] transform-gpu pointer-events-none" />

        {/* Celestial Conic Alignment Rays */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vmax] h-[140vmax] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(0,242,254,0.025)_0deg_0.5deg,transparent_0.5deg_6deg)] pointer-events-none transform-gpu"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1.5px)] bg-[size:28px_28px] opacity-30 pointer-events-none" />

        {/* Background Starfield Layer */}
        <img
          src="/assets/starfield.svg"
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen pointer-events-none"
        />
      </div>

      {/* =========================================================================
          2. TOP HEADER: CELESTIAL BRANDING (Original Size + Cybernetic Auto-Scramble)
         ========================================================================= */}
      <header className="loader-fade loader-header w-full max-w-6xl flex items-center justify-between relative z-10 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase select-none flex-shrink-0">
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => {
            if (gatewayTextRef.current) {
              scrambleText(gatewayTextRef.current, 'ELIXORA GATEWAY', { duration: 1.5 });
            }
          }}
          title="ELIXORA GATEWAY · Click to scramble"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f2fe]" />
          <span
            ref={gatewayTextRef}
            data-text="ELIXORA GATEWAY"
            className="font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-400 tracking-[0.25em] whitespace-nowrap transition-all duration-300 group-hover:brightness-125"
          >
            ELIXORA GATEWAY
          </span>
        </div>
      </header>

      {/* =========================================================================
          3. CENTRAL 3-ORBITAL PLANETARY CONJUNCTION STAGE (Exact Match to Screenshot)
         ========================================================================= */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center relative py-1">
        <div
          className="relative flex items-center justify-center w-[min(62vw,38vh,250px)] h-[min(62vw,38vh,250px)] sm:w-[min(46vmin,42vh,380px)] sm:h-[min(46vmin,42vh,380px)] transition-transform duration-300 transform-gpu overflow-visible"
        >
          {/* Outer Circular Radial Calibration Ticks with Cyan-Purple Aura */}
          <div 
            className="loader-ring absolute inset-[-6%] rounded-full bg-[repeating-conic-gradient(from_-0.25deg,rgba(0,242,254,0.35)_0deg_0.5deg,transparent_0.5deg_3.6deg)] [mask-image:radial-gradient(circle_closest-side,transparent_93%,#000_94%,#000_98%,transparent_99%)] pointer-events-none drop-shadow-[0_0_12px_rgba(0,242,254,0.3)] transform-gpu" 
            style={{ willChange: 'transform, opacity' }}
          />
          <div className="loader-ring absolute inset-[-3%] rounded-full border border-purple-500/20 pointer-events-none transform-gpu" />

          {/* Dynamic Multi-Color Laser Conjunction Trajectory (Points connect center to each planet) */}
          <svg
            viewBox="0 0 100 100"
            className="loader-fade absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10 transform-gpu"
          >
            <defs>
              <linearGradient id="laserTrajectoryGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <polyline
              ref={polylineRef}
              points="50,50 50,26 50,14 50,0"
              fill="none"
              stroke="url(#laserTrajectoryGrad)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="1.2 1.8"
              className="drop-shadow-[0_0_10px_#00f2fe]"
            />
          </svg>

          {/* 3 Concentric Planetary Alignment Rings (Outer Cyan, Middle Purple, Inner Pink) */}
          {CELESTIAL_ORBS.map((orb, idx) => (
            <div
              key={orb.i}
              className="loader-ring absolute rounded-full transform-gpu"
              style={{
                inset: orb.inset,
                border: orb.border,
              }}
            >
              {/* Orbiting Planet Container - GPU Hardware-accelerated transformation */}
              <div
                ref={(el) => (orbRefs.current[idx] = el)}
                className="absolute inset-0 pointer-events-none transform-gpu"
                style={{ willChange: 'transform' }}
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
                    className={`absolute inset-[-40%] rounded-full border-2 ${orb.lockBorder} opacity-0 pointer-events-none transform-gpu`}
                  />
                  <img
                    src={`/assets/${orb.img}`}
                    alt={orb.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-[0_0_14px_rgba(168,85,247,0.7)]"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* SVG Circular Loading Progress Ring (Cyan to Fuchsia to Purple) */}
          <svg
            viewBox="0 0 100 100"
            className="loader-fade absolute inset-[30%] w-[40%] h-[40%] overflow-visible pointer-events-none z-20 transform-gpu"
          >
            <defs>
              <linearGradient id="orbitProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
              stroke="url(#orbitProgressGrad)"
              strokeWidth="2.4"
              strokeDasharray="307.9"
              strokeDashoffset="307.9"
              transform="rotate(-90 50 50)"
              className="drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]"
              style={{ willChange: 'stroke-dashoffset' }}
            />
          </svg>

          {/* Flare Shockwave on Conjunction Completion */}
          <span
            ref={flareRef}
            className="absolute inset-[24%] rounded-full border-2 border-violet-400 shadow-[0_0_30px_#8b5cf6] opacity-0 pointer-events-none z-30 transform-gpu"
          />

          {/* Center Cosmic Starfield Disc with Live Numeric Counter */}
          <div
            onClick={isAligned ? handleEnterHomepage : undefined}
            className={`loader-disc absolute inset-[33%] rounded-full border border-violet-400/50 overflow-hidden shadow-[0_0_45px_rgba(139,92,246,0.5),0_0_20px_rgba(0,242,254,0.3)] flex flex-col items-center justify-center z-10 transition-all duration-300 transform-gpu ${
              isAligned ? 'cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-transparent' : 'cursor-default'
            }`}
            title={isAligned ? 'Click to enter ELIXORA 2.0' : 'Celestial Conjunction in Progress'}
            style={{
              background: 'radial-gradient(circle at center, #180e38 0%, #0a0718 70%, #040508 100%)',
            }}
          >
            <img
              src="/assets/starfield.svg"
              alt=""
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none mix-blend-screen"
            />
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <span
                ref={countRef}
                className="font-outfit font-black text-2xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-purple-200 tabular-nums leading-none tracking-tight drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
              >
                000
              </span>
              <span className="mt-0.5 sm:mt-1 font-mono text-[8px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.35em] text-cyan-300 font-bold uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                PERCENT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BOTTOM STATUS & THE ENTER HOME PAGE OPTION
          Stuck on this loading page until user explicitly clicks ENTER HOME PAGE!
         ========================================================================= */}
      <footer className="loader-fade loader-footer w-full max-w-xl flex flex-col items-center justify-center relative z-20 text-center pb-1 sm:pb-3 flex-shrink-0 min-h-[50px] sm:min-h-[56px] transform-gpu">
        {/* =====================================================================
            THE ENTER HOME PAGE BUTTON
            Displays exclusively AFTER completing the circle rotation (at 100%)
           ===================================================================== */}
        <div className="flex flex-col items-center justify-center w-full">
          <button
            id="homescreen-enter-button"
            onClick={handleEnterHomepage}
            onMouseEnter={() => triggerEnterScramble(0.4)}
            onTouchStart={() => triggerEnterScramble(0.4)}
            className={`group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 py-2 sm:px-8 sm:py-2.5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_35px_rgba(217,70,239,0.45),0_0_20px_rgba(0,242,254,0.35)] transform-gpu ${
              isAligned 
                ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' 
                : 'opacity-0 scale-90 pointer-events-none translate-y-2'
            }`}
            style={{ willChange: 'transform, opacity' }}
            title="Click to enter ELIXORA 2.0 Home Page"
          >
            {/* Outer Cosmic Multi-Tone Aura Bloom */}
            <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 opacity-75 blur-md group-hover:opacity-100 group-hover:blur-xl transition-all duration-300 transform-gpu ${isAligned ? 'animate-pulse' : ''}`} />

            {/* Orbiting Satellite Particle around the Enter Button */}
            <div 
              className="absolute -inset-2 rounded-full border border-cyan-400/30 border-dotted animate-[spin_7s_linear_infinite] pointer-events-none transform-gpu"
              style={{ willChange: 'transform' }}
            >
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00f2fe]" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-fuchsia-400 shadow-[0_0_5px_#e879f9]" />
            </div>

            {/* Vibrant Electric Cosmic Capsule Body with Glass Highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 border border-pink-300/60 group-hover:border-white/90 backdrop-blur-2xl shadow-[0_6px_24px_rgba(217,70,239,0.5),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 overflow-hidden transform-gpu">
              {/* Gloss overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/25 pointer-events-none" />
              {/* Top Glass Bevel Glint */}
              <div className="absolute inset-x-5 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              {/* Shimmer Light Beam on Hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            </div>

            {/* Button Content: Luminous Crisp Typography & Icon Capsule */}
            <div className="relative z-10 flex items-center gap-2.5">
              <span
                ref={enterBtnTextRef}
                data-scr="true"
                data-text="ENTER"
                className="font-outfit font-black text-[11px] sm:text-xs tracking-[0.22em] sm:tracking-[0.25em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] ml-0.5 inline-block min-w-[50px] sm:min-w-[56px] text-center"
              >
                ENTER
              </span>

              {/* Glowing Arrow Capsule */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 border border-white/60 group-hover:border-white group-hover:bg-white flex items-center justify-center transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
}
