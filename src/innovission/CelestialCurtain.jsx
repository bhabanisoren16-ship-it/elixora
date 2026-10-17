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
 * Celestial Cloud Layers themed to ELIXORA's Cosmic Obsidian & Astral Violet palette:
 * Back to front in rich deep space tones (Obsidian Void, Midnight Indigo, Astral Violet, Celestial Velvet).
 * Natural inked contour folds define the cumulus ridges without harsh neon outlines.
 */
const LAYERS = [
  { color: '#070a16', ink: '#101733', ...cloudBank(11) }, // Layer 0: Obsidian Deep Space Void
  { color: '#0d132b', ink: '#1c2552', ...cloudBank(23) }, // Layer 1: Cosmic Midnight Indigo
  { color: '#18123b', ink: '#2d2269', ...cloudBank(37) }, // Layer 2: Astral Amethyst Twilight
  { color: '#271452', ink: '#422285', ...cloudBank(41) }, // Layer 3: Royal Nebula Violet
  { color: '#130c2a', ink: '#2a1854', ...cloudBank(59) }, // Layer 4 (Front): Celestial Obsidian Nexus
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

      // 1. Initial State: Centered on the middle banner block (-33.333% of 300vh = -100vh)
      tl.set(layers, { yPercent: -33.333, force3D: true })
        // 2. Brief settle, then layers lift sequentially into the sky
        .to(layers, {
          yPercent: -100,
          duration: 1.5,
          ease: 'power3.inOut',
          stagger: 0.075,
          delay: 0.15,
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
      {/* Underlying Solid Theme Obsidian Mask */}
      <div className="absolute inset-0 bg-[#040508] pointer-events-none" />

      {/* 5 Themed Celestial Cloud Curtain Banks */}
      {LAYERS.map((l, k) => (
        <div
          key={k}
          className="curtain-layer absolute top-0 left-0 w-full h-[300vh] will-change-transform pointer-events-none"
          style={{ transform: 'translateY(-33.333%)' }}
        >
          {/* Top Cloud Skyline Bank */}
          <Clouds l={l} />

          {/* Middle Solid Banner Section */}
          {k === LAYERS.length - 1 ? (
            <div
              className="relative h-[calc(100vh+4px)] -my-[2px] flex flex-col items-center justify-center gap-3 sm:gap-4 text-center px-4 overflow-hidden"
              style={{ background: l.color }}
            >
              {/* Subtle Starfield Overlay */}
              <img
                src="/assets/starfield.svg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen pointer-events-none"
              />

              {/* Glowing Telemetry Badge */}
              <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.35em] text-cyan-300 uppercase">
                  NOW ENTERING
                </span>
              </div>

              {/* Grand Glowing Event Title */}
              <h1 className="relative z-10 font-outfit font-black text-4xl sm:text-7xl md:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200 drop-shadow-[0_0_35px_rgba(139,92,246,0.6)] uppercase">
                {title}
              </h1>

              {/* Glowing Horizon Accent Divider */}
              <div className="relative z-10 flex items-center gap-2.5 mt-0.5">
                <span className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-purple-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f2fe] animate-pulse" />
                <span className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent via-cyan-400 to-purple-400" />
              </div>

              {/* Subtitle Telemetry */}
              <span className="relative z-10 font-mono text-[9px] sm:text-xs tracking-[0.3em] text-purple-200/90 uppercase mt-1">
                {subtitle}
              </span>
            </div>
          ) : (
            <div
              className="h-[calc(100vh+4px)] -my-[2px]"
              style={{ background: l.color }}
            />
          )}

          {/* Bottom Trailing Edge Cloud Bank (Flips to lift off the screen) */}
          <Clouds l={l} flip />
        </div>
      ))}
    </div>
  );
}
