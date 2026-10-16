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

const r1 = (n) => Math.round(n * 10) / 10;
const circle = (cx, cy, r) =>
  `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 1 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 1 ${r1(-2 * r)} 0`;

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

// Cloud layers updated from black to rich cosmic violet and royal indigo palette
const LAYERS = [
  { color: '#131b3e', ink: '#38bdf8', ...cloudBank(11) }, // Layer 0: Deep Celestial Midnight Blue (ink: sky cyan)
  { color: '#1c2254', ink: '#00f2fe', ...cloudBank(23) }, // Layer 1: Royal Electric Indigo (ink: neon cyan)
  { color: '#381666', ink: '#ec4899', ...cloudBank(37) }, // Layer 2: Cosmic Amethyst (ink: hot magenta pink)
  { color: '#4a1b7e', ink: '#c084fc', ...cloudBank(41) }, // Layer 3: Vibrant Cyber Violet (ink: bright lavender)
  { color: '#271244', ink: '#a855f7', ...cloudBank(59) }, // Layer 4 (Front): Rich Royal Violet (ink: cyber purple)
];

function Clouds({ l, flip }) {
  return (
    <svg
      viewBox="0 0 2000 1125"
      preserveAspectRatio="xMidYMax slice"
      className="block w-full h-screen"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <path d={l.back} fill={l.color} stroke={l.ink} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      <path d={l.back} fill={l.color} />
      <path d={l.front} fill={l.color} stroke={l.ink} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <path d={l.front} fill={l.color} />
    </svg>
  );
}

export default function CelestialCurtain({ onComplete, isActive = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray('.curtain-layer');

      gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      })
        .set(layers, { yPercent: 0 })
        .to(layers, {
          yPercent: -100,
          duration: 1.8,
          ease: 'power3.inOut',
          stagger: 0.08,
        });
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[110] overflow-hidden pointer-events-none"
    >
      {LAYERS.map((l, k) => (
        <div
          key={k}
          className="curtain-layer absolute top-0 left-0 w-full h-[300vh] will-change-transform"
          style={{ transform: 'translateY(0%)' }}
        >
          <Clouds l={l} />
          {k === LAYERS.length - 1 ? (
            <div
              className="relative h-[calc(100vh+4px)] -my-[2px] flex flex-col items-center justify-center gap-3 sm:gap-4 text-center px-4"
              style={{ background: l.color }}
            >
              <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.4em] text-cyan-400 uppercase">
                NOW ENTERING
              </span>
              <h1 className="font-outfit font-black text-4xl sm:text-7xl md:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200 drop-shadow-[0_0_35px_rgba(139,92,246,0.5)]">
                ELIXORA 2026
              </h1>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-purple-300/80 uppercase">
                A NIGHT TO REMEMBER · CELESTIAL ODYSSEY
              </span>
            </div>
          ) : (
            <div className="h-[calc(100vh+4px)] -my-[2px]" style={{ background: l.color }} />
          )}
          <Clouds l={l} flip />
        </div>
      ))}
    </div>
  );
}
