import React, { useEffect, useRef, useCallback } from 'react';
import desktopBg from '../assets/desktop-background.jpg'; // Official concert atmosphere
import { soundController } from '../utils/audio';

// High-Voltage Fractal Branching Generator for Organic Lightning Bolts & Stage Lasers
function generateStrikingBranches(x1, y1, x2, y2, displace = 60, depth = 5) {
  const segments = [];
  function recurse(xa, ya, xb, yb, disp, d) {
    if (d <= 0 || disp < 3.0 || segments.length >= 48) {
      segments.push({ x1: xa, y1: ya, x2: xb, y2: yb });
      return;
    }
    const mx = (xa + xb) / 2;
    const my = (ya + yb) / 2;
    const dx = xb - xa;
    const dy = yb - ya;
    const len = Math.hypot(dx, dy);
    if (len < 10) {
      segments.push({ x1: xa, y1: ya, x2: xb, y2: yb });
      return;
    }
    const nx = -dy / len;
    const ny = dx / len;
    const offset = (Math.random() - 0.5) * disp * 1.9;
    const splitX = mx + nx * offset;
    const splitY = my + ny * offset;

    recurse(xa, ya, splitX, splitY, disp * 0.55, d - 1);
    recurse(splitX, splitY, xb, yb, disp * 0.55, d - 1);

    // Branch out sharp companion forks
    if (Math.random() < 0.44 && d > 1 && segments.length < 40) {
      const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.15;
      const branchLen = len * (0.24 + Math.random() * 0.38);
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
  const activeBoltsRef = useRef([]);
  const ambientArcsRef = useRef([]);
  const nextAutoStrikeTimeRef = useRef(0); // 0 triggers instant strike on first frame!
  const lastUserStrikeTimeRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isVisibleRef = useRef(true);
  const animFrameRef = useRef(null);

  // Desktop smooth micro-parallax tracking on mouse move
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

  // Page visibility API: pause render loop when tab is backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // High-Voltage Stage Lightning Strike (Desktop & Mobile)
  const spawnStrikingEffect = useCallback((targetX = null, targetY = null, isIntense = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isDesktop = w >= 768;

    let startX, startY, endX, endY;

    if (targetX !== null && targetY !== null) {
      // Interactive user click or tap: lightning strikes directly through target point
      startX = targetX + (Math.random() - 0.5) * (w * 0.2);
      startY = 0;
      endX = targetX;
      endY = targetY;
    } else {
      // Ambient striking choreography across stage and sky
      const pattern = Math.random();
      if (pattern < 0.38) {
        // 1. Left Flank Strike: cascades down past hero title along left stage
        startX = w * (0.12 + Math.random() * 0.22);
        startY = 0;
        endX = w * (0.06 + Math.random() * 0.24);
        endY = h * (0.60 + Math.random() * 0.32);
      } else if (pattern < 0.76) {
        // 2. Right Flank Strike: cascades down along right stage
        startX = w * (0.66 + Math.random() * 0.22);
        startY = 0;
        endX = w * (0.70 + Math.random() * 0.24);
        endY = h * (0.60 + Math.random() * 0.32);
      } else {
        // 3. Central Stage Plunge: dramatic thunderbolt behind hero title
        startX = w * (0.35 + Math.random() * 0.30);
        startY = 0;
        endX = w * (0.30 + Math.random() * 0.40);
        endY = h * (0.65 + Math.random() * 0.30);
      }
    }

    const strikePalettes = [
      { main: '#00f2fe', glow: '#0284c7', core: '#ffffff', name: 'cyan' },
      { main: '#38bdf8', glow: '#0369a1', core: '#e0f2fe', name: 'sky' },
      { main: '#c084fc', glow: '#7c3aed', core: '#faf5ff', name: 'violet' },
      { main: '#ffb703', glow: '#ea580c', core: '#fffbeb', name: 'amber' },
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
      isDesktop ? 65 : 52,
      isDesktop ? 5 : 4
    );

    let secondarySegments = [];
    if (Math.random() > 0.25) {
      const s2X = startX + (Math.random() - 0.5) * (isDesktop ? 130 : 90);
      secondarySegments = generateStrikingBranches(
        s2X,
        0,
        endX + (Math.random() - 0.5) * 80,
        endY + (Math.random() - 0.5) * 45,
        40,
        3
      );
    }

    const newBolt = {
      primary: primarySegments,
      secondary: secondarySegments,
      life: 1.0,
      fadeRate: isIntense ? 0.026 : 0.034,
      seed: Math.random() * 100,
      mainColor,
      glowColor,
      coreColor,
      isAmber: palette.name === 'amber',
      flashIntensity: isIntense ? 0.55 : 0.40,
      createdAt: Date.now(),
    };

    activeBoltsRef.current.push(newBolt);

    // 40% chance of a simultaneous opposite companion bolt
    if (isIntense && Math.random() > 0.55) {
      const otherStartX = w - startX + (Math.random() - 0.5) * (w * 0.2);
      const otherEndX = w - endX + (Math.random() - 0.5) * (w * 0.2);
      const otherBolt = {
        primary: generateStrikingBranches(otherStartX, 0, otherEndX, endY * 0.9, 50, 4),
        secondary: [],
        life: 0.9,
        fadeRate: 0.032,
        seed: Math.random() * 100,
        mainColor: glowColor,
        glowColor: mainColor,
        coreColor: '#ffffff',
        isAmber: palette.name === 'amber',
        flashIntensity: 0.30,
        createdAt: Date.now(),
      };
      activeBoltsRef.current.push(otherBolt);
    }

    // Keep activeBoltsRef capped to max 5 for peak 60fps performance
    if (activeBoltsRef.current.length > 5) {
      activeBoltsRef.current = activeBoltsRef.current.slice(-5);
    }

    // High-energy contact sparks shower at impact
    const sparkCount = isIntense ? 20 : 14;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 5.5;
      sparksRef.current.push({
        x: endX,
        y: Math.min(endY, h * 0.92),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.35 ? '#ffffff' : mainColor,
        alpha: 0.95,
        fadeRate: 0.020 + Math.random() * 0.018,
      });
    }

    soundController.playLightningThunder?.();
  }, []);

  // Click & Mobile Touch anywhere on page to trigger instant interactive stage lightning
  useEffect(() => {
    const handlePointerOrClick = (e) => {
      const target = e.target;
      if (!target) return;
      if (
        target.closest('button, a, input, select, textarea, [role="button"], [role="dialog"], label')
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastUserStrikeTimeRef.current < 250) return;
      lastUserStrikeTimeRef.current = now;

      let clientX = e.clientX;
      let clientY = e.clientY;
      if (clientX === undefined && e.changedTouches && e.changedTouches[0]) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }

      spawnStrikingEffect(clientX, clientY, true);
    };

    window.addEventListener('click', handlePointerOrClick, { passive: true });
    window.addEventListener('touchend', handlePointerOrClick, { passive: true });
    return () => {
      window.removeEventListener('click', handlePointerOrClick);
      window.removeEventListener('touchend', handlePointerOrClick);
    };
  }, [spawnStrikingEffect]);

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

      // On mobile, prevent address-bar collapse from resizing the canvas during scroll
      if (!isInitial && newWidth === lastWidth) {
        return;
      }

      lastWidth = newWidth;
      width = newWidth;

      const maxScreenH = Math.max(
        window.innerHeight,
        (window.screen && window.screen.height) ? window.screen.height : window.innerHeight
      );
      height = maxScreenH;
      lastHeight = maxScreenH;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = '100vw';
      canvas.style.height = '100%';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize(true);
    const handleResize = () => resize(false);
    window.addEventListener('resize', handleResize, { passive: true });

    let lastFrameTime = performance.now();
    let ambientArcTimer = 0;

    const animate = (currentTime) => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) {
        return;
      }

      const delta = currentTime - lastFrameTime;
      if (delta < 20) {
        return; // smooth ~50fps pacing
      }
      lastFrameTime = currentTime;

      try {
        const w = width;
        const h = height;
        const isDesktop = w >= 768;
        const now = Date.now();

        ctx.clearRect(0, 0, w, h);

        // =====================================================================
        // 1. DYNAMIC CONCERT SPOTLIGHT BEAMS (Sweeping volumetric stage cones)
        // =====================================================================
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const beamConfigs = [
          { originFrac: 0.15, targetFrac: 0.35, speed: 0.0007, width: isDesktop ? 140 : Math.max(75, Math.round(w * 0.22)), color: 'rgba(0, 242, 254, 0.40)', phase: 0 },
          { originFrac: 0.30, targetFrac: 0.52, speed: 0.0009, width: isDesktop ? 125 : Math.max(70, Math.round(w * 0.20)), color: 'rgba(56, 189, 248, 0.36)', phase: 1.2 },
          { originFrac: 0.70, targetFrac: 0.45, speed: 0.0008, width: isDesktop ? 135 : Math.max(72, Math.round(w * 0.21)), color: 'rgba(0, 242, 254, 0.38)', phase: 2.5 },
          { originFrac: 0.85, targetFrac: 0.62, speed: 0.0006, width: isDesktop ? 150 : Math.max(80, Math.round(w * 0.24)), color: 'rgba(192, 132, 252, 0.34)', phase: 3.8 },
          { originFrac: 0.50, targetFrac: 0.50, speed: 0.0011, width: isDesktop ? 160 : Math.max(85, Math.round(w * 0.25)), color: 'rgba(56, 189, 248, 0.35)', phase: 4.5 },
        ];

        for (let i = 0; i < beamConfigs.length; i++) {
          const b = beamConfigs[i];
          const sweepAmp = isDesktop ? 80 : Math.max(40, Math.round(w * 0.14));
          const sweep = Math.sin(now * b.speed + b.phase) * sweepAmp;
          const topX = w * b.originFrac;
          const topY = 0;
          const bottomX = w * b.targetFrac + sweep;
          const bottomY = h * 0.95;

          const grad = ctx.createLinearGradient(topX, topY, bottomX, bottomY);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          grad.addColorStop(0.18, b.color);
          grad.addColorStop(0.60, b.color.replace(/0\.\d+\)/, '0.16)'));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.moveTo(topX - (isDesktop ? 10 : 7), topY);
          ctx.lineTo(topX + (isDesktop ? 10 : 7), topY);
          ctx.lineTo(bottomX + b.width, bottomY);
          ctx.lineTo(bottomX - b.width, bottomY);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          // Spotlight fixture lens flare head
          const flareRadius = isDesktop ? 18 : 14;
          const flareGrad = ctx.createRadialGradient(topX, topY, 0, topX, topY, flareRadius);
          flareGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
          flareGrad.addColorStop(0.35, 'rgba(0, 242, 254, 0.92)');
          flareGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
          ctx.beginPath();
          ctx.arc(topX, topY, flareRadius, 0, Math.PI * 2);
          ctx.fillStyle = flareGrad;
          ctx.fill();
        }
        ctx.restore();

        // =====================================================================
        // 2. CONCERT LASER BEAMS (Crisp vibrant neon lasers slicing the sky)
        // =====================================================================
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const laserConfigs = [
          { originFrac: 0.22, targetFrac: 0.10, speed: 0.0012, color: '#00f2fe', phase: 0.5 },
          { originFrac: 0.35, targetFrac: 0.72, speed: 0.0009, color: '#c084fc', phase: 2.1 },
          { originFrac: 0.65, targetFrac: 0.28, speed: 0.0011, color: '#38bdf8', phase: 3.4 },
          { originFrac: 0.78, targetFrac: 0.90, speed: 0.0013, color: '#00f2fe', phase: 5.0 },
        ];

        for (let i = 0; i < laserConfigs.length; i++) {
          const l = laserConfigs[i];
          const laserSweepAmp = isDesktop ? 120 : Math.max(55, Math.round(w * 0.18));
          const sweep = Math.sin(now * l.speed + l.phase) * laserSweepAmp;
          const lx1 = w * l.originFrac;
          const ly1 = 0;
          const lx2 = w * l.targetFrac + sweep;
          const ly2 = h * 0.95;

          const laserPulse = 0.45 + 0.35 * Math.sin(now * 0.0028 + l.phase);

          // Outer diffused laser glow
          ctx.beginPath();
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.strokeStyle = l.color;
          ctx.lineWidth = isDesktop ? 3.8 : 2.8;
          ctx.globalAlpha = laserPulse * 0.65;
          ctx.stroke();

          // Incandescent laser core
          ctx.beginPath();
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.3;
          ctx.globalAlpha = laserPulse * 1.0;
          ctx.stroke();
        }
        ctx.restore();

        // =====================================================================
        // 3. CONTINUOUS AMBIENT HIGH-VOLTAGE ELECTRIC ARCS (Stage Truss Micro-Arcs)
        // =====================================================================
        // These crackle continuously across the top truss so the electric effect is ALWAYS active!
        if (now - ambientArcTimer > 180) {
          ambientArcTimer = now;
          ambientArcsRef.current = [
            {
              segments: generateStrikingBranches(w * 0.12, 10, w * 0.42, 28, 26, 3),
              color: '#00f2fe',
              glow: '#0284c7',
            },
            {
              segments: generateStrikingBranches(w * 0.58, 24, w * 0.88, 12, 26, 3),
              color: '#c084fc',
              glow: '#7c3aed',
            },
          ];
        }

        if (ambientArcsRef.current.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          for (let a = 0; a < ambientArcsRef.current.length; a++) {
            const arc = ambientArcsRef.current[a];
            const arcFlicker = 0.45 + 0.55 * Math.random();

            ctx.beginPath();
            for (let s = 0; s < arc.segments.length; s++) {
              const seg = arc.segments[s];
              ctx.moveTo(seg.x1, seg.y1);
              ctx.lineTo(seg.x2, seg.y2);
            }
            // Glow pass
            ctx.strokeStyle = arc.glow;
            ctx.lineWidth = isDesktop ? 4.5 : 3.2;
            ctx.shadowColor = arc.color;
            ctx.shadowBlur = 12;
            ctx.globalAlpha = arcFlicker * 0.6;
            ctx.stroke();

            // Core pass
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.4;
            ctx.shadowBlur = 4;
            ctx.globalAlpha = arcFlicker * 0.9;
            ctx.stroke();
          }
          ctx.restore();
        }

        // =====================================================================
        // 4. AUTO STAGE LIGHTNING SCHEDULER (Instant strike on load + every 1.6 - 2.8s)
        // =====================================================================
        if (now > nextAutoStrikeTimeRef.current) {
          spawnStrikingEffect(null, null, true);
          // Fast, dynamic recurring schedule
          nextAutoStrikeTimeRef.current = now + 1600 + Math.random() * 1200;
        }

        // =====================================================================
        // 5. HIGH-VOLTAGE STRIKING LIGHTNING BOLTS & ATMOSPHERIC SKY FLASH
        // =====================================================================
        if (activeBoltsRef.current.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';

          activeBoltsRef.current = activeBoltsRef.current.filter((bolt) => {
            bolt.life -= bolt.fadeRate;
            if (bolt.life <= 0) return false;

            // Electric crackle jitter
            const crackle = (Math.sin(now * 0.08 + bolt.seed) * 0.22 + 0.78) * bolt.life;
            const alpha = Math.max(0, Math.min(1, crackle));

            // Atmospheric sky flash illumination on strike entrance
            if (bolt.life > 0.65) {
              const flashA = (bolt.life - 0.65) * 2.8 * (bolt.flashIntensity || 0.45);
              const flashGrad = ctx.createLinearGradient(0, 0, 0, h * 0.85);
              flashGrad.addColorStop(0, bolt.isAmber ? `rgba(255, 183, 3, ${flashA * 0.45})` : `rgba(220, 250, 255, ${flashA * 0.50})`);
              flashGrad.addColorStop(0.4, bolt.isAmber ? `rgba(234, 88, 12, ${flashA * 0.30})` : `rgba(0, 242, 254, ${flashA * 0.35})`);
              flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
              ctx.fillStyle = flashGrad;
              ctx.fillRect(0, 0, w, h * 0.85);
            }

            const drawBoltSegments = (segs, strokeColor, lineWidth, shadowBlur) => {
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
              if (shadowBlur > 0) {
                ctx.shadowColor = strokeColor;
                ctx.shadowBlur = shadowBlur;
              } else {
                ctx.shadowBlur = 0;
              }
              ctx.globalAlpha = alpha;
              ctx.stroke();
            };

            // Pass 1: Diffused Outer High-Voltage Atmospheric Neon Aura
            drawBoltSegments(bolt.primary, bolt.glowColor, isDesktop ? 9.5 : 7.0, isDesktop ? 30 : 22);

            // Pass 2: Intense Neon Core Body
            drawBoltSegments(bolt.primary, bolt.mainColor, isDesktop ? 4.8 : 3.6, isDesktop ? 16 : 12);

            // Pass 3: Searing Solid White Center Beam
            drawBoltSegments(bolt.primary, bolt.coreColor || '#ffffff', isDesktop ? 2.2 : 1.6, isDesktop ? 8 : 6);

            // Pass 4: Secondary companion strike branches
            if (bolt.secondary && bolt.secondary.length > 0) {
              drawBoltSegments(bolt.secondary, bolt.glowColor, isDesktop ? 4.5 : 3.4, isDesktop ? 14 : 10);
              drawBoltSegments(bolt.secondary, bolt.coreColor || '#ffffff', isDesktop ? 1.6 : 1.2, isDesktop ? 6 : 4);
            }

            return true;
          });

          ctx.restore();
        }

        // =====================================================================
        // 6. RHYTHMIC STAGE BASS PULSE (Concert lighting heartbeat)
        // =====================================================================
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const bassBeat = Math.pow(Math.max(0, Math.sin(now * 0.0028)), 3);
        const stagePulseRadius = isDesktop ? w * 0.28 : Math.min(w * 0.45, 280);
        const stageCenterX = w * 0.5;
        const stageCenterY = isDesktop ? h * 0.26 : h * 0.22;

        const pulseGrad = ctx.createRadialGradient(
          stageCenterX, stageCenterY, 5,
          stageCenterX, stageCenterY, stagePulseRadius
        );
        pulseGrad.addColorStop(0, `rgba(0, 242, 254, ${0.20 + bassBeat * 0.26})`);
        pulseGrad.addColorStop(0.35, `rgba(168, 85, 247, ${0.12 + bassBeat * 0.16})`);
        pulseGrad.addColorStop(0.7, `rgba(245, 158, 11, ${0.05 + bassBeat * 0.08})`);
        pulseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(stageCenterX, stageCenterY, stagePulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = pulseGrad;
        ctx.fill();
        ctx.restore();

        // =====================================================================
        // 7. TOP STAGE PYRO & LIGHTING TRUSS WARMTH BREATH
        // =====================================================================
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const pyroBreath = 0.14 + 0.07 * Math.sin(now * 0.0015);
        const topGrad = ctx.createRadialGradient(w * 0.5, 0, 10, w * 0.5, 0, h * 0.42);
        topGrad.addColorStop(0, `rgba(255, 120, 20, ${pyroBreath * 1.25})`);
        topGrad.addColorStop(0.4, `rgba(245, 158, 11, ${pyroBreath * 0.65})`);
        topGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, w, h * 0.45);
        ctx.restore();

        // =====================================================================
        // 8. ATMOSPHERIC CONCERT SPARKS & LIGHT MOTES (Rising from crowd)
        // =====================================================================
        const maxSparks = isDesktop ? 45 : 30;
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

      } catch (err) {
        console.error("Canvas render error caught cleanly:", err);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spawnStrikingEffect]);

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
          height: '100%',
          minHeight: '100lvh',
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'none',
          WebkitTransform: 'none',
        }}
        aria-hidden="true"
      >
        {/* Same Concert Atmosphere Background Image for Both Desktop and Mobile View */}
        <img
          src={desktopBg}
          alt="ELIXORA 2.0 Concert Atmosphere"
          decoding="async"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-[center_top] filter brightness-[1.02] contrast-[1.04] pointer-events-none"
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

        {/* Stage Atmosphere Top Glow */}
        <div 
          className="absolute top-0 inset-x-0 h-[30vh] sm:h-[40vh] bg-gradient-to-b from-cyan-500/10 via-purple-600/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Dynamic Rhythmic Beat Pulse Glow (Concert Lighting Heartbeat) */}
        <div 
          className="absolute top-[22%] sm:top-[26%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] sm:w-[900px] sm:h-[450px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/15 to-sky-400/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none animate-stage-pulse" 
          aria-hidden="true"
        />

        {/* Soft Ambient Concert Atmosphere Haze */}
        <div 
          className="absolute top-[8%] inset-x-0 h-[45%] bg-gradient-to-b from-cyan-500/10 via-purple-500/8 to-transparent blur-3xl pointer-events-none animate-stage-haze" 
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

      {/* 2. Fullscreen Canvas: Dynamic Stage Spotlights, Lasers, Striking Lightning & Festival Light Motes */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none fixed-background-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100%',
          minHeight: '100lvh',
          zIndex: 15, // zIndex 15 ensures lightning bolts & sky flashes render above section backgrounds while pointer-events: none lets all clicks pass through
          pointerEvents: 'none',
          transform: 'none',
          WebkitTransform: 'none',
        }}
        aria-hidden="true"
      />
    </>
  );
}
