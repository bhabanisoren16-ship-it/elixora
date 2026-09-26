import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundController } from '../utils/audio';

// Helper: Generates a single, lightweight, clean lightning bolt targeting upper sky quadrants
function createCleanBolt(w, h, isDesktop) {
  try {
    const segments = [];
    const strikeSide = Math.random() > 0.5 ? 'left' : 'right';

    let startX, startY, endX, endY;
    if (isDesktop) {
      // Desktop: Keep lightning in left/right sky to frame the central face & countdown cleanly
      if (strikeSide === 'left') {
        startX = w * (0.08 + Math.random() * 0.16);
        startY = 0;
        endX = w * (0.22 + Math.random() * 0.14);
        endY = h * (0.30 + Math.random() * 0.22);
      } else {
        startX = w * (0.76 + Math.random() * 0.16);
        startY = 0;
        endX = w * (0.64 + Math.random() * 0.14);
        endY = h * (0.30 + Math.random() * 0.22);
      }
    } else {
      // Mobile: Keep high in the atmospheric sky above the hero text
      startX = w * (0.2 + Math.random() * 0.6);
      startY = 0;
      endX = startX + (Math.random() - 0.5) * w * 0.3;
      endY = h * (0.16 + Math.random() * 0.16);
    }

    // Recursive midpoint displacement - max depth 3 (yielding 8 to 16 clean segments)
    function subdivide(x1, y1, x2, y2, depth, maxDepth, spread) {
      if (depth >= maxDepth || segments.length >= 18) {
        segments.push({ x1, y1, x2, y2 });
        return;
      }
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len < 10) {
        segments.push({ x1, y1, x2, y2 });
        return;
      }
      // Perpendicular normal displacement
      const nx = -dy / len;
      const ny = dx / len;
      const offset = (Math.random() - 0.5) * spread;
      const displacedX = midX + nx * offset;
      const displacedY = midY + ny * offset;

      subdivide(x1, y1, displacedX, displacedY, depth + 1, maxDepth, spread * 0.55);
      subdivide(displacedX, displacedY, x2, y2, depth + 1, maxDepth, spread * 0.55);

      // Single small fork (max 1 per bolt)
      if (depth === 1 && Math.random() < 0.35 && segments.length < 14) {
        const forkAngle = (Math.random() - 0.5) * 0.7;
        const forkLen = len * 0.35;
        const forkEndX = displacedX + (dx * Math.cos(forkAngle) - dy * Math.sin(forkAngle)) * (forkLen / len);
        const forkEndY = displacedY + (dx * Math.sin(forkAngle) + dy * Math.cos(forkAngle)) * (forkLen / len);
        subdivide(displacedX, displacedY, forkEndX, forkEndY, depth + 2, maxDepth, spread * 0.3);
      }
    }

    subdivide(startX, startY, endX, endY, 0, 3, isDesktop ? 60 : 35);

    const isAmber = Math.random() > 0.65;
    return {
      segments: segments.slice(0, 20),
      alpha: 1.0,
      fadeRate: 0.055, // ~18 frames (300ms total lifetime)
      glowColor: isAmber ? '#ffb703' : '#38bdf8',
      isAmber,
      createdAt: Date.now(),
    };
  } catch (err) {
    console.error("Bolt generation error:", err);
    return null;
  }
}

