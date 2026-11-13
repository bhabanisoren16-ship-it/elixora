import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LAYERS } from './curtainLayers';

export function Clouds({ l, flip }) {
  return (
    <svg
      viewBox="0 0 2000 1125"
      preserveAspectRatio="xMidYMax slice"
      className="block w-full h-screen pointer-events-none select-none"
      style={{
        transform: flip ? 'scaleY(-1)' : undefined,
        filter: l.glow ? `drop-shadow(0 0 16px ${l.glow})` : undefined,
      }}
    >
      <path d={l.back} fill={l.color} stroke={l.ink} strokeWidth={l.glow ? "6" : "5"} vectorEffect="non-scaling-stroke" />
      <path d={l.back} fill={l.color} />
      <path d={l.front} fill={l.color} stroke={l.ink} strokeWidth={l.glow ? "5" : "4"} vectorEffect="non-scaling-stroke" />
      <path d={l.front} fill={l.color} />
    </svg>
  );
}

export default function CelestialCurtain({
  onComplete,
  title = 'ELIXORA 2026',
  subtitle = 'A NIGHT TO REMEMBER · CELESTIAL ODYSSEY',
  duration = 0.85,
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

    // Safety timeout scaled to curtain duration
    const delay = 0.01;
    const stagger = 0.035;
    const totalExpectedMs = Math.round((delay + duration + 5 * stagger + 0.15) * 1000);
    const safetyTimer = setTimeout(() => {
      completeOnce();
    }, totalExpectedMs);

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
        // 2. Black curtain layers lift swiftly into the sky
        .to(layers, {
          yPercent: -100,
          duration: duration,
          ease: 'power3.inOut',
          stagger: stagger,
          delay: delay,
        })
        // 3. Black backdrop mask fades out smoothly as curtains open
        .to('.curtain-mask', {
          opacity: 0,
          duration: duration * 0.75,
          ease: 'power2.out',
        }, delay);
    }, containerRef);

    return () => {
      clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, [duration]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden pointer-events-none select-none w-screen h-screen"
    >
      {/* Underlying Solid Black Mask */}
      <div className="curtain-mask absolute inset-0 bg-black pointer-events-none" />

      {/* 5 Themed Pure Black Curtain Banks */}
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
                className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none"
              />

              {/* Monochrome Telemetry Badge */}
              <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.35em] text-neutral-200 uppercase">
                  NOW ENTERING
                </span>
              </div>

              {/* Grand Crisp Glowing Event Title */}
              <h1 className="relative z-10 font-outfit font-black text-4xl sm:text-7xl md:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.35)] uppercase">
                {title}
              </h1>

              {/* Monochrome Horizon Accent Divider */}
              <div className="relative z-10 flex items-center gap-2.5 mt-0.5">
                <span className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
                <span className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent via-neutral-400 to-transparent" />
              </div>

              {/* Subtitle Telemetry */}
              <span className="relative z-10 font-mono text-[9px] sm:text-xs tracking-[0.3em] text-neutral-300 uppercase mt-1">
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
