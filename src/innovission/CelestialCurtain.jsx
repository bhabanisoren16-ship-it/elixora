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
 * Normal authentic celestial cloud layers:
 * Back to front in natural ink-to-paper tones (NOT neon).
 * The front paper bank (#ECE8DF) carries the "NOW ENTERING ELIXORA 2026" typography.
 */
const LAYERS = [
  { color: '#141312', ink: '#000000', ...cloudBank(11) },
  { color: '#3a3530', ink: '#1d1a17', ...cloudBank(23) },
  { color: '#6e665c', ink: '#3d3832', ...cloudBank(37) },
  { color: '#c9bfae', ink: '#857b6c', ...cloudBank(41) },
  { color: '#ECE8DF', ink: '#a39b8d', ...cloudBank(59) },
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

    // Safety timeout: guarantee onComplete is called even if backgrounded or throttled
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
        // 2. Brief settle, then layers lift sequentially to reveal the page underneath
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
      {/* Underlying Solid Mask */}
      <div className="absolute inset-0 bg-[#141312] pointer-events-none" />

      {/* 5 Normal Celestial Cloud Curtain Banks */}
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
              className="relative h-[calc(100vh+4px)] -my-[2px] flex flex-col items-center justify-center gap-3 sm:gap-4 text-center px-4"
              style={{ background: l.color }}
            >
              <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.38em] text-[#5c5346] uppercase">
                NOW ENTERING
              </span>
              <h1 className="font-outfit font-black text-4xl sm:text-7xl md:text-8xl tracking-tight text-[#141312] drop-shadow-sm uppercase">
                {title}
              </h1>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#3d3832] uppercase">
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
