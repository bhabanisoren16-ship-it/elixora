import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundController } from '../utils/audio';

export default function Background() {
  const canvasRef = useRef(null);
  const [isBeating, setIsBeating] = useState(false);
  const sparksRef = useRef([]);
  const burstBeamsRef = useRef([]);
  const ribbonParticlesRef = useRef([]);
  const desktopLightningRef = useRef([]);
  const animFrameRef = useRef(null);

  // Cubic Bézier calculation helper for plasma ribbon paths
  const getBezierPoint = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
    };
  };

  // High-Energy Full Desktop Fractal Lightning Generator
  const generateFullDesktopLightningSegments = (x1, y1, x2, y2, displace = 65, depth = 6) => {
    const segments = [];
    const recurse = (xa, ya, xb, yb, disp, d) => {
      if (d <= 0 || disp < 3.5) {
        segments.push({ x1: xa, y1: ya, x2: xb, y2: yb });
        return;
      }
      const mx = (xa + xb) / 2;
      const my = (ya + yb) / 2;
      const dx = xb - xa;
      const dy = yb - ya;
      const len = Math.hypot(dx, dy);
      const nx = -dy / (len || 1);
      const ny = dx / (len || 1);

      const offset = (Math.random() - 0.5) * disp * 2;
      const splitX = mx + nx * offset;
      const splitY = my + ny * offset;

      recurse(xa, ya, splitX, splitY, disp * 0.55, d - 1);
      recurse(splitX, splitY, xb, yb, disp * 0.55, d - 1);

      // Branch out dramatic forks across the full desktop
      if (Math.random() < 0.45 && d > 1) {
        const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.15;
        const branchLen = len * (0.25 + Math.random() * 0.35);
        const bx = splitX + Math.cos(branchAngle) * branchLen;
        const by = splitY + Math.sin(branchAngle) * branchLen;
        recurse(splitX, splitY, bx, by, disp * 0.45, d - 2);
      }
    };
    recurse(x1, y1, x2, y2, displace, depth);
    return segments;
  };

  // Spawn Full Desktop Light / Lightning Strikes
  const spawnDesktopLightStrike = useCallback((targetX = null, targetY = null, isIntense = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    // Only spawn ambient lightning on desktop and ensure no overlapping strikes
    if (!isDesktop) return;
    if (desktopLightningRef.current.length > 0) return;

    let x1, y1, x2, y2;

    if (targetX !== null && targetY !== null) {
      x1 = targetX + (Math.random() - 0.5) * (w * 0.2);
      y1 = 0;
      x2 = targetX + (Math.random() - 0.5) * (w * 0.2);
      y2 = h;
    } else {
      // Occasional single bolt across desktop
      const strikePattern = Math.random();
      if (strikePattern < 0.6) {
        x1 = w * (0.15 + Math.random() * 0.7);
        y1 = 0;
        x2 = x1 + (Math.random() - 0.5) * (w * 0.35);
        y2 = h;
      } else {
        const fromLeft = Math.random() > 0.5;
        x1 = fromLeft ? 0 : w;
        y1 = Math.random() * h * 0.3;
        x2 = fromLeft ? w * (0.6 + Math.random() * 0.35) : w * (0.05 + Math.random() * 0.35);
        y2 = h * (0.65 + Math.random() * 0.35);
      }
    }

    const isAmber = Math.random() > 0.4;
    const mainColor = isAmber ? '#ffb703' : '#00f2fe';
    const glowColor = isAmber ? '#ff7700' : '#0284c7';

    const segments = generateFullDesktopLightningSegments(
      x1,
      y1,
      x2,
      y2,
      60,
      5
    );

    desktopLightningRef.current.push({
      segments,
      alpha: 1.0,
      fadeRate: 0.055,
      mainColor,
      glowColor,
      coreColor: '#ffffff',
      glowWidth: 5.5,
      coreWidth: 1.8,
      isAmber,
    });

    // Subtle spark dust at contact point
    const sparkX = targetX !== null ? targetX : x2;
    const sparkY = targetY !== null ? targetY : (y2 > h * 0.9 ? h * 0.85 : y2);
    for (let i = 0; i < (isIntense ? 14 : 8); i++) {
      const spAngle = Math.random() * Math.PI * 2;
      const spSpeed = 1.5 + Math.random() * 5.0;
      sparksRef.current.push({
        x: sparkX,
        y: sparkY,
        vx: Math.cos(spAngle) * spSpeed,
        vy: Math.sin(spAngle) * spSpeed - 1.0,
        size: 1.4 + Math.random() * 2.0,
        color: Math.random() > 0.4 ? '#ffffff' : mainColor,
        alpha: 1.0,
        fadeRate: 0.025 + Math.random() * 0.02,
      });
    }
  }, []);

  // Interactive Solar Beat Drop: Spawns solar flare beams & golden embers
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
    setTimeout(() => setIsBeating(false), 500);

    // 1. Solar Flare Radiant Beams
    for (let b = 0; b < 8; b++) {
      const angle = (b / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      burstBeamsRef.current.push({
        ox: x,
        oy: y,
        angle,
        length: Math.max(w, h) * 1.1,
        color: b % 2 === 0 ? '#ffb703' : '#ff7700',
        alpha: 0.95,
        fadeRate: 0.03,
        width: 16 + Math.random() * 18,
      });
    }

    // 2. Golden Stardust & Solar Ember Explosion
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 6;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 1.6 + Math.random() * 3.0,
        color: Math.random() > 0.3 ? (Math.random() > 0.5 ? '#ffb703' : '#ff7700') : '#38bdf8',
        alpha: 1.0,
        fadeRate: 0.018 + Math.random() * 0.015,
      });
    }
  }, []);

  // Occasional Desktop Ambient Light Strike (calm initial opening, 10-18s intervals)
  useEffect(() => {
    let timerId;
    let isMounted = true;

    const scheduleNext = (initial = false) => {
      // 8-12 seconds on first opening, then 10-18 seconds thereafter
      const delay = initial ? (8000 + Math.random() * 4000) : (10000 + Math.random() * 8000);
      timerId = setTimeout(() => {
        if (!isMounted) return;
        if (window.innerWidth >= 768) {
          spawnDesktopLightStrike();
        }
        scheduleNext(false);
      }, delay);
    };

    scheduleNext(true);
    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [spawnDesktopLightStrike]);

  // Click anywhere on page to trigger subtle solar burst
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
      // Synchronized solar flare burst & turntable vinyl sound
      triggerConcertBeat(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [triggerConcertBeat]);

  // Main 60fps Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // On mobile, ignore height-only resizes caused by address-bar collapse during scrolling
      if (canvas.width !== w || Math.abs(canvas.height - h) > 120) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Initial plasma ribbon particles for desktop view
    ribbonParticlesRef.current = [];
    for (let i = 0; i < 30; i++) {
      ribbonParticlesRef.current.push({
        ribbonIdx: Math.floor(Math.random() * 4),
        t: Math.random(),
        speed: 0.0018 + Math.random() * 0.0035,
        size: 2.0 + Math.random() * 3.5,
        color: Math.random() > 0.5 ? '#ffea00' : '#ff7700',
        tailLength: 0.06 + Math.random() * 0.08,
      });
    }

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const isDesktop = w >= 768;

      // =========================================================================
      // 1. DESKTOP: FLOWING PLASMA ENERGY ALONG COSMIC RIBBONS
      // =========================================================================
      if (isDesktop) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // 4 Parametric Bézier paths calibrated to match the ribbons in background-desktop.jpg
        const ribbonCurves = [
          // 0: Left Swoop Ribbon
          {
            p0: { x: w * 0.32, y: 0 },
            p1: { x: w * 0.14, y: h * 0.28 },
            p2: { x: w * 0.02, y: h * 0.54 },
            p3: { x: w * 0.22, y: h * 0.72 },
          },
          // 1: Right Wing Ribbon
          {
            p0: { x: w * 0.58, y: h * 0.32 },
            p1: { x: w * 0.76, y: h * 0.14 },
            p2: { x: w * 0.98, y: h * 0.44 },
            p3: { x: w * 0.78, y: h * 0.78 },
          },
          // 2: Bottom Chest Loop Ribbon
          {
            p0: { x: w * 0.45, y: h * 0.68 },
            p1: { x: w * 0.47, y: h * 0.96 },
            p2: { x: w * 0.68, y: h * 0.95 },
            p3: { x: w * 0.72, y: h * 0.68 },
          },
          // 3: Upper Left Flame Loop
          {
            p0: { x: w * 0.42, y: h * 0.30 },
            p1: { x: w * 0.33, y: h * 0.08 },
            p2: { x: w * 0.25, y: h * 0.30 },
            p3: { x: w * 0.28, y: h * 0.55 },
          },
        ];

        // Animate and draw flowing plasma packets
        ribbonParticlesRef.current.forEach((pt) => {
          pt.t += pt.speed;
          if (pt.t > 1.0) {
            pt.t = 0;
            pt.ribbonIdx = Math.floor(Math.random() * ribbonCurves.length);
          }

          const curve = ribbonCurves[pt.ribbonIdx];
          const head = getBezierPoint(curve.p0, curve.p1, curve.p2, curve.p3, pt.t);
          const tailT = Math.max(0, pt.t - pt.tailLength);
          const tail = getBezierPoint(curve.p0, curve.p1, curve.p2, curve.p3, tailT);

          // Glowing plasma trail
          const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
          grad.addColorStop(0, 'rgba(255, 120, 0, 0)');
          grad.addColorStop(0.7, 'rgba(255, 180, 20, 0.6)');
          grad.addColorStop(1, 'rgba(255, 250, 180, 0.95)');

          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.lineTo(head.x, head.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = pt.size;
          ctx.lineCap = 'round';
          ctx.shadowColor = '#ffb703';
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Bright leading photon head
          ctx.beginPath();
          ctx.arc(head.x, head.y, pt.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffea00';
          ctx.shadowBlur = 12;
          ctx.fill();
        });

        ctx.restore();
      }

      // =========================================================================
      // 2. LIGHT STRIKING IN FULL DESKTOP (FULL-SCREEN FRACTAL LIGHTNING & ILLUMINATION)
      // =========================================================================
      if (desktopLightningRef.current.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        desktopLightningRef.current = desktopLightningRef.current.filter((strike) => {
          strike.alpha -= strike.fadeRate;
          if (strike.alpha <= 0) return false;

          ctx.globalAlpha = Math.max(0, strike.alpha);

          // Pass 1: Wide full-desktop atmospheric neon aura
          ctx.beginPath();
          for (let s = 0; s < strike.segments.length; s++) {
            const seg = strike.segments[s];
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
          ctx.strokeStyle = strike.glowColor;
          ctx.lineWidth = strike.glowWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = strike.mainColor;
          ctx.shadowBlur = 26;
          ctx.stroke();

          // Pass 2: Vibrant full-desktop lightning body
          ctx.beginPath();
          for (let s = 0; s < strike.segments.length; s++) {
            const seg = strike.segments[s];
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
          ctx.strokeStyle = strike.mainColor;
          ctx.lineWidth = strike.glowWidth * 0.55;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = strike.mainColor;
          ctx.shadowBlur = 14;
          ctx.stroke();

          // Pass 3: Searing white core
          ctx.beginPath();
          for (let s = 0; s < strike.segments.length; s++) {
            const seg = strike.segments[s];
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
          ctx.strokeStyle = strike.coreColor;
          ctx.lineWidth = strike.coreWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.stroke();

          return true;
        });

        ctx.restore();
      }

      // =========================================================================
      // 3. CLICK-TRIGGERED SOLAR FLARE BURST BEAMS
      // =========================================================================
      if (burstBeamsRef.current.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        burstBeamsRef.current = burstBeamsRef.current.filter((b) => {
          b.alpha -= b.fadeRate;
          if (b.alpha <= 0) return false;

          const tx = b.ox + Math.cos(b.angle) * b.length;
          const ty = b.oy + Math.sin(b.angle) * b.length;
          const perpX = -Math.sin(b.angle) * b.width * b.alpha;
          const perpY = Math.cos(b.angle) * b.width * b.alpha;

          const grad = ctx.createLinearGradient(b.ox, b.oy, tx, ty);
          const colorPrefix = b.color === '#ffb703' ? 'rgba(255, 183, 3,' : 'rgba(255, 119, 0,';
          grad.addColorStop(0.0, `${colorPrefix} ${b.alpha * 0.85})`);
          grad.addColorStop(0.4, `${colorPrefix} ${b.alpha * 0.35})`);
          grad.addColorStop(1.0, `${colorPrefix} 0)`);

          ctx.beginPath();
          ctx.moveTo(b.ox, b.oy);
          ctx.lineTo(tx - perpX, ty - perpY);
          ctx.lineTo(tx + perpX, ty + perpY);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          return true;
        });

        ctx.restore();
      }

      // =========================================================================
      // 4. DRIFTING COSMIC GOLDEN STARDUST & SOLAR EMBERS
      // =========================================================================
      if (Math.random() < 0.3 && sparksRef.current.length < 50) {
        const sx = Math.random() * w;
        const sy = Math.random() * h;

        sparksRef.current.push({
          x: sx,
          y: sy,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.4 + Math.random() * 1.4),
          size: 1.2 + Math.random() * 2.4,
          color: Math.random() > 0.25 ? (Math.random() > 0.5 ? '#ffb703' : '#ff7700') : '#38bdf8',
          alpha: 0.85,
          fadeRate: 0.005 + Math.random() * 0.007,
        });
      }

      ctx.save();
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

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

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
        {/* Desktop Screen (md and wider): Precision Focal Framing on Cosmic Halo & Chrome Figure */}
        <img
          src="/background-desktop.jpg"
          alt="ELIXORA 2.0 Festival Background"
          className="hidden md:block w-full h-full object-cover object-[center_32%] filter brightness-[1.04] contrast-[1.06] saturate-[1.10]"
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

      {/* 2. Fullscreen Canvas: Full Desktop Light Striking, Plasma Ribbons & Golden Stardust */}
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
