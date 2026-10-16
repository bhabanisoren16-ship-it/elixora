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
 * Top cloud gate path: fills from y=0 down to scalloped billowing peaks near bottom
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
 * Bottom cloud gate path: fills from y=550 up to scalloped billowing peaks near top
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
  onMidway,
  isActive = true,
  mode = 'reveal',
  title = 'ELIXORA 2026',
  subtitle = 'A NIGHT TO REMEMBER · CELESTIAL ODYSSEY',
}) {
  const containerRef = useRef(null);
  const onMidwayRef = useRef(onMidway);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onMidwayRef.current = onMidway;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const topLayers = gsap.utils.toArray('.gate-top-layer');
      const bottomLayers = gsap.utils.toArray('.gate-bottom-layer');
      const backdrop = containerRef.current.querySelector('.gate-backdrop');
      const centerChamber = containerRef.current.querySelector('.gate-center-chamber');

      if (mode === 'transition') {
        const tl = gsap.timeline({
          onComplete: () => {
            onCompleteRef.current?.();
          },
        });

        // 1. Initial State: Top gates above screen (-100%), bottom gates below screen (100%), overlays transparent
        tl.set(topLayers, { yPercent: -100, force3D: true })
          .set(bottomLayers, { yPercent: 100, force3D: true })
          .set(backdrop, { opacity: 0, force3D: true })
          .set(centerChamber, { opacity: 0, force3D: true })

          // 2. Dual Surge: Clouds billow inward from BOTH top and bottom simultaneously
          .to(topLayers, {
            yPercent: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.04,
          }, 0)
          .to(bottomLayers, {
            yPercent: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.04,
          }, 0)
          .to([backdrop, centerChamber], {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          }, 0.1)

          // 3. Screen 100% Shrouded: Trigger midway section repositioning behind clouds
          .call(() => {
            onMidwayRef.current?.();
          })

          // 4. Hold to clearly display the celestial cloud curtain & section beacon
          .to({}, { duration: 0.45 })

          // 5. Part the Celestial Clouds: Top gates roll up, bottom gates roll down
          .to(topLayers, {
            yPercent: -100,
            duration: 0.6,
            ease: 'power3.inOut',
            stagger: 0.04,
          })
          .to(bottomLayers, {
            yPercent: 100,
            duration: 0.6,
            ease: 'power3.inOut',
            stagger: 0.04,
          }, '<')
          .to([backdrop, centerChamber], {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.in',
          }, '<0.1');

      } else {
        // Reveal mode (initial site entry / refresh reveal)
        const tl = gsap.timeline({
          onComplete: () => {
            onCompleteRef.current?.();
          },
        });

        tl.set(topLayers, { yPercent: 0, force3D: true })
          .set(bottomLayers, { yPercent: 0, force3D: true })
          .set(backdrop, { opacity: 1, force3D: true })
          .set(centerChamber, { opacity: 1, force3D: true })
          .to(topLayers, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            stagger: 0.04,
            delay: 0.1,
          })
          .to(bottomLayers, {
            yPercent: 100,
            duration: 0.8,
            ease: 'power3.inOut',
            stagger: 0.04,
            delay: 0.1,
          }, '<')
          .to([backdrop, centerChamber], {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            delay: 0.1,
          }, '<');
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, mode]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden pointer-events-none select-none w-screen h-screen"
    >
      {/* 0. Solid Cosmic Night Veil (Guarantees 100% zero-gap masking behind clouds) */}
      <div
        className="gate-backdrop absolute inset-0 bg-[#070414] pointer-events-none will-change-opacity"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(59, 18, 105, 0.35) 0%, rgba(7, 4, 20, 0.95) 100%), url('/assets/cloud-curtain-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 1. Top Cloud Gate Banks (Billow down from top edge) */}
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

      {/* 2. Bottom Cloud Gate Banks (Billow up from bottom edge) */}
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

      {/* 3. Glowing Center Chamber & Destination Telemetry Beacon (Floats gracefully in center) */}
      <div
        className="gate-center-chamber absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center px-4 overflow-hidden pointer-events-none will-change-opacity"
      >
        {/* Subtle Starfield Layer */}
        <img
          src="/assets/starfield.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-screen pointer-events-none"
        />

        {/* Glowing Telemetry Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.35em] text-cyan-300 uppercase">
            {subtitle || 'CELESTIAL TRANSITION'}
          </span>
        </div>

        {/* Big Glowing Futuristic Title */}
        <h1 className="relative z-10 font-outfit font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200 drop-shadow-[0_0_40px_rgba(139,92,246,0.9)] uppercase">
          {title || 'ELIXORA 2026'}
        </h1>

        {/* Glowing Accent Divider */}
        <div className="relative z-10 flex items-center gap-2.5 mt-1">
          <span className="w-12 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-purple-400" />
          <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#00f2fe] animate-pulse" />
          <span className="w-12 sm:w-24 h-0.5 bg-gradient-to-l from-transparent via-cyan-400 to-purple-400" />
        </div>

        {/* Subtitle Telemetry */}
        <span className="relative z-10 font-mono text-[9px] sm:text-xs tracking-[0.3em] text-purple-200/90 uppercase mt-1">
          A NIGHT TO REMEMBER · CELESTIAL ODYSSEY
        </span>
      </div>
    </div>
  );
}
