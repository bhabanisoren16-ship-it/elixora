import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { scrambleText } from './scrambleText';
import { LAYERS } from './curtainLayers';
import { Clouds } from './CelestialCurtain';

/**
 * Celestial Telemetry Refresh Page for ELIXORA 2.0
 * 
 * Distinctive Features:
 * 1. Dedicated to browser reloads (F5 / Refresh)
 * 2. Visual Theme: 3-Orbital Celestial Conjunction & Astral Telemetry Scanner
 * 3. 3 Concentric planetary tracks (planet-tide, planet-earth, planet-mars) aligning on the celestial meridian (syzygy conjunction)
 * 4. Real-time laser vector line tracking conjunction angles
 * 5. Starfield core with high-precision tabular numeric counter (000% -> 100%)
 * 6. Dynamic ScrambleText celestial status telemetry
 * 7. STRICTLY NO ENTER BUTTON: Automatically synchronizes in ~1.3s and seamlessly opens the refreshed homepage
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

const REFRESH_STATUSES = [
  'PAGE RELOAD DETECTED · INITIATING CELESTIAL REFRESH',
  'SYNCHRONIZING CELESTIAL ORBITAL MERIDIAN',
  'UPDATING FESTIVAL TELEMETRY & TICKET CACHE',
  'CELESTIAL REFRESH COMPLETE · OPENING HOMEPAGE',
];

export default function SciFiOrbitalLoader({ onComplete, duration = 1.0 }) {
  const containerRef = useRef(null);
  const statusRef = useRef(null);
  const countRef = useRef(null);
  const progressCircleRef = useRef(null);
  const flareRef = useRef(null);
  const polylineRef = useRef(null);
  const orbRefs = useRef([]);
  const lockRefs = useRef([]);
  const gatewayTextRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const isExitedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Automatically trigger cybernetic scramble effect on ELIXORA GATEWAY
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

      gsap.from('.loader-footer', {
        y: 20,
        opacity: 0,
        duration: entranceDuration * 0.8,
        ease: 'power3.out',
        force3D: true,
      });
    }, containerRef);

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

      // 3. Update planetary alignment rotation & laser alignment trajectory (Exact copy from main screen)
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

      // Status text updates with ScrambleText
      const statusIdx = Math.min(3, Math.floor(currentPercent / 25));
      if (statusIdx !== lastStatusIdx) {
        lastStatusIdx = statusIdx;
        if (statusRef.current) {
          scrambleText(statusRef.current, REFRESH_STATUSES[statusIdx], { duration: Math.min(0.24, duration * 0.18) });
        }
      }

      if (currentPercent < 99.5) {
        animId = requestAnimationFrame(updateLoader);
      } else {
        // Conjunction achieved! Align planets at top and trigger smooth curtain reveal
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
        if (statusRef.current) {
          scrambleText(statusRef.current, REFRESH_STATUSES[3], { duration: 0.25 });
        }
        if (flareRef.current) {
          gsap.fromTo(
            flareRef.current,
            { scale: 0.8, opacity: 1 },
            { scale: 2.6, opacity: 0, duration: 0.5, ease: 'expo.out', force3D: true }
          );
        }
        // Seamlessly trigger the curtain reveal without any intermediate flicker
        triggerCurtainReveal();
      }
    };

    animId = requestAnimationFrame(updateLoader);

    // Guaranteed safety fallback: automatically trigger exit even if RAF stalls
    const safetyTimer = setTimeout(() => {
      triggerCurtainReveal();
    }, (duration + 1.2) * 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, [duration]);

  const triggerCurtainReveal = () => {
    if (isExitedRef.current) return;
    isExitedRef.current = true;
    setIsExiting(true);

    const curtainDuration = 0.65;
    const stagger = 0.025;

    const tl = gsap.timeline({
      onComplete: () => {
        onCompleteRef.current?.();
      },
    });

    // 1. Center orbital stage scales down and dissolves into starlight
    tl.to(
      '.loader-center-stage',
      { scale: 0.9, opacity: 0, duration: 0.35, ease: 'power2.in', force3D: true },
      0
    )
    // 2. Header and background fade out gracefully into the lifting curtain
    .to(
      '.loader-fade-ui',
      { opacity: 0, duration: 0.28, ease: 'power2.in', force3D: true },
      0
    )
    .to(
      '.loader-bg-pane',
      { opacity: 0, duration: 0.38, ease: 'power2.in', force3D: true },
      0.02
    )
    // 3. Layered Pure Black Celestial Curtain banks sweep swiftly and smoothly upward
    .to(
      '.curtain-layer',
      {
        yPercent: -100,
        duration: curtainDuration,
        ease: 'power3.inOut',
        stagger: stagger,
        force3D: true,
      },
      0.04
    );
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[120] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden font-outfit ${
        isExiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {/* =========================================================================
          0. 5 THEMED PURE BLACK CELESTIAL CURTAIN BANKS (Layered cloud wipe reveal)
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {LAYERS.map((l, k) => (
          <div
            key={k}
            className="curtain-layer absolute top-0 left-0 w-full h-[300vh] will-change-transform pointer-events-none"
            style={{ transform: 'translateY(-33.333%)' }}
          >
            {/* Top Cloud Skyline Bank */}
            <Clouds l={l} />

            {/* Middle Solid Section */}
            <div
              className="h-[calc(100vh+4px)] -my-[2px]"
              style={{ background: l.color }}
            />

            {/* Bottom Trailing Edge Cloud Bank (Flips to lift off the screen) */}
            <Clouds l={l} flip />
          </div>
        ))}
      </div>

      {/* =========================================================================
          1. RADIAL CELESTIAL NEBULA & STARLIGHT BACKGROUND
         ========================================================================= */}
      <div className="loader-bg-pane absolute inset-0 pointer-events-none z-10 will-change-transform">
        {/* Deep Cosmic Ambient Glowing Auroras in Theme Cyan & Cyber Violet */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-violet-600/15 blur-[130px]" />

        {/* Celestial Conic Alignment Lines in Cyber Cyan */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vmax] h-[160vmax] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(0,242,254,0.025)_0deg_0.5deg,transparent_0.5deg_6deg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1.5px)] bg-[size:28px_28px] opacity-30" />

        {/* Background Starfield Layer */}
        <img
          src="/assets/starfield.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
        />
      </div>

      {/* =========================================================================
          2. TOP HEADER: CELESTIAL BRANDING (Original Size + Cybernetic Auto-Scramble)
         ========================================================================= */}
      <header className="loader-fade-ui loader-header w-full max-w-6xl flex items-center justify-between relative z-20 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase select-none">
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
          3. CENTRAL 3-ORBITAL PLANETARY CONJUNCTION STAGE (Exact Copy from Main Screen)
         ========================================================================= */}
      <div className="loader-center-stage flex-1 min-h-0 w-full flex items-center justify-center relative py-1 sm:py-2 z-20 will-change-transform">
        <div
          className="relative flex items-center justify-center w-[min(68vw,36vh,260px)] h-[min(68vw,36vh,260px)] sm:w-[min(46vmin,42vh,380px)] sm:h-[min(46vmin,42vh,380px)] transition-transform duration-300 transform-gpu overflow-visible"
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
              <linearGradient id="laserTrajectoryGradRefresh" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <polyline
              ref={polylineRef}
              points="50,50 50,26 50,14 50,0"
              fill="none"
              stroke="url(#laserTrajectoryGradRefresh)"
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
              <linearGradient id="orbitProgressGradRefresh" x1="0%" y1="0%" x2="100%" y2="100%">
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
              stroke="url(#orbitProgressGradRefresh)"
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
            className="loader-disc absolute inset-[33%] rounded-full border border-violet-400/50 overflow-hidden shadow-[0_0_45px_rgba(139,92,246,0.5),0_0_20px_rgba(0,242,254,0.3)] flex flex-col items-center justify-center z-10 transition-all duration-300 transform-gpu"
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
          4. BOTTOM STATUS TELEMETRY (Seamless & Minimalist)
         ========================================================================= */}
      <footer className="loader-fade-ui loader-footer w-full max-w-xl flex flex-col items-center justify-center relative z-20 text-center pb-2 sm:pb-4 min-h-[32px]">
        {/* Hidden status ref for safe script reference */}
        <span ref={statusRef} className="hidden" aria-hidden="true" />
      </footer>
    </div>
  );
}
