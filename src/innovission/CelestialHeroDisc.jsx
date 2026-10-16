import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SPARKS = [
  { x: '18%', y: '22%', s: 14, c: 'rgba(0, 242, 254, 0.85)' },
  { x: '82%', y: '16%', s: 18, c: 'rgba(217, 70, 239, 0.85)' },
  { x: '12%', y: '78%', s: 12, c: 'rgba(251, 191, 36, 0.85)' },
  { x: '88%', y: '74%', s: 16, c: 'rgba(0, 242, 254, 0.75)' },
  { x: '50%', y: '6%', s: 20, c: 'rgba(255, 255, 255, 0.9)' },
  { x: '35%', y: '88%', s: 14, c: 'rgba(168, 85, 247, 0.8)' },
];

export default function CelestialHeroDisc({ className = '', style = {} }) {
  const containerRef = useRef(null);
  const discRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse Parallax
  useEffect(() => {
    let animationFrame;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMousePos({ x: currentX, y: currentY });
      animationFrame = requestAnimationFrame(updateParallax);
    };

    animationFrame = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // GSAP ScrollTrigger for Hero Parallax Depth Scrub
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: 15,
        scale: 0.9,
        opacity: 0.45,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Continuous Orbital Rotation Timelines
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ring 1 orbit (Outer asteroid orbit)
      gsap.to('.celestial-orbit-1', {
        rotation: 360,
        duration: 90,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });

      // Ring 2 orbit (Middle ringed planet orbit)
      gsap.to('.celestial-orbit-2', {
        rotation: -360,
        duration: 160,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });

      // Ring 3 orbit (Inner marker orbit)
      gsap.to('.celestial-orbit-3', {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });

      // Pulse glows
      gsap.to('.celestial-core-glow', {
        scale: 1.15,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const px = mousePos.x * 22;
  const py = mousePos.y * 18;

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{
        zIndex: 0,
        ...style,
      }}
    >
      {/* Dynamic Parallax Container */}
      <div
        className="relative flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          width: 'min(85vmin, 680px)',
          height: 'min(85vmin, 680px)',
          transform: `translate3d(${px}px, ${py}px, 0)`,
        }}
      >
        {/* Ambient Cosmic Radial Gradient Backing */}
        <div className="absolute inset-[-25%] rounded-full bg-radial from-cyan-500/12 via-purple-600/8 to-transparent blur-3xl pointer-events-none" />

        {/* Outer Ring 3: 88% diameter, dotted cyan styling */}
        <div
          ref={ring3Ref}
          className="absolute inset-[3%] rounded-full border border-dotted border-cyan-400/30 celestial-orbit-2 pointer-events-none"
        >
          {/* Orbiting Ringed Planet */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer">
            <div className="relative">
              <img
                src="/assets/planet-ringed.webp"
                alt="Orbiting Planet"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_15px_rgba(0,242,254,0.6)] filter contrast-125 brightness-110 transition-transform duration-300 group-hover:scale-125"
                loading="lazy"
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-cyan-400/50">
                ORBIT-III · RINGED
              </span>
            </div>
          </div>
        </div>

        {/* Middle Ring 2: 70% diameter, dashed purple styling */}
        <div
          ref={ring2Ref}
          className="absolute inset-[15%] rounded-full border border-dashed border-purple-400/35 celestial-orbit-1 pointer-events-none"
        >
          {/* Orbiting Asteroid */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer">
            <div className="relative">
              <img
                src="/assets/asteroid.webp"
                alt="Orbiting Asteroid"
                className="w-7 h-7 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] transition-transform duration-300 group-hover:scale-125"
                loading="lazy"
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-purple-400/50">
                ASTEROID BELT · CLUSTER
              </span>
            </div>
          </div>
        </div>

        {/* Inner Ring 1: 54% diameter, solid amber/gold styling */}
        <div
          ref={ring1Ref}
          className="absolute inset-[24%] rounded-full border border-amber-400/30 celestial-orbit-3 pointer-events-none"
        >
          {/* Glowing Cosmic Satellite Marker */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <span className="block w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#f59e0b] animate-ping" />
            <span className="absolute inset-0 block w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
          </div>
        </div>

        {/* The Central Cosmic Celestial Starfield Disc */}
        <div
          ref={discRef}
          className="relative w-[50%] h-[50%] rounded-full bg-[#07090e] border border-cyan-500/25 shadow-[0_0_45px_rgba(0,0,0,0.9),inset_0_0_35px_rgba(0,242,254,0.15)] overflow-hidden flex items-center justify-center will-change-transform"
        >
          {/* Embedded Starfield Background SVG */}
          <img
            src="/assets/starfield.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-85 select-none"
          />

          {/* Concentric Decorative Rings inside Disc */}
          <span
            aria-hidden="true"
            className="absolute inset-[15%] rounded-full border border-dashed border-white/10 pointer-events-none"
          />
          <span
            aria-hidden="true"
            className="absolute inset-[30%] rounded-full border border-white/5 pointer-events-none"
          />

          {/* Central Pulsing Plasma Core */}
          <div className="celestial-core-glow w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-400/20 via-purple-500/25 to-pink-500/20 blur-md pointer-events-none" />
        </div>

        {/* Twinkling Cosmic Sparkles */}
        {SPARKS.map((spark, idx) => (
          <div
            key={idx}
            className="absolute pointer-events-none animate-pulse"
            style={{
              left: spark.x,
              top: spark.y,
              width: spark.s,
              height: spark.s,
              color: spark.c,
              animationDuration: `${2.2 + idx * 0.4}s`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_6px_currentColor]">
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
