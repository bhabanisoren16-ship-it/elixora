import React, { useEffect, useRef } from 'react';
import desktopBg from '../assets/desktop-background.jpg'; // Widescreen 16:9 desktop concert atmosphere
import mobileBg from '../assets/party-background.jpg'; // Portrait mobile concert atmosphere

export default function Background() {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isVisibleRef = useRef(true);
  const animFrameRef = useRef(null);

  // Desktop smooth micro-parallax tracking on mouse move (only for mouse/trackpad pointer)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mousePosRef.current.targetX = normX;
      mousePosRef.current.targetY = normY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Page visibility API: pause render loop when tab is backgrounded to preserve battery
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Main Hardware-Accelerated Canvas Lighting Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;

    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const resize = (isInitial = false) => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // On mobile, scrolling hides/shows the address bar, altering height by ~60-120px.
      // Ignore mobile address-bar height adjustments so the canvas never resets or flickers during scroll!
      if (!isInitial && newWidth === lastWidth && Math.abs(newHeight - lastHeight) < 160) {
        return;
      }

      lastWidth = newWidth;
      lastHeight = newHeight;
      width = newWidth;
      height = newHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize(true);
    const handleResize = () => resize(false);
    window.addEventListener('resize', handleResize, { passive: true });

    let lastFrameTime = performance.now();

    const animate = (currentTime) => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) {
        return;
      }

      const delta = currentTime - lastFrameTime;
      // Cap at ~45fps to ensure buttery fluidity while keeping GPU and battery usage minimal
      if (delta < 22) {
        return;
      }
      lastFrameTime = currentTime;

      try {
        const w = width;
        const h = height;
        const isDesktop = w >= 768;
        const now = Date.now();

        ctx.clearRect(0, 0, w, h);

        const parallaxX = 0; // 100% stationary background, zero parallax shifting

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
              { originFrac: 0.22, targetFrac: 0.36, speed: 0.0007, width: 85, color: 'rgba(0, 229, 255, 0.28)', phase: 0 },
              { originFrac: 0.78, targetFrac: 0.64, speed: 0.0006, width: 90, color: 'rgba(56, 189, 248, 0.28)', phase: 2.0 },
              { originFrac: 0.50, targetFrac: 0.50, speed: 0.0009, width: 95, color: 'rgba(192, 132, 252, 0.22)', phase: 4.1 },
            ];

        for (let i = 0; i < beamConfigs.length; i++) {
          const b = beamConfigs[i];
          const sweep = isDesktop ? Math.sin(now * b.speed + b.phase) * 80 : 0;
          const topX = w * b.originFrac + parallaxX * 0.4;
          const topY = 0;
          const bottomX = w * b.targetFrac + sweep + parallaxX;
          const bottomY = h * 0.95;

          const grad = ctx.createLinearGradient(topX, topY, bottomX, bottomY);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
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
          const flareRadius = isDesktop ? 18 : 12;
          const flareGrad = ctx.createRadialGradient(topX, topY, 0, topX, topY, flareRadius);
          flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          flareGrad.addColorStop(0.35, 'rgba(0, 229, 255, 0.85)');
          flareGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
          ctx.beginPath();
          ctx.arc(topX, topY, flareRadius, 0, Math.PI * 2);
          ctx.fillStyle = flareGrad;
          ctx.fill();
        }

        // 2. CONCERT LASER BEAMS (Crisp, vibrant neon lasers slicing the sky)
        const laserConfigs = isDesktop
          ? [
              { originFrac: 0.28, targetFrac: 0.15, speed: 0.0012, color: '#00e5ff', phase: 0.5 },
              { originFrac: 0.38, targetFrac: 0.68, speed: 0.0009, color: '#c084fc', phase: 2.1 },
              { originFrac: 0.62, targetFrac: 0.32, speed: 0.0011, color: '#38bdf8', phase: 3.4 },
              { originFrac: 0.72, targetFrac: 0.86, speed: 0.0013, color: '#00e5ff', phase: 5.0 },
            ]
          : [
              { originFrac: 0.32, targetFrac: 0.18, speed: 0.0012, color: '#00e5ff', phase: 0.5 },
              { originFrac: 0.68, targetFrac: 0.82, speed: 0.0011, color: '#c084fc', phase: 3.2 },
            ];

        for (let i = 0; i < laserConfigs.length; i++) {
          const l = laserConfigs[i];
          const sweep = isDesktop ? Math.sin(now * l.speed + l.phase) * 120 : 0;
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
          ctx.lineWidth = isDesktop ? 3.5 : 2.4;
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

        // 3. RHYTHMIC STAGE BASS PULSE (Stage center glow beating in music tempo)
        const bassBeat = Math.pow(Math.max(0, Math.sin(now * 0.0028)), 3);
        const stagePulseRadius = isDesktop ? w * 0.28 : w * 0.45;
        const stageCenterX = w * 0.5 + parallaxX * 0.3;
        const stageCenterY = isDesktop ? h * 0.26 : h * 0.22;

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

        // 4. TOP STAGE PYRO & LIGHTING TRUSS WARMTH BREATH
        const pyroBreath = 0.12 + 0.06 * Math.sin(now * 0.0015);
        const topGrad = ctx.createRadialGradient(w * 0.5, 0, 10, w * 0.5, 0, h * 0.42);
        topGrad.addColorStop(0, `rgba(255, 120, 20, ${pyroBreath * 1.2})`);
        topGrad.addColorStop(0.4, `rgba(245, 158, 11, ${pyroBreath * 0.6})`);
        topGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, w, h * 0.45);

        // 5. ATMOSPHERIC CONCERT SPARKS & LIGHT MOTES (Rising from crowd)
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

      } catch (err) {
        console.error("Canvas render error caught cleanly:", err);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* 1. Desktop & Mobile Background Container - 100% Rock-Solid Fixed to Viewport (Stationary During Scroll) */}
      <div
        className="fixed-concert-background mobile-fixed-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'none',
          WebkitTransform: 'none',
        }}
        aria-hidden="true"
      >
        {/* Desktop Screen (≥ md): Native 16:9 Widescreen Concert Atmosphere */}
        <img
          src={desktopBg}
          alt="ELIXORA 2.0 Concert Atmosphere"
          decoding="async"
          loading="eager"
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-[center_top] filter brightness-[0.62] contrast-[1.22] pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            transform: 'none',
            WebkitTransform: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Mobile Screen (< md): Native Portrait Fullscreen Cover */}
        <img
          src={mobileBg}
          alt="ELIXORA 2.0 Concert Atmosphere"
          decoding="async"
          loading="eager"
          className="block md:hidden absolute inset-0 w-full h-full object-cover object-[center_top] filter brightness-[0.62] contrast-[1.22] pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            transform: 'none',
            WebkitTransform: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Universal Concert Atmosphere Contrast Layer */}
        <div 
          className="absolute inset-0 bg-[#040508]/40 pointer-events-none" 
          aria-hidden="true"
        />

        {/* Dynamic Rhythmic Beat Pulse Glow (Concert Lighting Heartbeat, soft) */}
        <div 
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] sm:w-[900px] sm:h-[450px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-sky-400/10 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none animate-stage-pulse" 
          aria-hidden="true"
        />

        {/* Soft Ambient Concert Atmosphere Haze */}
        <div 
          className="absolute top-[8%] inset-x-0 h-[45%] bg-gradient-to-b from-cyan-500/8 via-purple-500/5 to-transparent blur-3xl pointer-events-none animate-stage-haze" 
          aria-hidden="true"
        />

        {/* Top Header Atmosphere Vignette: Deep rich gradient ensuring all header & title text is 100% visible */}
        <div 
          className="absolute top-0 inset-x-0 h-[65vh] sm:h-[75vh] bg-gradient-to-b from-[#040508]/92 via-[#040508]/65 to-transparent pointer-events-none" 
          aria-hidden="true"
        />

        {/* Deep Bottom Vignette for Smooth Transition into Content and Cards */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040508]/25 to-[#040508]/85 pointer-events-none" 
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#040508_95%)] opacity-70 pointer-events-none" 
          aria-hidden="true"
        />
      </div>

      {/* 2. Fullscreen Canvas: Dynamic Stage Spotlights, Lasers & Festival Light Motes */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'none',
          WebkitTransform: 'none',
        }}
        aria-hidden="true"
      />
    </>
  );
}
