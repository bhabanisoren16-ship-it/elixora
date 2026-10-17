import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Top celestial curtain gate path: fills from y=0 down to scalloped billowing peaks near middle
 */
function generateTopGatePath(seed, crestY = 380, width = 2000) {
  const rnd = seeded(seed);
  let d = `M -100 0 L -100 ${crestY}`;
  let currentX = -100;
  let currentY = crestY;

  while (currentX < width + 100) {
    const lobeW = 100 + rnd() * 160;
    const lobeH = 65 + rnd() * 110;
    const peakX = currentX + lobeW * (0.4 + rnd() * 0.2);
    const peakY = crestY + lobeH;
    const nextX = currentX + lobeW;
    const nextY = crestY + (rnd() - 0.5) * 30;

    const cp1x = currentX + (peakX - currentX) * 0.35;
    const cp1y = peakY - lobeH * 0.15;
    const cp2x = peakX + (nextX - peakX) * 0.65;
    const cp2y = peakY - lobeH * 0.15;

    d += ` C ${Math.round(cp1x)} ${Math.round(cp1y)}, ${Math.round(cp2x)} ${Math.round(cp2y)}, ${Math.round(nextX)} ${Math.round(nextY)}`;
    currentX = nextX;
    currentY = nextY;
  }

  d += ` L ${width + 100} 0 Z`;
  return d;
}

/**
 * Bottom celestial curtain gate path: fills from y=550 up to scalloped billowing peaks near middle
 */
function generateBottomGatePath(seed, crestY = 170, width = 2000, height = 550) {
  const rnd = seeded(seed);
  let d = `M -100 ${height} L -100 ${crestY}`;
  let currentX = -100;
  let currentY = crestY;

  while (currentX < width + 100) {
    const lobeW = 100 + rnd() * 160;
    const lobeH = 65 + rnd() * 110;
    const peakX = currentX + lobeW * (0.4 + rnd() * 0.2);
    const peakY = crestY - lobeH;
    const nextX = currentX + lobeW;
    const nextY = crestY + (rnd() - 0.5) * 30;

    const cp1x = currentX + (peakX - currentX) * 0.35;
    const cp1y = peakY + lobeH * 0.15;
    const cp2x = peakX + (nextX - peakX) * 0.65;
    const cp2y = peakY + lobeH * 0.15;

    d += ` C ${Math.round(cp1x)} ${Math.round(cp1y)}, ${Math.round(cp2x)} ${Math.round(cp2y)}, ${Math.round(nextX)} ${Math.round(nextY)}`;
    currentX = nextX;
    currentY = nextY;
  }

  d += ` L ${width + 100} ${height} Z`;
  return d;
}

const GATE_LAYERS = [
  { color: '#090518', ink: '#38bdf8', seedTop: 11, topCrest: 460, seedBottom: 17, bottomCrest: 90 },
  { color: '#13082e', ink: '#00f2fe', seedTop: 29, topCrest: 410, seedBottom: 31, bottomCrest: 140 },
  { color: '#240c48', ink: '#ec4899', seedTop: 47, topCrest: 360, seedBottom: 53, bottomCrest: 190 },
  { color: '#351163', ink: '#c084fc', seedTop: 67, topCrest: 310, seedBottom: 73, bottomCrest: 240 },
  { color: '#1a0730', ink: '#e879f9', seedTop: 89, topCrest: 260, seedBottom: 97, bottomCrest: 290 },
];

const PRECOMPUTED_GATES = GATE_LAYERS.map((cfg) => ({
  ...cfg,
  topPath: generateTopGatePath(cfg.seedTop, cfg.topCrest),
  bottomPath: generateBottomGatePath(cfg.seedBottom, cfg.bottomCrest),
}));

