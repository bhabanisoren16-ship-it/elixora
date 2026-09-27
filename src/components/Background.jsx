import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundController } from '../utils/audio';

// Fast Cubic Bézier calculation helper
function getCubicBezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

// Maps points along the 3 distinct glowing molten orange ribbons in background-desktop / background-mobile
function getRibbonPoint(pathIndex, t, w, h, isDesktop) {
  const ct = Math.max(0, Math.min(1, t));

  if (isDesktop) {
    if (pathIndex === 0) {
      return getCubicBezier(
        { x: w * 0.35, y: -10 },
        { x: w * 0.28, y: h * 0.22 },
        { x: w * 0.12, y: h * 0.40 },
        { x: -15, y: h * 0.62 },
        ct
      );
    } else if (pathIndex === 1) {
      return getCubicBezier(
        { x: w * 0.68, y: -10 },
        { x: w * 0.76, y: h * 0.24 },
        { x: w * 0.88, y: h * 0.44 },
        { x: w + 20, y: h * 0.34 },
        ct
      );
    } else {
      return getCubicBezier(
        { x: w * 0.44, y: h * 0.62 },
        { x: w * 0.48, y: h * 0.94 },
        { x: w * 0.58, y: h * 0.98 },
        { x: w * 0.70, y: h * 0.78 },
        ct
      );
    }
  } else {
    if (pathIndex === 0) {
      return getCubicBezier(
        { x: w * 0.32, y: -10 },
        { x: w * 0.24, y: h * 0.18 },
        { x: w * 0.08, y: h * 0.36 },
        { x: -10, y: h * 0.56 },
        ct
      );
    } else if (pathIndex === 1) {
      return getCubicBezier(
        { x: w * 0.70, y: -10 },
        { x: w * 0.78, y: h * 0.20 },
        { x: w * 0.92, y: h * 0.40 },
        { x: w + 10, y: h * 0.30 },
        ct
      );
    } else {
      return getCubicBezier(
        { x: w * 0.38, y: h * 0.48 },
        { x: w * 0.46, y: h * 0.72 },
        { x: w * 0.62, y: h * 0.76 },
        { x: w * 0.74, y: h * 0.58 },
        ct
      );
    }
  }
}

