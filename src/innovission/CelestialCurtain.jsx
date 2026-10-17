import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Seeded random generator (mulberry32), draws deterministic celestial cloud silhouettes
 */
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;
const circle = (cx, cy, r) =>
  `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 1 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 1 ${r1(-2 * r)} 0`;

/**
 * Procedural celestial cumulus bank in a 2000x1125 box.
 * `back` is the skyline: puffs along a wandering baseline with stacked towers.
 * `front` is a lower ridge of big puffs reading as inked folds inside the cloud.
 */
function cloudBank(seed) {
  const rnd = seeded(seed);
  const p1 = rnd() * 6.3;
  const p2 = rnd() * 6.3;
  const base = (x) => 640 + 75 * Math.sin(x / 290 + p1) + 35 * Math.sin(x / 110 + p2);
  let back = 'M-100 780H2100V1125H-100Z';
  let front = '';

  for (let x = -60; x < 2080; x += 45 + rnd() * 75) {
    const cy = base(x) + rnd() * 40;
    const r = Math.max(55 + rnd() * 105, 800 - cy);
    back += circle(x, cy, r);
    if (rnd() < 0.1) {
      let ty = cy - r * 0.7;
      let tr = r * 0.7;
      for (let k = 0; k < 2 + rnd() * 2; k++) {
        back += circle(x + (rnd() - 0.5) * tr * 0.6, ty, tr);
        ty -= tr * 0.6;
        tr *= 0.72;
      }
    }
  }

  for (let x = -40; x < 2080; x += 140 + rnd() * 180) {
    const r = 120 + rnd() * 110;
    const cy = 1020 + rnd() * 110;
    front += circle(x, cy, r) + circle(x + r * 0.8, cy + 30 + rnd() * 40, r * (0.6 + rnd() * 0.3));
  }

  return { back, front };
}

/**
 * Rich Royal Purple & Cosmic Violet Celestial Cloud Layers (NO black):
 * Vibrant multi-tiered purple, royal violet, celestial amethyst, and starlight lavender.
 * Clear shaded contour strokes define each cumulus ridge with rich depth.
 */
const LAYERS = [
  { color: '#240c48', ink: '#431475', ...cloudBank(11) }, // Layer 0: Deep Royal Violet
  { color: '#3b0764', ink: '#6b21a8', ...cloudBank(23) }, // Layer 1: Imperial Cosmic Purple
  { color: '#581c87', ink: '#7e22ce', ...cloudBank(37) }, // Layer 2: Radiant Celestial Amethyst
  { color: '#6d28d9', ink: '#8b5cf6', ...cloudBank(41) }, // Layer 3: Vibrant Nebula Violet
  { color: '#4c1d95', ink: '#7c3aed', ...cloudBank(59) }, // Layer 4 (Front): Majestic Starlight Purple Banner
];

function Clouds({ l, flip }) {
  return (
    <svg
      viewBox="0 0 2000 1125"
      preserveAspectRatio="xMidYMax slice"
      className="block w-full h-screen pointer-events-none select-none"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <path d={l.back} fill={l.color} stroke={l.ink} strokeWidth="5" vectorEffect="non-scaling-stroke" />
      <path d={l.back} fill={l.color} />
      <path d={l.front} fill={l.color} stroke={l.ink} strokeWidth="4" vectorEffect="non-scaling-stroke" />
      <path d={l.front} fill={l.color} />
    </svg>
  );
}

export default function CelestialCurtain({
  onComplete,
  title = 'ELIXORA 2026',
  subtitle = 'A NIGHT TO REMEMBER · CELESTIAL ODYSSEY',
}) {
  const containerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

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

    // Safety timeout: guarantee onComplete is called and curtain unmounts
    const safetyTimer = setTimeout(() => {
      completeOnce();
    }, 2400);

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray('.curtain-layer');

      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(safetyTimer);
          completeOnce();
        },
      });

      // 1. Initial State: Resting at y=0 (middle banner perfectly covering viewport)
      tl.set(layers, { y: 0, force3D: true })
        // 2. Brief 0.2s pause for dramatic presence, then cloud banks roll up into the heavens
        .to(layers, {
          y: '-205vh',
          duration: 1.6,
          ease: 'power3.inOut',
          stagger: 0.08,
          delay: 0.2,
        });
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
      {/* 5 Themed Celestial Cloud Curtain Banks (Royal Purple & Radiant Violet - NO BLACK) */}
      {LAYERS.map((l, k) => (
        <div
          key={k}
          className="curtain-layer absolute top-[-100vh] left-0 w-full h-[300vh] will-change-transform pointer-events-none"
        >
          {/* Top Cloud Skyline Bank (Resting above viewport) */}
          <Clouds l={l} />

          {/* Middle Solid Banner Section (Resting directly in viewport) */}
          {k === LAYERS.length - 1 ? (
            <div
              className="relative h-[calc(100vh+4px)] -my-[2px] flex flex-col items-center justify-center gap-3 sm:gap-4 text-center px-4 overflow-hidden"
              style={{
                background: 'radial-gradient(circle at center, rgba(109, 40, 217, 0.95) 0%, rgba(76, 29, 149, 0.98) 55%, #3b0764 100%)',
              }}
            >
              {/* Starfield Overlay */}
              <img
                src="/assets/starfield.svg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-screen pointer-events-none"
              />

              {/* Glowing Telemetry Badge */}
              <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.35)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.35em] text-cyan-300 uppercase">
                  NOW ENTERING
                </span>
              </div>

              {/* Grand Glowing Event Title */}
              <h1 className="relative z-10 font-outfit font-black text-4xl sm:text-7xl md:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200 drop-shadow-[0_0_35px_rgba(139,92,246,0.8)] uppercase">
                {title}
              </h1>

              {/* Glowing Horizon Accent Divider */}
              <div className="relative z-10 flex items-center gap-2.5 mt-0.5">
                <span className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-purple-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f2fe] animate-pulse" />
                <span className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent via-cyan-400 to-purple-400" />
              </div>

              {/* Subtitle Telemetry */}
              <span className="relative z-10 font-mono text-[9px] sm:text-xs tracking-[0.3em] text-purple-100 font-medium uppercase mt-1">
                {subtitle}
              </span>
            </div>
          ) : (
            <div
              className="h-[calc(100vh+4px)] -my-[2px]"
              style={{ background: l.color }}
            />
          )}

          {/* Bottom Trailing Edge Cloud Bank (Lifts smoothly across viewport to unveil homepage) */}
          <Clouds l={l} flip />
        </div>
      ))}
    </div>
  );
}
