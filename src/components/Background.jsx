import React, { useEffect, useRef, useCallback } from 'react';
import { soundController } from '../utils/audio';
import desktopBg from '../assets/desktop-background.jpg'; // Widescreen 16:9 desktop atmosphere
import mobileBg from '../assets/party-background.jpg';

// High-Voltage Fractal Branching Generator for Concert Strobe & Lightning Lasers
function generateStrikingBranches(x1, y1, x2, y2, displace = 50, depth = 4) {
  const segments = [];
  function recurse(xa, ya, xb, yb, disp, d) {
    if (d <= 0 || disp < 2.5 || segments.length >= 24) {
      segments.push({ x1: xa, y1: ya, x2: xb, y2: yb });
      return;
    }
    const mx = (xa + xb) / 2;
    const my = (ya + yb) / 2;
    const dx = xb - xa;
    const dy = yb - ya;
    const len = Math.hypot(dx, dy);
    if (len < 8) {
      segments.push({ x1: xa, y1: ya, x2: xb, y2: yb });
      return;
    }
    const nx = -dy / len;
    const ny = dx / len;
    const offset = (Math.random() - 0.5) * disp * 1.8;
    const splitX = mx + nx * offset;
    const splitY = my + ny * offset;

    recurse(xa, ya, splitX, splitY, disp * 0.55, d - 1);
    recurse(splitX, splitY, xb, yb, disp * 0.55, d - 1);

    if (Math.random() < 0.38 && d > 1 && segments.length < 20) {
      const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.0;
      const branchLen = len * (0.24 + Math.random() * 0.36);
      const bx = splitX + Math.cos(branchAngle) * branchLen;
      const by = splitY + Math.sin(branchAngle) * branchLen;
      recurse(splitX, splitY, bx, by, disp * 0.45, d - 2);
    }
  }
  recurse(x1, y1, x2, y2, displace, depth);
  return segments;
}