// High-Voltage Fractal Branching Generator for Dramatic Striking Lightning
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
  const shootingStarsRef = useRef([]);
  const ribbonPulsesRef = useRef([]);
  const cachedRibbonsRef = useRef([[], [], []]);
  const haloBurstRef = useRef(0);
  const glintRef = useRef(null);
  const activeBoltRef = useRef(null);

  const nextAutoStrikeTimeRef = useRef(Date.now() + 2500);
  const nextRibbonPulseTimeRef = useRef(Date.now() + 800);
  const nextGlintTimeRef = useRef(Date.now() + 2200);
  const lastStrikeTimeRef = useRef(Date.now());
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isScrolledOutRef = useRef(false);
  const isVisibleRef = useRef(true);
  const animFrameRef = useRef(null);

  // High-Voltage Striking Lightning Effect (Zero Pop, Pure Smooth Dissolve)
  const spawnStrikingEffect = useCallback((targetX = null, targetY = null, isIntense = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const isDesktop = w >= 768;

    const haloX = w * 0.5;
    const haloY = isDesktop ? h * 0.32 : h * 0.20;

    const endX = targetX !== null ? targetX : haloX + (Math.random() - 0.5) * (isDesktop ? 220 : 120);
    const endY = targetY !== null ? targetY : haloY + (Math.random() - 0.5) * 50;

    const startX = endX + (Math.random() - 0.5) * (w * 0.45);
    const startY = 0;

    const strikePalettes = [
      { main: '#ff6a00', glow: '#ff3700', core: '#ffffff' },
      { main: '#ffb703', glow: '#ff7700', core: '#fffdf0' },
      { main: '#ff8500', glow: '#e63900', core: '#ffffff' },
      { main: '#ffa200', glow: '#ff4d00', core: '#fff9e6' },
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
      isDesktop ? 60 : 40,
      4
    );

    let secondarySegments = [];
    if (isDesktop && Math.random() > 0.4) {
      const s2X = startX + (Math.random() - 0.5) * 140;
      secondarySegments = generateStrikingBranches(
        s2X,
        0,
        endX + (Math.random() - 0.5) * 90,
        endY + (Math.random() - 0.5) * 40,
        40,
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

    lastStrikeTimeRef.current = Date.now();

    // Surge smooth energy along ribbons without any pop
    ribbonPulsesRef.current.push(
      { pathIndex: 0, progress: 0, speed: 0.012, tailLength: 0.16, color: mainColor },
      { pathIndex: 1, progress: 0, speed: 0.012, tailLength: 0.16, color: glowColor }
    );

    soundController.playLightningThunder();

    setTimeout(() => {
      if (activeBoltRef.current && Date.now() - activeBoltRef.current.createdAt > 450) {
        activeBoltRef.current = null;
      }
    }, 480);
  }, []);

  // Click anywhere on page to trigger smooth lightning strike
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

  // Viewport tracking: pause background canvas when hero section is out of view
  useEffect(() => {
    let observer;
    const heroEl = document.getElementById('hero');
    if ('IntersectionObserver' in window && heroEl) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isScrolledOutRef.current = !entry.isIntersecting;
        },
        { threshold: 0.02 }
      );
      observer.observe(heroEl);
    } else {
      const handleScroll = () => {
        isScrolledOutRef.current = window.scrollY > window.innerHeight * 1.35;
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // Page visibility API: pause render loop when tab is backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Main 60fps Canvas Loop (100% Lag-Free: Zero shadowBlur, In-Place GC Free Arrays, O(1) Cache)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Cache precalculated ribbon points on resize
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || Math.abs(canvas.height - h) > 120) {
        canvas.width = w;
        canvas.height = h;

        const isDesktop = w >= 768;
        const newCache = [[], [], []];
        for (let pIdx = 0; pIdx < 3; pIdx++) {
          const steps = 14;
          for (let s = 0; s <= steps; s++) {
            newCache[pIdx].push(getRibbonPoint(pIdx, s / steps, w, h, isDesktop));
          }
        }
        cachedRibbonsRef.current = newCache;
      }
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let lastFrameTime = performance.now();

    const animate = (currentTime) => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Skip frame if tab is hidden or user has scrolled far down past hero
      if (!isVisibleRef.current || isScrolledOutRef.current) {
        return;
      }

      // Delta throttle: cap to max 75fps to save battery & eliminate stutter
      const delta = currentTime - lastFrameTime;
      if (delta < 12) {
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
        const parallaxX = isDesktop ? m.x * 4.5 : 0;
        const parallaxY = isDesktop ? m.y * 3.0 : 0;

        const haloCenterX = w * 0.5 + parallaxX;
        const haloCenterY = (isDesktop ? h * 0.32 : h * 0.20) + parallaxY;
        const haloRadiusX = isDesktop ? 135 : 85;
        const haloRadiusY = isDesktop ? 46 : 28;

        // 1. IMAGE-BASED ANIMATION: SOLAR HALO CORONA BREATHING GLOW (Zero shadowBlur)
        const breathVal = 0.5 + 0.5 * Math.sin(now * 0.002);
        const haloAlpha = 0.20 + 0.12 * breathVal + haloBurstRef.current * 0.4;
        if (haloBurstRef.current > 0.01) {
          haloBurstRef.current *= 0.94;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.translate(haloCenterX, haloCenterY);
        ctx.rotate(-0.09);
        ctx.scale(1, haloRadiusY / haloRadiusX);

        const haloGrad = ctx.createRadialGradient(0, 0, haloRadiusX * 0.25, 0, 0, haloRadiusX * 1.35);
        haloGrad.addColorStop(0, `rgba(255, 230, 110, ${haloAlpha * 0.8})`);
        haloGrad.addColorStop(0.35, `rgba(255, 130, 0, ${haloAlpha * 0.55})`);
        haloGrad.addColorStop(0.70, `rgba(255, 60, 0, ${haloAlpha * 0.25})`);
        haloGrad.addColorStop(1.0, 'rgba(255, 30, 0, 0)');

        ctx.beginPath();
        ctx.arc(0, 0, haloRadiusX * 1.35, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();
        ctx.restore();

        // 1b. ORBITING SOLAR PLASMA MOTES CIRCLING THE HALO DISC (Hardware Geometry Glow)
        const orbitalAngle = (now * 0.0014) % (Math.PI * 2);
        const cosTilt = Math.cos(-0.09);
        const sinTilt = Math.sin(-0.09);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let o = 0; o < 2; o++) {
          const theta = orbitalAngle + o * Math.PI;
          const ox = Math.cos(theta) * haloRadiusX;
          const oy = Math.sin(theta) * haloRadiusY;

          const isFront = Math.sin(theta) > 0;
          const orbAlpha = isFront ? 0.95 : 0.40;
          const orbSize = (isFront ? 2.4 : 1.6) * (isDesktop ? 1.0 : 0.85);

          const rx = haloCenterX + (ox * cosTilt - oy * sinTilt);
          const ry = haloCenterY + (ox * sinTilt + oy * cosTilt);

          // Outer soft glow aura
          ctx.beginPath();
          ctx.arc(rx, ry, orbSize * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = o === 0 ? 'rgba(255, 234, 0, 0.35)' : 'rgba(255, 149, 0, 0.35)';
          ctx.globalAlpha = orbAlpha;
          ctx.fill();

          // Bright center core
          ctx.beginPath();
          ctx.arc(rx, ry, orbSize, 0, Math.PI * 2);
          ctx.fillStyle = o === 0 ? '#ffea00' : '#ff9500';
          ctx.globalAlpha = orbAlpha;
          ctx.fill();
        }
        ctx.restore();

        // 2a. CONTINUOUS LIVING AMBIENT SHIMMER ALONG CACHED RIBBONS (O(1) Array Lookup)
        const ribbonBreath = 0.11 + 0.05 * Math.sin(now * 0.0018);
        const cached = cachedRibbonsRef.current;
        if (cached && cached[0].length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.strokeStyle = '#ff7700';
          ctx.lineWidth = isDesktop ? 1.5 : 1.0;
          ctx.globalAlpha = ribbonBreath;

          for (let pIdx = 0; pIdx < 3; pIdx++) {
            const pts = cached[pIdx];
            if (pts && pts.length > 0) {
              ctx.beginPath();
              ctx.moveTo(pts[0].x, pts[0].y);
              for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
              }
              ctx.stroke();
            }
          }
          ctx.restore();
        }

        // 2b. MOLTEN LIGHT PULSES COURSING ALONG THE RIBBONS
        if (now > nextRibbonPulseTimeRef.current && ribbonPulsesRef.current.length < 3) {
          const chosenPath = Math.floor(Math.random() * 3);
          ribbonPulsesRef.current.push({
            pathIndex: chosenPath,
            progress: 0,
            speed: 0.006 + Math.random() * 0.005,
            tailLength: 0.14,
            color: Math.random() > 0.4 ? '#ff9500' : '#ffc107',
          });
          nextRibbonPulseTimeRef.current = now + 1800 + Math.random() * 2000;
        }

        if (ribbonPulsesRef.current.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const pulses = ribbonPulsesRef.current;
          let pulseWriteIdx = 0;
          const pulseCount = pulses.length;

          for (let p = 0; p < pulseCount; p++) {
            const pulse = pulses[p];
            pulse.progress += pulse.speed;
            const startT = Math.max(0, pulse.progress - pulse.tailLength);
            const endT = Math.min(1, pulse.progress);

            if (startT < 1.0) {
              const steps = 6;
              ctx.beginPath();
              let headPt = null;
              let tailPt = null;
              for (let i = 0; i <= steps; i++) {
                const stepT = startT + (endT - startT) * (i / steps);
                const pt = getRibbonPoint(pulse.pathIndex, stepT, w, h, isDesktop);
                if (i === 0) {
                  tailPt = pt;
                  ctx.moveTo(pt.x, pt.y);
                } else {
                  ctx.lineTo(pt.x, pt.y);
                }
                if (i === steps) headPt = pt;
              }

              if (headPt && tailPt) {
                const grad = ctx.createLinearGradient(tailPt.x, tailPt.y, headPt.x, headPt.y);
                grad.addColorStop(0, 'rgba(255, 90, 0, 0)');
                grad.addColorStop(0.6, pulse.color);
                grad.addColorStop(1, '#ffffff');

                const pulseFade = Math.min(1, pulse.progress * 4, (1.1 - pulse.progress) * 4);

                // Outer soft stroke (No shadowBlur overhead!)
                ctx.strokeStyle = grad;
                ctx.lineWidth = isDesktop ? 3.5 : 2.5;
                ctx.lineCap = 'round';
                ctx.globalAlpha = Math.max(0, pulseFade * 0.75);
                ctx.stroke();

                // Inner sharp core
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = isDesktop ? 1.4 : 1.0;
                ctx.globalAlpha = Math.max(0, pulseFade * 0.95);
                ctx.stroke();

                // Leading point
                ctx.beginPath();
                ctx.arc(headPt.x, headPt.y, isDesktop ? 2.4 : 1.8, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = pulseFade;
                ctx.fill();

                // In-place spawn of floating ember
                const maxSparks = isDesktop ? 35 : 18;
                if (Math.random() < 0.22 && sparksRef.current.length < maxSparks) {
                  sparksRef.current.push({
                    x: headPt.x,
                    y: headPt.y,
                    vx: (Math.random() - 0.5) * 0.7,
                    vy: -(0.4 + Math.random() * 1.2),
                    size: 1.2 + Math.random() * 1.8,
                    color: Math.random() > 0.4 ? '#ffb703' : '#ff7700',
                    alpha: 0.85,
                    fadeRate: 0.012 + Math.random() * 0.012,
                  });
                }
              }

              if (pulse.progress < 1.0 + pulse.tailLength) {
                pulses[pulseWriteIdx++] = pulse;
              }
            }
          }
          pulses.length = pulseWriteIdx;
          ctx.restore();
        }

        // 3. SPECULAR CHROME DIAMOND GLINT (Zero shadowBlur)
        if (now > nextGlintTimeRef.current && !glintRef.current) {
          glintRef.current = {
            x: haloCenterX + (Math.random() - 0.5) * (isDesktop ? 24 : 16),
            y: haloCenterY + (isDesktop ? 44 : 28) + Math.random() * (isDesktop ? 32 : 18),
            alpha: 0,
            phase: 'in',
            size: isDesktop ? 12 : 9,
          };
          nextGlintTimeRef.current = now + 4000 + Math.random() * 4500;
        }

        if (glintRef.current) {
          const g = glintRef.current;
          if (g.phase === 'in') {
            g.alpha += 0.08;
            if (g.alpha >= 1) g.phase = 'out';
          } else {
            g.alpha -= 0.05;
            if (g.alpha <= 0) glintRef.current = null;
          }

          if (glintRef.current) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = Math.max(0, Math.min(1, g.alpha));
            ctx.translate(g.x, g.y);

            // Double stroke for glow
            ctx.strokeStyle = 'rgba(255, 234, 0, 0.4)';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(-g.size, 0);
            ctx.lineTo(g.size, 0);
            ctx.moveTo(0, -g.size);
            ctx.lineTo(0, g.size);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-g.size, 0);
            ctx.lineTo(g.size, 0);
            ctx.moveTo(0, -g.size);
            ctx.lineTo(0, g.size);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.restore();
          }
        }

        // 4. DRAMATIC HIGH-VOLTAGE STRIKING LIGHTNING BOLTS (Layered GPU Stroke, Zero shadowBlur)
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
            drawSegments(bolt.primary, bolt.glowColor, isDesktop ? 6.5 : 4.5, 0.4);

            // Pass 2: Intense Neon Body
            drawSegments(bolt.primary, bolt.mainColor, isDesktop ? 3.0 : 2.0, 0.85);

            // Pass 3: Searing Incandescent Core Beam
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

        // 5. AMBIENT DRIFTING COSMIC STARDUST & EMBERS (IN-PLACE ZERO GC ALLOCATION)
        const maxSparks = isDesktop ? 35 : 18;
        if (Math.random() < 0.3 && sparksRef.current.length < maxSparks) {
          sparksRef.current.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -(0.3 + Math.random() * 1.0),
            size: 1.2 + Math.random() * 1.8,
            color: Math.random() > 0.3 ? (Math.random() > 0.5 ? '#ffb703' : '#ff7700') : '#ffd166',
            alpha: 0.85,
            fadeRate: 0.005 + Math.random() * 0.005,
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
            // Fast 2-pass circle glow without expensive shadowBlur
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.globalAlpha = sp.alpha * 0.35;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.globalAlpha = sp.alpha * 0.9;
            ctx.fill();

            sparks[sparkWriteIdx++] = sp;
          }
        }
        sparks.length = sparkWriteIdx;
        ctx.restore();

        // 6. SUBTLE COSMIC SHOOTING STAR STREAKS (Fast Hardware Gradient)
        if (Math.random() < 0.005 && shootingStarsRef.current.length < 2) {
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
            color: Math.random() > 0.4 ? '#ffb703' : '#fff3c4',
          });
        }

        if (shootingStarsRef.current.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const stars = shootingStarsRef.current;
          let starWriteIdx = 0;
          const starCount = stars.length;

          for (let s = 0; s < starCount; s++) {
            const star = stars[s];
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
              ctx.lineWidth = 1.4;
              ctx.lineCap = 'round';
              ctx.globalAlpha = Math.max(0, star.alpha);
              ctx.stroke();

              stars[starWriteIdx++] = star;
            }
          }
          stars.length = starWriteIdx;
          ctx.restore();
        }

        // 7. Auto Striking Lightning Scheduler
        if (!activeBoltRef.current && now > nextAutoStrikeTimeRef.current) {
          spawnStrikingEffect();
          nextAutoStrikeTimeRef.current = now + 5000 + Math.random() * 3500;
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
        {/* Desktop Screen: Precision Focal Framing on Cosmic Halo with GPU-accelerated Subtle Breathe */}
        <img
          src="/background-desktop.jpg"
          alt="ELIXORA 2.0 Festival Background"
          decoding="async"
          loading="eager"
          className="hidden md:block w-full h-full object-cover object-[center_32%] filter brightness-[1.04] contrast-[1.06] saturate-[1.10] animate-subtle-breathe"
        />

        {/* Mobile Screen (< md): Native Portrait Cover - 100% Fixed & Frozen while scrolling */}
        <img
          src="/background-mobile.jpg"
          alt="ELIXORA 2.0 Festival Background"
          decoding="async"
          loading="eager"
          className="block md:hidden w-full h-full object-cover object-[center_20%] filter brightness-[1.02] contrast-[1.04]"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100lvh',
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />

        {/* Subtle Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/45 via-transparent to-obsidian-950/85 pointer-events-none" />
      </div>

      {/* 2. Fullscreen Canvas: Striking Lightning Bolts, Solar Halo Corona, Molten Ribbon Pulses & Embers */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none gpu-accelerated"
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