export default function Background() {
  const canvasRef = useRef(null);
  const [isBeating, setIsBeating] = useState(false);
  const sparksRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const activeBoltRef = useRef(null);
  const nextAutoStrikeTimeRef = useRef(Date.now() + 5000 + Math.random() * 3000);
  const lastStrikeTimeRef = useRef(Date.now());
  const animFrameRef = useRef(null);

  // Safe Lightning Bolt Spawner (guaranteed 1 active bolt max)
  const spawnBolt = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeBoltRef.current !== null) return;
    const w = canvas.width;
    const h = canvas.height;
    const isDesktop = w >= 768;

    const newBolt = createCleanBolt(w, h, isDesktop);
    if (newBolt) {
      activeBoltRef.current = newBolt;
      lastStrikeTimeRef.current = Date.now();
      soundController.playLightningThunder();

      // Hard watchdog timeout: force-clear bolt after 550ms if ever delayed
      setTimeout(() => {
        if (activeBoltRef.current && Date.now() - activeBoltRef.current.createdAt > 500) {
          activeBoltRef.current = null;
        }
      }, 550);
    }
  }, []);

  // Interactive Solar Beat Drop: Spawns golden stardust embers & audio feedback
  const triggerConcertBeat = useCallback((originX = null, originY = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const isDesktop = w >= 768;

    const x = originX !== null ? originX : w * 0.5;
    const y = originY !== null ? originY : (isDesktop ? h * 0.32 : h * 0.5);

    // Audio feedback
    soundController.playVinylScratch();
    setIsBeating(true);
    setTimeout(() => setIsBeating(false), 400);

    // Golden Stardust & Solar Ember Explosion
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 5.5;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 1.5 + Math.random() * 2.8,
        color: Math.random() > 0.3 ? (Math.random() > 0.5 ? '#ffb703' : '#ff7700') : '#38bdf8',
        alpha: 1.0,
        fadeRate: 0.018 + Math.random() * 0.015,
      });
    }

    // Optional subtle strike on click (with 4s cooldown)
    if (Date.now() - lastStrikeTimeRef.current > 4000 && Math.random() < 0.5) {
      spawnBolt();
    }
  }, [spawnBolt]);

  // Click anywhere on page to trigger subtle solar ember burst
  useEffect(() => {
    const handleWindowClick = (e) => {
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('[role="dialog"]')
      ) {
        return;
      }
      triggerConcertBeat(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [triggerConcertBeat]);

  // Main 60fps Canvas Loop (Try-Catch Protected, Never Freezes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Prevent mobile address-bar collapse while scrolling from clearing canvas
      if (canvas.width !== w || Math.abs(canvas.height - h) > 120) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const animate = () => {
      try {
        const w = canvas.width;
        const h = canvas.height;
        const isDesktop = w >= 768;

        ctx.clearRect(0, 0, w, h);

        // 1. Safe Single-Bolt Lightning Render
        const bolt = activeBoltRef.current;
        if (bolt && bolt.segments && bolt.segments.length > 0) {
          bolt.alpha -= bolt.fadeRate;

          if (bolt.alpha > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            // Subtle Atmospheric Pulse (only during peak flash alpha > 0.85)
            if (bolt.alpha > 0.85) {
              const flashA = (bolt.alpha - 0.85) * 0.45;
              ctx.fillStyle = bolt.isAmber
                ? `rgba(255, 183, 3, ${flashA})`
                : `rgba(56, 189, 248, ${flashA})`;
              ctx.fillRect(0, 0, w, h);
            }

            ctx.globalAlpha = Math.max(0, Math.min(1, bolt.alpha));

            // Pass 1: Soft Electric Aura
            ctx.beginPath();
            for (let i = 0; i < bolt.segments.length; i++) {
              const s = bolt.segments[i];
              ctx.moveTo(s.x1, s.y1);
              ctx.lineTo(s.x2, s.y2);
            }
            ctx.strokeStyle = bolt.glowColor;
            ctx.lineWidth = isDesktop ? 3.5 : 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = bolt.glowColor;
            ctx.shadowBlur = 12;
            ctx.stroke();

            // Pass 2: Crisp White Core
            ctx.beginPath();
            for (let i = 0; i < bolt.segments.length; i++) {
              const s = bolt.segments[i];
              ctx.moveTo(s.x1, s.y1);
              ctx.lineTo(s.x2, s.y2);
            }
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = isDesktop ? 1.5 : 1.0;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 6;
            ctx.stroke();

            ctx.restore();
          } else {
            activeBoltRef.current = null;
          }
        }

        // 2. Ambient Drifting Cosmic Golden Stardust & Solar Embers
        if (Math.random() < 0.35 && sparksRef.current.length < 50) {
          sparksRef.current.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.7,
            vy: -(0.3 + Math.random() * 1.2),
            size: 1.2 + Math.random() * 2.2,
            color: Math.random() > 0.25 ? (Math.random() > 0.5 ? '#ffb703' : '#ff7700') : '#38bdf8',
            alpha: 0.85,
            fadeRate: 0.005 + Math.random() * 0.006,
          });
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        sparksRef.current = sparksRef.current.filter((sp) => {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= sp.fadeRate;

          if (sp.alpha > 0 && sp.y > 0) {
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.shadowColor = sp.color;
            ctx.shadowBlur = 8;
            ctx.globalAlpha = Math.max(0, sp.alpha);
            ctx.fill();
            return true;
          }
          return false;
        });
        ctx.restore();

        // 3. Subtle Cosmic Shooting Star Streaks (Graceful meteor every 7-12s)
        if (Math.random() < 0.006 && shootingStarsRef.current.length < 2) {
          const startX = Math.random() * w * 0.85;
          const startY = Math.random() * h * 0.25;
          const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
          const speed = 11 + Math.random() * 7;
          shootingStarsRef.current.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: 60 + Math.random() * 50,
            alpha: 0.85,
            fadeRate: 0.02,
            color: Math.random() > 0.4 ? '#38bdf8' : '#fde047',
          });
        }

        if (shootingStarsRef.current.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
            star.x += star.vx;
            star.y += star.vy;
            star.alpha -= star.fadeRate;

            if (star.alpha > 0 && star.x < w && star.y < h) {
              const tailX = star.x - star.vx * (star.length / 15);
              const tailY = star.y - star.vy * (star.length / 15);
              const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
              grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
              grad.addColorStop(0.7, star.color);
              grad.addColorStop(1, '#ffffff');

              ctx.beginPath();
              ctx.moveTo(tailX, tailY);
              ctx.lineTo(star.x, star.y);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.5;
              ctx.lineCap = 'round';
              ctx.globalAlpha = Math.max(0, star.alpha);
              ctx.shadowColor = star.color;
              ctx.shadowBlur = 8;
              ctx.stroke();
              return true;
            }
            return false;
          });
          ctx.restore();
        }

        // 4. Periodic Auto Lightning Timer (Strikes every 8-14s)
        const now = Date.now();
        if (!activeBoltRef.current && now > nextAutoStrikeTimeRef.current) {
          spawnBolt();
          nextAutoStrikeTimeRef.current = now + 8000 + Math.random() * 6000;
        }

      } catch (err) {
        console.error("Canvas render error caught cleanly:", err);
        activeBoltRef.current = null;
      } finally {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spawnBolt]);

  return (
    <>
      {/* 1. Desktop & Mobile Background Image */}
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none mobile-fixed-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        aria-hidden="true"
      >
        {/* Desktop Screen (md and wider): Precision Focal Framing on Cosmic Halo & Chrome Figure with Subtle Breathe */}
        <img
          src="/background-desktop.jpg"
          alt="ELIXORA 2.0 Festival Background"
          className="hidden md:block w-full h-full object-cover object-[center_32%] filter brightness-[1.04] contrast-[1.06] saturate-[1.10] animate-subtle-breathe"
        />

        {/* Mobile Screen (< md): Native Portrait Cover - 100% Fixed & Frozen while scrolling */}
        <img
          src="/background-mobile.jpg"
          alt="ELIXORA 2.0 Festival Background"
          className="block md:hidden w-full h-full object-cover object-[center_20%] filter brightness-[1.02] contrast-[1.04]"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
          }}
        />

        {/* Subtle Dark Vignette: Keeps Navbar & Lower Content Clean and Readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/45 via-transparent to-obsidian-950/85 pointer-events-none" />

        {/* Dynamic Solar Fire Pulse on Beat Trigger */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-amber-600/15 via-orange-500/10 to-transparent pointer-events-none transition-opacity duration-300 ${
            isBeating ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* 2. Fullscreen Canvas: Drifting Cosmic Golden Stardust & Embers */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
