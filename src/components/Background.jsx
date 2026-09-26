import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundController } from '../utils/audio';

export default function Background() {
  const canvasRef = useRef(null);
  const [isBeating, setIsBeating] = useState(false);
  const [isStriking, setIsStriking] = useState(false);
  const soundwavesRef = useRef([]);
  const sparksRef = useRef([]);
  const burstBeamsRef = useRef([]);
  const ribbonParticlesRef = useRef([]);
  const lightningStrikesRef = useRef([]);
  const animFrameRef = useRef(null);
  const beatTimerRef = useRef(null);

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

  // Fractal Branching Generator for Electric Lightning Strikes
  const generateLightningSegments = (x1, y1, x2, y2, displace = 55, depth = 5) => {
    const segments = [];
    const recurse = (xa, ya, xb, yb, disp, d) => {
      if (d <= 0 || disp < 2.5) {
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

      // Branch out child forked lightning bolts
      if (Math.random() < 0.45 && d > 1) {
        const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.1;
        const branchLen = len * (0.22 + Math.random() * 0.38);
        const bx = splitX + Math.cos(branchAngle) * branchLen;
        const by = splitY + Math.sin(branchAngle) * branchLen;
        recurse(splitX, splitY, bx, by, disp * 0.4, d - 2);
      }
    };
    recurse(x1, y1, x2, y2, displace, depth);
    return segments;
  };

  // High-Voltage Striking Lightning Effect (Fractal Bolts + Sky Flash + Electric Thunder)
  const spawnLightningStrike = useCallback((targetX = null, targetY = null, isIntense = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const isDesktop = w >= 768;

    // Default strike target is the figure's glowing halo disk
    const haloX = w * 0.5;
    const haloY = isDesktop ? h * 0.32 : h * 0.45;

    const endX = targetX !== null ? targetX : haloX + (Math.random() - 0.5) * 80;
    const endY = targetY !== null ? targetY : haloY;

    // Bolt originates from the cosmic sky edge
    const startX = endX + (Math.random() - 0.5) * (w * 0.4);
    const startY = 0;

    // Palette: Celestial Golden Amber (halo match) or Electric Cyan (liquid metal match)
    const isAmber = Math.random() > 0.35;
    const mainColor = isAmber ? '#ffb703' : '#00f2fe';
    const glowColor = isAmber ? '#ff7700' : '#38bdf8';

    const segments = generateLightningSegments(
      startX,
      startY,
      endX,
      endY,
      isDesktop ? 65 : 45,
      isDesktop ? 6 : 5
    );

    lightningStrikesRef.current.push({
      segments,
      alpha: 1.0,
      fadeRate: isIntense ? 0.038 : 0.048,
      mainColor,
      glowColor,
      coreColor: '#ffffff',
      glowWidth: isIntense ? 6.5 : 4.5,
      coreWidth: isIntense ? 2.4 : 1.7,
    });

    // Secondary sub-branch strike for multi-stroke atmospheric realism
    if (isDesktop && Math.random() > 0.35) {
      const s2X = startX + (Math.random() - 0.5) * 160;
      const segs2 = generateLightningSegments(
        s2X,
        0,
        endX + (Math.random() - 0.5) * 120,
        endY + (Math.random() - 0.5) * 60,
        45,
        4
      );
      lightningStrikesRef.current.push({
        segments: segs2,
        alpha: 0.85,
        fadeRate: 0.06,
        mainColor: glowColor,
        glowColor: mainColor,
        coreColor: '#ffffff',
        glowWidth: 3.5,
        coreWidth: 1.2,
      });
    }

    // Explosive electric spark shower at strike impact point
    for (let i = 0; i < (isIntense ? 26 : 16); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.0 + Math.random() * 8.0;
      sparksRef.current.push({
        x: endX,
        y: endY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 1.8 + Math.random() * 3.2,
        color: Math.random() > 0.35 ? '#ffffff' : mainColor,
        alpha: 1.0,
        fadeRate: 0.018 + Math.random() * 0.02,
      });
    }

    // Realistic double-flicker atmospheric sky illumination
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 85);
    setTimeout(() => {
      setIsStriking(true);
      setTimeout(() => setIsStriking(false), 65);
    }, 125);

    // Audio thunder effect
    soundController.playLightningThunder();
  }, []);

  // Periodic solar beat pulse (radiates elliptical golden shockwaves from the halo)
  const spawnBeatWave = useCallback((originX, originY, color) => {
    soundwavesRef.current.push({
      x: originX,
      y: originY,
      radius: 12,
      maxRadius: 420,
      speed: 3.0,
      color: color || (Math.random() > 0.4 ? '#ffb703' : (Math.random() > 0.5 ? '#ff7700' : '#fbbf24')),
      alpha: 0.85,
      lineWidth: 2.2,
    });
  }, []);

  // Interactive Solar Beat Drop: Spawns solar flare beams, halo shockwaves & golden embers
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

    // 1. Triple Expanding Elliptical Golden Shockwaves
    for (let r = 0; r < 3; r++) {
      soundwavesRef.current.push({
        x,
        y,
        radius: 10 + r * 22,
        maxRadius: 480 + r * 100,
        speed: 5.2 + r * 2.0,
        color: r % 2 === 0 ? '#ffb703' : '#ff7700',
        alpha: 1.0,
        lineWidth: 2.6,
      });
    }

    // 2. Solar Flare Radiant Beams from halo center
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

    // 3. Golden Stardust & Solar Ember Explosion
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 7;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 1.8 + Math.random() * 3.5,
        color: Math.random() > 0.3 ? (Math.random() > 0.5 ? '#ffb703' : '#ff7700') : '#38bdf8',
        alpha: 1.0,
        fadeRate: 0.015 + Math.random() * 0.015,
      });
    }
  }, []);

  // Periodic ambient lightning strikes every 3.8s to 6.2s
  useEffect(() => {
    let timerId;
    const scheduleNextStrike = () => {
      const delay = 3600 + Math.random() * 2600;
      timerId = setTimeout(() => {
        if (canvasRef.current) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          const isDesktop = w >= 768;

          if (Math.random() < 0.72) {
            // Strike directly onto the glowing halo
            spawnLightningStrike(w * 0.5, isDesktop ? h * 0.32 : h * 0.45, false);
          } else {
            // Strike along the cosmic ribbon flanks
            const sideX = Math.random() > 0.5
              ? w * (0.12 + Math.random() * 0.22)
              : w * (0.66 + Math.random() * 0.22);
            const sideY = h * (0.2 + Math.random() * 0.5);
            spawnLightningStrike(sideX, sideY, false);
          }
        }
        scheduleNextStrike();
      }, delay);
    };

    scheduleNextStrike();
    return () => clearTimeout(timerId);
  }, [spawnLightningStrike]);

  // Click anywhere on page to trigger both a dramatic lightning strike and concert beat drop
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
      // Instant lightning strike to click location
      spawnLightningStrike(e.clientX, e.clientY, true);
      // Synchronized beat drop ripples
      triggerConcertBeat(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [spawnLightningStrike, triggerConcertBeat]);

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

    // Automatic rhythm pulse every 800ms
    const startBeatTimer = () => {
      beatTimerRef.current = setInterval(() => {
        if (canvasRef.current) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          const isDesktop = w >= 768;
          // Pulse originating from the figure's luminous head halo
          spawnBeatWave(w * 0.5, isDesktop ? h * 0.32 : h * 0.45);
        }
      }, 800);
    };
    startBeatTimer();

    let startTime = performance.now();

    const animate = (timestamp) => {
      const time = (timestamp - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const isDesktop = w >= 768;
      const haloX = w * 0.5;
      const haloY = isDesktop ? h * 0.32 : h * 0.45;

      // =========================================================================
      // 1. DESKTOP: SOLAR CORONA & BREATHING HALO RING GLOW
      // =========================================================================
      if (isDesktop) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const baseHaloRadius = Math.min(w, h) * (0.13 + Math.sin(time * 2.2) * 0.012);

        // A. Multi-layer Radial Solar Corona Aura
        const coronaGrad = ctx.createRadialGradient(
          haloX,
          haloY,
          5,
          haloX,
          haloY,
          baseHaloRadius * 2.6
        );
        const coronaAlpha = 0.28 + Math.sin(time * 2.8) * 0.08;
        coronaGrad.addColorStop(0.0, `rgba(255, 240, 200, ${coronaAlpha * 1.2})`);
        coronaGrad.addColorStop(0.2, `rgba(255, 170, 20, ${coronaAlpha * 0.85})`);
        coronaGrad.addColorStop(0.55, `rgba(255, 80, 0, ${coronaAlpha * 0.4})`);
        coronaGrad.addColorStop(1.0, 'rgba(255, 60, 0, 0)');

        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        // Slightly elliptical horizontal aura matching the perspective of the head ring
        ctx.ellipse(haloX, haloY, baseHaloRadius * 2.6, baseHaloRadius * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // B. Pulsing Core Disc Edge Ring
        ctx.beginPath();
        ctx.ellipse(haloX, haloY, baseHaloRadius * 1.15, baseHaloRadius * 0.44, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 230, 140, ${0.4 + Math.sin(time * 3.5) * 0.2})`;
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#ffea00';
        ctx.shadowBlur = 20;
        ctx.stroke();

        ctx.restore();
      }

      // =========================================================================
      // 2. DESKTOP: FLOWING PLASMA ENERGY ALONG COSMIC RIBBONS
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
      // 3. PERSPECTIVE-MATCHED ELLIPTICAL HALO RESONANCE SHOCKWAVES
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      soundwavesRef.current = soundwavesRef.current.filter((wave) => {
        wave.radius += wave.speed;
        wave.alpha -= 0.007;

        if (wave.alpha > 0 && wave.radius < wave.maxRadius) {
          ctx.beginPath();
          // Elliptical perspective matching the angle of the halo disc (0.38 aspect on desktop)
          const yAspect = isDesktop ? 0.38 : 0.65;
          ctx.ellipse(wave.x, wave.y, wave.radius, wave.radius * yAspect, 0, 0, Math.PI * 2);
          ctx.strokeStyle = wave.color;
          ctx.lineWidth = wave.lineWidth;
          ctx.globalAlpha = Math.max(0, wave.alpha);
          ctx.shadowColor = wave.color;
          ctx.shadowBlur = 14;
          ctx.stroke();
          return true;
        }
        return false;
      });
      ctx.restore();

      // =========================================================================
      // 4. STRIKING FRACTAL LIGHTNING BOLTS (DUAL-PASS HIGH-VOLTAGE GLOW)
      // =========================================================================
      if (lightningStrikesRef.current.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        lightningStrikesRef.current = lightningStrikesRef.current.filter((strike) => {
          strike.alpha -= strike.fadeRate;
          if (strike.alpha <= 0) return false;

          ctx.globalAlpha = Math.max(0, strike.alpha);

          // Pass 1: Wide diffused outer glow in vibrant amber or cyan
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
          ctx.shadowBlur = 24;
          ctx.stroke();

          // Pass 2: High-intensity searing white core
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
          ctx.shadowBlur = 10;
          ctx.stroke();

          return true;
        });

        ctx.restore();
      }

      // =========================================================================
      // 5. CLICK-TRIGGERED SOLAR FLARE BURST BEAMS
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
      // 6. DRIFTING COSMIC GOLDEN STARDUST & SOLAR EMBERS
      // =========================================================================
      if (Math.random() < 0.3 && sparksRef.current.length < 50) {
        const nearHalo = isDesktop && Math.random() < 0.6;
        const sx = nearHalo ? haloX + (Math.random() - 0.5) * w * 0.45 : Math.random() * w;
        const sy = nearHalo ? haloY + (Math.random() - 0.5) * h * 0.35 : Math.random() * h;

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
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spawnBeatWave]);

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

        {/* Striking Atmospheric Lightning Flash Overlay (Double-Flicker Sky Illumination) */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-100 mix-blend-screen ${
            isStriking
              ? 'opacity-100 bg-gradient-to-b from-amber-300/30 via-white/15 to-transparent'
              : 'opacity-0'
          }`}
        />
      </div>

      {/* 2. Fullscreen Cosmic Solar Corona, Striking Lightning & Golden Stardust Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