export default function Background() {
  const canvasRef = useRef(null);

  const sparksRef = useRef([]);
  const activeBoltRef = useRef(null);
  const nextAutoStrikeTimeRef = useRef(Date.now() + 3500);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isVisibleRef = useRef(true);
  const animFrameRef = useRef(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Pause canvas while user is actively scrolling to free 100% of GPU for 120fps scrolling
  useEffect(() => {
    const onScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Concert Stage Laser & Lightning Strobe Strike (with Electric Palettes)
  const spawnStrikingEffect = useCallback((targetX = null, targetY = null, isIntense = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const isDesktop = w >= 768;

    const sourceX = targetX !== null ? targetX : w * (0.2 + Math.random() * 0.6);
    const startX = sourceX + (Math.random() - 0.5) * (w * 0.25);
    const startY = 0; // Starts from top concert stage truss

    const endX = targetX !== null ? targetX : w * (0.25 + Math.random() * 0.5);
    const endY = targetY !== null ? targetY : h * (0.55 + Math.random() * 0.35); // Reaches crowd

    const strikePalettes = [
      { main: '#00e5ff', glow: '#0284c7', core: '#ffffff' }, // Electric Cyan
      { main: '#38bdf8', glow: '#0369a1', core: '#e0f2fe' }, // Neon Blue
      { main: '#ff9e00', glow: '#ea580c', core: '#fffbeb' }, // Stage Pyro Amber
      { main: '#c084fc', glow: '#7c3aed', core: '#faf5ff' }, // Electric Violet
    ];

    const palette = strikePalettes[Math.floor(Math.random() * strikePalettes.length)];
    const mainColor = palette.main;
    const glowColor = palette.glow;
    const coreColor = palette.core;

    const primarySegments = generateStrikingBranches(
      startX,
      startY,
      endX,
      endY,
      isDesktop ? 55 : 35,
      4
    );

    let secondarySegments = [];
    if (isDesktop && Math.random() > 0.4) {
      const s2X = startX + (Math.random() - 0.5) * 120;
      secondarySegments = generateStrikingBranches(
        s2X,
        0,
        endX + (Math.random() - 0.5) * 80,
        endY + (Math.random() - 0.5) * 30,
        35,
        3
      );
    }

    activeBoltRef.current = {
      primary: primarySegments,
      secondary: secondarySegments,
      alpha: 1.0,
      fadeRate: isIntense ? 0.045 : 0.055,
      mainColor,
      glowColor,
      coreColor,
      createdAt: Date.now(),
    };

    soundController.playLightningThunder();

    setTimeout(() => {
      if (activeBoltRef.current && Date.now() - activeBoltRef.current.createdAt > 450) {
        activeBoltRef.current = null;
      }
    }, 480);
  }, []);

  // Click anywhere on page to trigger interactive stage lightning
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
      spawnStrikingEffect(e.clientX, e.clientY, true);
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [spawnStrikingEffect]);

  // Smooth micro-parallax tracking on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mousePosRef.current.targetX = normX;
      mousePosRef.current.targetY = normY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Page visibility API: pause render loop when tab is backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Main 60fps Canvas Loop (Concert Stage Lighting & Beams)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || Math.abs(canvas.height - h) > 120) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let lastFrameTime = performance.now();

    const animate = (currentTime) => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current || isScrollingRef.current) {
        return;
      }

      const delta = currentTime - lastFrameTime;
      // Silky 35-40fps for ambient stage lights saves 50% GPU fill rate
      if (delta < 26) {
        return;
      }
      lastFrameTime = currentTime;

      try {
        const w = canvas.width;
        const h = canvas.height;
        const isDesktop = w >= 768;
        const now = Date.now();

        ctx.clearRect(0, 0, w, h);

        const m = mousePosRef.current;
        m.x += (m.targetX - m.x) * 0.05;
        m.y += (m.targetY - m.y) * 0.05;
        const parallaxX = isDesktop ? m.x * 6.0 : 0;

        // 1. DYNAMIC CONCERT SPOTLIGHT BEAMS (Sweeping down through atmosphere)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const beamConfigs = isDesktop
          ? [
              { originFrac: 0.15, targetFrac: 0.35, speed: 0.0007, width: 140, color: 'rgba(0, 229, 255, 0.32)', phase: 0 },
              { originFrac: 0.30, targetFrac: 0.52, speed: 0.0009, width: 125, color: 'rgba(56, 189, 248, 0.28)', phase: 1.2 },
              { originFrac: 0.70, targetFrac: 0.45, speed: 0.0008, width: 135, color: 'rgba(0, 229, 255, 0.30)', phase: 2.5 },
              { originFrac: 0.85, targetFrac: 0.62, speed: 0.0006, width: 150, color: 'rgba(192, 132, 252, 0.26)', phase: 3.8 },
              { originFrac: 0.50, targetFrac: 0.50, speed: 0.0011, width: 160, color: 'rgba(56, 189, 248, 0.25)', phase: 4.5 },
            ]
          : [
              { originFrac: 0.22, targetFrac: 0.36, speed: 0.0007, width: 70, color: 'rgba(0, 229, 255, 0.26)', phase: 0 },
              { originFrac: 0.78, targetFrac: 0.64, speed: 0.0006, width: 75, color: 'rgba(56, 189, 248, 0.26)', phase: 2.0 },
            ];

        for (let i = 0; i < beamConfigs.length; i++) {
          const b = beamConfigs[i];
          const sweep = Math.sin(now * b.speed + b.phase) * (isDesktop ? 80 : 30);
          const topX = w * b.originFrac + parallaxX * 0.4;
          const topY = 0;
          const bottomX = w * b.targetFrac + sweep + parallaxX;
          const bottomY = h * 0.95;

          const grad = ctx.createLinearGradient(topX, topY, bottomX, bottomY);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
          grad.addColorStop(0.18, b.color);
          grad.addColorStop(0.65, b.color.replace(/0\.\d+\)/, '0.10)'));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.moveTo(topX - 8, topY);
          ctx.lineTo(topX + 8, topY);
          ctx.lineTo(bottomX + b.width, bottomY);
          ctx.lineTo(bottomX - b.width, bottomY);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          // Glowing lens flare spotlight fixture head
          const flareRadius = isDesktop ? 18 : 10;
          const flareGrad = ctx.createRadialGradient(topX, topY, 0, topX, topY, flareRadius);
          flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          flareGrad.addColorStop(0.35, 'rgba(0, 229, 255, 0.85)');
          flareGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
          ctx.beginPath();
          ctx.arc(topX, topY, flareRadius, 0, Math.PI * 2);
          ctx.fillStyle = flareGrad;
          ctx.fill();
        }

        // 1b. CONCERT LASER BEAMS (Crisp, vibrant neon lasers slicing the sky)
        const laserConfigs = isDesktop
          ? [
              { originFrac: 0.28, targetFrac: 0.15, speed: 0.0012, color: '#00e5ff', phase: 0.5 },
              { originFrac: 0.38, targetFrac: 0.68, speed: 0.0009, color: '#c084fc', phase: 2.1 },
              { originFrac: 0.62, targetFrac: 0.32, speed: 0.0011, color: '#38bdf8', phase: 3.4 },
              { originFrac: 0.72, targetFrac: 0.86, speed: 0.0013, color: '#00e5ff', phase: 5.0 },
            ]
          : [
              { originFrac: 0.35, targetFrac: 0.15, speed: 0.0012, color: '#00e5ff', phase: 0.5 },
              { originFrac: 0.65, targetFrac: 0.85, speed: 0.0011, color: '#c084fc', phase: 3.2 },
            ];

        for (let i = 0; i < laserConfigs.length; i++) {
          const l = laserConfigs[i];
          const sweep = Math.sin(now * l.speed + l.phase) * (isDesktop ? 120 : 60);
          const lx1 = w * l.originFrac + parallaxX * 0.4;
          const ly1 = 0;
          const lx2 = w * l.targetFrac + sweep + parallaxX;
          const ly2 = h * 0.95;

          const laserPulse = 0.35 + 0.3 * Math.sin(now * 0.0025 + l.phase);

          // Outer diffused laser glow
          ctx.beginPath();
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.strokeStyle = l.color;
          ctx.lineWidth = isDesktop ? 3.5 : 2.2;
          ctx.globalAlpha = laserPulse * 0.45;
          ctx.stroke();

          // Incandescent laser core
          ctx.beginPath();
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.0;
          ctx.globalAlpha = laserPulse * 0.95;
          ctx.stroke();
        }

        // 2. RHYTHMIC STAGE BASS PULSE (Stage center glow beating in music tempo)
        const bassBeat = Math.pow(Math.max(0, Math.sin(now * 0.0028)), 3); // sharp rhythmic pop
        const stagePulseRadius = isDesktop ? w * 0.28 : w * 0.45;
        const stageCenterX = w * 0.5 + parallaxX * 0.3;
        const stageCenterY = isDesktop ? h * 0.30 : h * 0.24;

        const pulseGrad = ctx.createRadialGradient(
          stageCenterX, stageCenterY, 5,
          stageCenterX, stageCenterY, stagePulseRadius
        );
        pulseGrad.addColorStop(0, `rgba(0, 229, 255, ${0.16 + bassBeat * 0.22})`);
        pulseGrad.addColorStop(0.35, `rgba(168, 85, 247, ${0.09 + bassBeat * 0.14})`);
        pulseGrad.addColorStop(0.7, `rgba(245, 158, 11, ${0.04 + bassBeat * 0.07})`);
        pulseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(stageCenterX, stageCenterY, stagePulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = pulseGrad;
        ctx.fill();

        // 2b. TOP STAGE PYRO & LIGHTING TRUSS WARMTH BREATH
        const pyroBreath = 0.12 + 0.06 * Math.sin(now * 0.0015);
        const topGrad = ctx.createRadialGradient(w * 0.5, 0, 10, w * 0.5, 0, h * 0.45);
        topGrad.addColorStop(0, `rgba(255, 120, 20, ${pyroBreath * 1.2})`);
        topGrad.addColorStop(0.4, `rgba(245, 158, 11, ${pyroBreath * 0.6})`);
        topGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, w, h * 0.5);

        ctx.restore();

        // 3. INTERACTIVE CONCERT LIGHTNING / STROBE BOLTS
        const bolt = activeBoltRef.current;
        if (bolt && bolt.primary && bolt.primary.length > 0) {
          bolt.alpha -= bolt.fadeRate;

          if (bolt.alpha > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            const drawSegments = (segs, strokeColor, lineWidth, alphaMult) => {
              ctx.beginPath();
              for (let i = 0; i < segs.length; i++) {
                const s = segs[i];
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
              }
              ctx.strokeStyle = strokeColor;
              ctx.lineWidth = lineWidth;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.globalAlpha = Math.max(0, Math.min(1, bolt.alpha * alphaMult));
              ctx.stroke();
            };

            // Pass 1: Diffused Outer Aura (Hardware Screen Glow)
            drawSegments(bolt.primary, bolt.glowColor, isDesktop ? 7.0 : 4.5, 0.45);

            // Pass 2: Intense Neon Body
            drawSegments(bolt.primary, bolt.mainColor, isDesktop ? 3.0 : 2.0, 0.85);

            // Pass 3: Incandescent Core Beam
            drawSegments(bolt.primary, bolt.coreColor || '#ffffff', isDesktop ? 1.5 : 1.0, 1.0);

            // Secondary companion strike
            if (bolt.secondary && bolt.secondary.length > 0) {
              drawSegments(bolt.secondary, bolt.glowColor, isDesktop ? 3.5 : 2.5, 0.5);
              drawSegments(bolt.secondary, bolt.coreColor || '#ffffff', isDesktop ? 1.2 : 0.8, 0.9);
            }

            ctx.restore();
          } else {
            activeBoltRef.current = null;
          }
        }

        // 4. ATMOSPHERIC CONCERT SPARKS & LIGHT MOTES (Rising from crowd)
        const maxSparks = isDesktop ? 40 : 22;
        if (Math.random() < 0.35 && sparksRef.current.length < maxSparks) {
          const sparkColors = ['#00e5ff', '#38bdf8', '#fbbf24', '#ffedd5', '#f472b6'];
          sparksRef.current.push({
            x: Math.random() * w,
            y: h * 0.45 + Math.random() * (h * 0.55),
            vx: (Math.random() - 0.5) * 0.7,
            vy: -(0.5 + Math.random() * 1.3),
            size: 1.2 + Math.random() * 2.2,
            color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
            alpha: 0.85,
            fadeRate: 0.006 + Math.random() * 0.007,
          });
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const sparks = sparksRef.current;
        let sparkWriteIdx = 0;
        const sparkCount = sparks.length;

        for (let i = 0; i < sparkCount; i++) {
          const sp = sparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= sp.fadeRate;

          if (sp.alpha > 0 && sp.y > 0) {
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size * 2.0, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.globalAlpha = sp.alpha * 0.35;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = sp.alpha * 0.9;
            ctx.fill();

            sparks[sparkWriteIdx++] = sp;
          }
        }
        sparks.length = sparkWriteIdx;
        ctx.restore();

        // 5. Auto Stage Lightning Scheduler
        if (!activeBoltRef.current && now > nextAutoStrikeTimeRef.current) {
          spawnStrikingEffect();
          nextAutoStrikeTimeRef.current = now + 6000 + Math.random() * 4000;
        }

      } catch (err) {
        console.error("Canvas render error caught cleanly:", err);
        activeBoltRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spawnStrikingEffect]);

  return (
    <>
      {/* 1. Desktop & Mobile Background Image - 100% Locked to Viewport */}
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none mobile-fixed-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100lvh',
          minHeight: '100%',
        }}
        aria-hidden="true"
      >
        {/* Desktop Screen (≥ md): Native 16:9 Widescreen Concert Atmosphere (Perfect Edge-to-Edge Fit) */}
        <img
          src={desktopBg}
          alt="ELIXORA 2.0 Concert Atmosphere"
          decoding="async"
          loading="eager"
          className="hidden md:block w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.05]"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />

        {/* Mobile Screen (< md): Native Portrait Fullscreen Cover with Organic Breathing */}
        <img
          src={mobileBg}
          alt="ELIXORA 2.0 Concert Atmosphere"
          decoding="async"
          loading="eager"
          className="block md:hidden w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04] animate-mobile-breathe"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100lvh',
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />

        {/* Rhythmic Stage Beat Pulse Glow (Concert Lighting Heartbeat) */}
        <div 
          className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] sm:w-[950px] sm:h-[480px] bg-gradient-to-tr from-cyan-500/25 via-purple-600/20 to-sky-400/25 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none animate-stage-pulse" 
          aria-hidden="true"
        />        {/* Sweeping Stage Laser Beams (CSS Accent Layers) */}
        <div 
          className="absolute top-0 left-1/3 w-[2px] h-[85vh] bg-gradient-to-b from-white via-cyan-400 to-transparent blur-[0.5px] pointer-events-none animate-laser-left shadow-[0_0_12px_#00e5ff]"
          aria-hidden="true"
        />
        <div 
          className="absolute top-0 right-1/3 w-[2px] h-[85vh] bg-gradient-to-b from-white via-purple-400 to-transparent blur-[0.5px] pointer-events-none animate-laser-right shadow-[0_0_12px_#c084fc]"
          aria-hidden="true"
        />

        {/* === CONCERT STAGE VOLUMETRIC SPOTLIGHTS (Matching Live Stage Reference) === */}
        {/* 1. Primary Spotlight Cone: Upper-Left Truss -> Center-Right Stage */}
        <div 
          className="absolute -top-4 left-[6%] sm:left-[16%] w-[110px] sm:w-[280px] h-[75vh] sm:h-[95vh] pointer-events-none animate-spotlight-left overflow-hidden sm:overflow-visible"
          style={{ transformOrigin: 'top center' }}
          aria-hidden="true"
        >
          {/* Projector Head Lens Flare Bulb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_24px_8px_rgba(0,229,255,0.95),0_0_50px_16px_rgba(56,189,248,0.7)] animate-spotlight-flare" />
          {/* Volumetric Light Shaft Cone: Mobile Uses Native Smooth Radial Fade (Zero GPU clipping glitch) */}
          <div 
            className="w-full h-full opacity-80 sm:hidden"
            style={{
              background: 'radial-gradient(ellipse 65% 90% at 50% 0%, rgba(255,255,255,0.75) 0%, rgba(0,229,255,0.38) 22%, rgba(56,189,248,0.18) 55%, transparent 85%)',
            }}
          />
          {/* Desktop High-Def Volumetric Polygon */}
          <div 
            className="w-full h-full opacity-90 hidden sm:block"
            style={{
              clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(0,229,255,0.7) 18%, rgba(56,189,248,0.4) 55%, rgba(0,229,255,0.1) 85%, transparent 100%)',
              filter: 'blur(3px)',
            }}
          />
        </div>

        {/* 2. Piercing Right Spotlight Cone: Upper-Right Truss -> Center-Left Stage */}
        <div 
          className="absolute -top-4 right-[6%] sm:right-[14%] w-[100px] sm:w-[260px] h-[72vh] sm:h-[92vh] pointer-events-none animate-spotlight-right overflow-hidden sm:overflow-visible"
          style={{ transformOrigin: 'top center' }}
          aria-hidden="true"
        >
          {/* Projector Head Lens Flare Bulb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white shadow-[0_0_22px_7px_rgba(0,229,255,0.95),0_0_48px_14px_rgba(14,165,233,0.75)] animate-spotlight-flare" />
          {/* Volumetric Light Shaft Cone: Mobile Uses Native Smooth Radial Fade */}
          <div 
            className="w-full h-full opacity-75 sm:hidden"
            style={{
              background: 'radial-gradient(ellipse 65% 90% at 50% 0%, rgba(255,255,255,0.75) 0%, rgba(0,229,255,0.35) 22%, rgba(14,165,233,0.16) 55%, transparent 85%)',
            }}
          />
          {/* Desktop High-Def Volumetric Polygon */}
          <div 
            className="w-full h-full opacity-85 hidden sm:block"
            style={{
              clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(0,229,255,0.65) 20%, rgba(14,165,233,0.38) 60%, rgba(0,229,255,0.08) 88%, transparent 100%)',
              filter: 'blur(3px)',
            }}
          />
        </div>

        {/* 3. Mid-Stage Floating Projector Fixture - Desktop Only (Prevents Mobile Overdraw) */}
        <div 
          className="hidden sm:block absolute top-[22%] sm:top-[26%] left-[24%] sm:left-[34%] w-[110px] sm:w-[220px] h-[75vh] pointer-events-none animate-spotlight-mid"
          style={{ transformOrigin: 'top center' }}
          aria-hidden="true"
        >
          {/* Mid-stage Projector Bulb Flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-[0_0_28px_10px_rgba(0,229,255,0.95),0_0_60px_20px_rgba(56,189,248,0.8)] animate-spotlight-flare" />
          {/* Angled Volumetric Light Cone */}
          <div 
            className="w-full h-full opacity-80"
            style={{
              clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(0,229,255,0.6) 22%, rgba(56,189,248,0.35) 60%, transparent 100%)',
              filter: 'blur(2.5px)',
            }}
          />
        </div>

        {/* 4. Diagonal Crossing Violet/Cyan Spotlight - Desktop Only */}
        <div 
          className="hidden sm:block absolute top-[18%] sm:top-[20%] right-[16%] sm:right-[24%] w-[100px] sm:w-[200px] h-[78vh] pointer-events-none animate-spotlight-left"
          style={{ transformOrigin: 'top center' }}
          aria-hidden="true"
        >
          {/* Projector Bulb Flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-[0_0_28px_10px_rgba(192,132,252,0.9),0_0_58px_18px_rgba(147,51,234,0.7)] animate-spotlight-flare" />
          {/* Violet/Cyan High-angle Light Cone */}
          <div 
            className="w-full h-full opacity-75"
            style={{
              clipPath: 'polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(192,132,252,0.55) 20%, rgba(0,229,255,0.32) 55%, transparent 100%)',
              filter: 'blur(2.5px)',
            }}
          />
        </div>

        {/* Soft Ambient Concert Atmosphere Haze */}
        <div 
          className="absolute top-[12%] inset-x-0 h-[45%] bg-gradient-to-b from-cyan-500/15 via-purple-500/12 to-transparent blur-3xl pointer-events-none animate-stage-haze" 
          aria-hidden="true"
        />

        {/* Subtle Dark Vignette for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/30 via-transparent to-obsidian-950/65 md:to-obsidian-950/40 pointer-events-none" />
      </div>

      {/* 2. Fullscreen Canvas: Dynamic Stage Spotlights, Lasers & Festival Light Motes */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none gpu-accelerated"
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
