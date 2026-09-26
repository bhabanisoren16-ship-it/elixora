import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundController } from '../utils/audio';

export default function Background() {
  const canvasRef = useRef(null);
  const [isBeating, setIsBeating] = useState(false);
  const sparksRef = useRef([]);
  const burstBeamsRef = useRef([]);
  const ribbonParticlesRef = useRef([]);
  const littleLightningRef = useRef([]);
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

  // Delicate generator for subtle "little lightning" micro-arcs
  const generateLittleLightningSegments = (x1, y1, x2, y2, displace = 18, depth = 3) => {
    const segments = [];
    const recurse = (xa, ya, xb, yb, disp, d) => {
      if (d <= 0 || disp < 2) {
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

      recurse(xa, ya, splitX, splitY, disp * 0.5, d - 1);
      recurse(splitX, splitY, xb, yb, disp * 0.5, d - 1);

      // 1 small delicate side fork
      if (Math.random() < 0.35 && d > 1) {
        const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8;
        const branchLen = len * (0.2 + Math.random() * 0.25);
        const bx = splitX + Math.cos(branchAngle) * branchLen;
        const by = splitY + Math.sin(branchAngle) * branchLen;
        recurse(splitX, splitY, bx, by, disp * 0.35, d - 2);
      }
    };
    recurse(x1, y1, x2, y2, displace, depth);
    return segments;
  };

  // Spawn subtle, delicate little lightning micro-arcs
  const spawnLittleLightning = useCallback((targetX = null, targetY = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    let x1, y1, x2, y2;
    if (targetX !== null && targetY !== null) {
      // Subtle click spark
      const angle = Math.random() * Math.PI * 2;
      const dist = 35 + Math.random() * 55;
      x1 = targetX + Math.cos(angle) * dist;
      y1 = targetY + Math.sin(angle) * dist;
      x2 = targetX;
      y2 = targetY;
    } else {
      // Ambient micro-arc in cosmic space
      const cx = w * (0.18 + Math.random() * 0.64);
      const cy = h * (0.15 + Math.random() * 0.5);
      const arcAngle = (Math.random() - 0.5) * Math.PI + Math.PI / 2;
      const arcLen = 60 + Math.random() * 110;
      x1 = cx;
      y1 = cy;
      x2 = cx + Math.cos(arcAngle) * arcLen;
      y2 = cy + Math.sin(arcAngle) * arcLen;
    }

    const isAmber = Math.random() > 0.4;
    const color = isAmber ? '#fbbf24' : '#38bdf8';

    const segments = generateLittleLightningSegments(x1, y1, x2, y2, 16, 4);

    littleLightningRef.current.push({
      segments,
      alpha: 0.75,
      fadeRate: 0.045,
      color,
      coreColor: '#ffffff',
      glowWidth: 2.4,
      coreWidth: 1.0,
    });

    // Subtle spark dust at tip
    for (let i = 0; i < 4; i++) {
      const spAngle = Math.random() * Math.PI * 2;
      const spSpeed = 1.0 + Math.random() * 2.5;
      sparksRef.current.push({
        x: x2,
        y: y2,
        vx: Math.cos(spAngle) * spSpeed,
        vy: Math.sin(spAngle) * spSpeed - 0.5,
        size: 1.0 + Math.random() * 1.5,
        color,
        alpha: 0.8,
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

  // Periodic subtle little lightning every 2.0s to 3.8s
  useEffect(() => {
    let timerId;
    const scheduleNext = () => {
      const delay = 1800 + Math.random() * 2000;
      timerId = setTimeout(() => {
        spawnLittleLightning();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timerId);
  }, [spawnLittleLightning]);

  // Click anywhere on page to trigger subtle micro-spark and solar burst
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
      // Delicate little electric spark to click location
      spawnLittleLightning(e.clientX, e.clientY);
      // Synchronized solar flare burst
      triggerConcertBeat(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [spawnLittleLightning, triggerConcertBeat]);

  // Main 60fps Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

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
      // 2. LITTLE LIGHTNING (SUBTLE MICRO-ARCS)
      // =========================================================================
      if (littleLightningRef.current.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        littleLightningRef.current = littleLightningRef.current.filter((arc) => {
          arc.alpha -= arc.fadeRate;
          if (arc.alpha <= 0) return false;

          ctx.globalAlpha = Math.max(0, arc.alpha);

          // Subtle soft glow
          ctx.beginPath();
          for (let s = 0; s < arc.segments.length; s++) {
            const seg = arc.segments[s];
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
          ctx.strokeStyle = arc.color;
          ctx.lineWidth = arc.glowWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Fine white core
          ctx.beginPath();
          for (let s = 0; s < arc.segments.length; s++) {
            const seg = arc.segments[s];
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
          ctx.strokeStyle = arc.coreColor;
          ctx.lineWidth = arc.coreWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 5;
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
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Desktop Screen (md and wider): Precision Focal Framing on Cosmic Halo & Chrome Figure */}
        <img
          src="/background-desktop.jpg"
          alt="ELIXORA 2.0 Festival Background"
          className="hidden md:block w-full h-full object-cover object-[center_32%] filter brightness-[1.04] contrast-[1.06] saturate-[1.10]"
        />

        {/* Mobile Screen (< md): Native Portrait Cover */}
        <img
          src="/background-mobile.jpg"
          alt="ELIXORA 2.0 Festival Background"
          className="block md:hidden w-full h-full object-cover object-[center_20%] filter brightness-[1.02] contrast-[1.04]"
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

      {/* 2. Fullscreen Canvas: Flowing Cosmic Ribbons, Little Lightning & Golden Stardust */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