export default function CelestialCurtain({
  onComplete,
  title = 'ELIXORA 2026',
  subtitle = 'CELESTIAL ODYSSEY · A NIGHT TO REMEMBER',
}) {
  const containerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback reference updated without triggering re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    let isCompleted = false;
    const completeOnce = () => {
      if (!isCompleted) {
        isCompleted = true;
        onCompleteRef.current?.();
      }
    };

    // Safety timeout: guarantee onComplete is called and curtain unmounts even if GSAP is throttled
    const safetyTimer = setTimeout(() => {
      completeOnce();
    }, 1700);

    const ctx = gsap.context(() => {
      const topLayers = gsap.utils.toArray('.gate-top-layer');
      const bottomLayers = gsap.utils.toArray('.gate-bottom-layer');
      const backdrop = containerRef.current.querySelector('.gate-backdrop');
      const centerChamber = containerRef.current.querySelector('.gate-center-chamber');

      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(safetyTimer);
          completeOnce();
        },
      });

      // 1. Initial State: Curtains fully cover the viewport
      tl.set(topLayers, { yPercent: 0, force3D: true })
        .set(bottomLayers, { yPercent: 0, force3D: true })
        .set(backdrop, { opacity: 1, force3D: true })
        .set(centerChamber, { opacity: 1, scale: 1, force3D: true })

        // 2. Brief 0.1s dramatic anticipation, then curtains part open
        .to(topLayers, {
          yPercent: -105,
          duration: 0.85,
          ease: 'power3.inOut',
          stagger: 0.035,
          delay: 0.1,
        })
        .to(bottomLayers, {
          yPercent: 105,
          duration: 0.85,
          ease: 'power3.inOut',
          stagger: 0.035,
          delay: 0.1,
        }, '<')
        .to(centerChamber, {
          opacity: 0,
          scale: 1.05,
          duration: 0.5,
          ease: 'power2.in',
          delay: 0.05,
        }, '<')
        .to(backdrop, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut',
          delay: 0.15,
        }, '<');
    }, containerRef);

    return () => {
      clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden pointer-events-none select-none w-screen h-screen"
    >
      {/* 0. Deep Cosmic Night Backdrop Veil */}
      <div
        className="gate-backdrop absolute inset-0 pointer-events-none will-change-opacity"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(46, 16, 80, 0.6) 0%, rgba(13, 8, 30, 0.96) 65%, #05020c 100%)',
        }}
      />

      {/* 1. Top Celestial Curtain Gate Banks (Billow upward off-screen) */}
      {PRECOMPUTED_GATES.map((l, k) => (
        <div
          key={`top-${k}`}
          className="gate-top-layer absolute top-0 left-0 w-full h-[56vh] will-change-transform pointer-events-none"
        >
          <svg
            viewBox="0 0 2000 550"
            preserveAspectRatio="none"
            className="block w-full h-full pointer-events-none select-none"
          >
            <path
              d={l.topPath}
              fill={l.color}
              style={{ filter: `drop-shadow(0 4px 16px ${l.ink}55)` }}
            />
            <path
              d={l.topPath}
              fill="none"
              stroke={l.ink}
              strokeWidth="3.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ))}

      {/* 2. Bottom Celestial Curtain Gate Banks (Billow downward off-screen) */}
      {PRECOMPUTED_GATES.map((l, k) => (
        <div
          key={`bottom-${k}`}
          className="gate-bottom-layer absolute bottom-0 left-0 w-full h-[56vh] will-change-transform pointer-events-none"
        >
          <svg
            viewBox="0 0 2000 550"
            preserveAspectRatio="none"
            className="block w-full h-full pointer-events-none select-none"
          >
            <path
              d={l.bottomPath}
              fill={l.color}
              style={{ filter: `drop-shadow(0 -4px 16px ${l.ink}55)` }}
            />
            <path
              d={l.bottomPath}
              fill="none"
              stroke={l.ink}
              strokeWidth="3.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ))}

      {/* 3. Glowing Center Chamber (Floating celestial beacon & portal insignia) */}
      <div
        className="gate-center-chamber absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center px-4 overflow-hidden pointer-events-none will-change-opacity will-change-transform"
      >
        {/* Subtle Cosmic Starfield Overlay */}
        <img
          src="/assets/starfield.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
        />

        {/* Glowing Beacon Pill */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.35em] text-cyan-300 uppercase">
            CELESTIAL GATEWAY · OPENING
          </span>
        </div>

        {/* Grand Glowing Event Title */}
        <h1 className="relative z-10 font-outfit font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200 drop-shadow-[0_0_40px_rgba(139,92,246,0.9)] uppercase">
          {title}
        </h1>

        {/* Glowing Horizon Accent Divider */}
        <div className="relative z-10 flex items-center gap-2.5 mt-1">
          <span className="w-12 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-purple-400" />
          <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#00f2fe] animate-pulse" />
          <span className="w-12 sm:w-24 h-0.5 bg-gradient-to-l from-transparent via-cyan-400 to-purple-400" />
        </div>

        {/* Subtitle Telemetry */}
        <span className="relative z-10 font-mono text-[9px] sm:text-xs tracking-[0.3em] text-purple-200/90 uppercase mt-1">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
