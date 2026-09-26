import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundController } from '../utils/audio';

// Cubic Bézier calculation helper for smooth parametric curves matching the artwork's ribbons
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
      // Left Molten Ribbon: Swoops from upper-left down across the left flank
      return getCubicBezier(
        { x: w * 0.35, y: -10 },
        { x: w * 0.28, y: h * 0.22 },
        { x: w * 0.12, y: h * 0.40 },
        { x: -15, y: h * 0.62 },
        ct
      );
    } else if (pathIndex === 1) {
      // Right Molten Ribbon: Swoops down from upper-right across the right flank
      return getCubicBezier(
        { x: w * 0.68, y: -10 },
        { x: w * 0.76, y: h * 0.24 },
        { x: w * 0.88, y: h * 0.44 },
        { x: w + 20, y: h * 0.34 },
        ct
      );
    } else {
      // Bottom Chest Loop: Curving under the figure's collar/chest
      return getCubicBezier(
        { x: w * 0.44, y: h * 0.62 },
        { x: w * 0.48, y: h * 0.94 },
        { x: w * 0.58, y: h * 0.98 },
        { x: w * 0.70, y: h * 0.78 },
        ct
      );
    }
  } else {
    // Mobile Portrait framing (artwork centered at center 20%)
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

// Helper: Generates a single, lightweight, clean lightning bolt targeting upper sky quadrants
function createCleanBolt(w, h, isDesktop) {
  try {
    const segments = [];
    const strikeSide = Math.random() > 0.5 ? 'left' : 'right';

    let startX, startY, endX, endY;
    if (isDesktop) {
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
      startX = w * (0.2 + Math.random() * 0.6);
      startY = 0;
      endX = startX + (Math.random() - 0.5) * w * 0.3;
      endY = h * (0.16 + Math.random() * 0.16);
    }

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
      const nx = -dy / len;
      const ny = dx / len;
      const offset = (Math.random() - 0.5) * spread;
      const displacedX = midX + nx * offset;
      const displacedY = midY + ny * offset;

      subdivide(x1, y1, displacedX, displacedY, depth + 1, maxDepth, spread * 0.55);
      subdivide(displacedX, displacedY, x2, y2, depth + 1, maxDepth, spread * 0.55);

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
      fadeRate: 0.055,
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
  const ribbonPulsesRef = useRef([]);
  const haloBurstRef = useRef(0);
  const glintRef = useRef(null);
  const activeBoltRef = useRef(null);

  const nextAutoStrikeTimeRef = useRef(Date.now() + 6000 + Math.random() * 4000);
  const nextRibbonPulseTimeRef = useRef(Date.now() + 800);
  const nextGlintTimeRef = useRef(Date.now() + 2500);
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

  // Interactive Solar Beat Drop: Spawns solar halo burst, ribbon energy surges & embers
  const triggerConcertBeat = useCallback((originX = null, originY = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const isDesktop = w >= 768;

    const x = originX !== null ? originX : w * 0.5;
    const y = originY !== null ? originY : (isDesktop ? h * 0.32 : h * 0.20);

    // Audio feedback
    soundController.playVinylScratch();
    setIsBeating(true);
    setTimeout(() => setIsBeating(false), 400);

    // Flare up the solar halo corona
    haloBurstRef.current = 1.0;

    // Send energy pulses surging along the ribbons
    ribbonPulsesRef.current.push(
      { pathIndex: 0, progress: 0, speed: 0.012, tailLength: 0.16, color: '#ffc107' },
      { pathIndex: 1, progress: 0, speed: 0.012, tailLength: 0.16, color: '#ff9500' }
    );

    // Golden Stardust & Solar Ember Explosion from halo
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
    if (Date.now() - lastStrikeTimeRef.current > 4000 && Math.random() < 0.4) {
      spawnBolt();
    }
  }, [spawnBolt]);

  // Click anywhere on page to trigger solar ember burst & ribbon energy surge
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

  // Main 60fps Canvas Loop (Try-Catch Protected, 100% Crash-Proof)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

    const animate = () => {
      try {
        const w = canvas.width;
        const h = canvas.height;
        const isDesktop = w >= 768;
        const now = Date.now();

        ctx.clearRect(0, 0, w, h);

        const haloCenterX = w * 0.5;
        const haloCenterY = isDesktop ? h * 0.32 : h * 0.20;
        const haloRadiusX = isDesktop ? 135 : 85;
        const haloRadiusY = isDesktop ? 46 : 28;

        // 1. IMAGE-BASED ANIMATION: SOLAR HALO CORONA BREATHING GLOW
        const breathVal = 0.5 + 0.5 * Math.sin(now * 0.0022);
        const haloAlpha = 0.20 + 0.14 * breathVal + haloBurstRef.current * 0.45;
        if (haloBurstRef.current > 0.01) {
          haloBurstRef.current *= 0.94;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.translate(haloCenterX, haloCenterY);
        ctx.rotate(-0.09); // Matches tilted perspective of the disc in the artwork
        ctx.scale(1, haloRadiusY / haloRadiusX);

        const haloGrad = ctx.createRadialGradient(0, 0, haloRadiusX * 0.25, 0, 0, haloRadiusX * 1.4);
        haloGrad.addColorStop(0, `rgba(255, 230, 110, ${haloAlpha * 0.85})`);
        haloGrad.addColorStop(0.35, `rgba(255, 130, 0, ${haloAlpha * 0.60})`);
        haloGrad.addColorStop(0.70, `rgba(255, 60, 0, ${haloAlpha * 0.28})`);
        haloGrad.addColorStop(1.0, 'rgba(255, 30, 0, 0)');

        ctx.beginPath();
        ctx.arc(0, 0, haloRadiusX * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();
        ctx.restore();

        // 2. IMAGE-BASED ANIMATION: MOLTEN LIGHT PULSES COURSING ALONG THE RIBBONS
        if (now > nextRibbonPulseTimeRef.current && ribbonPulsesRef.current.length < 3) {
          const chosenPath = Math.floor(Math.random() * 3);
          ribbonPulsesRef.current.push({
            pathIndex: chosenPath,
            progress: 0,
            speed: 0.005 + Math.random() * 0.005,
            tailLength: 0.14,
            color: Math.random() > 0.4 ? '#ff9500' : '#ffc107',
          });
          nextRibbonPulseTimeRef.current = now + 1800 + Math.random() * 2000;
        }

        if (ribbonPulsesRef.current.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ribbonPulsesRef.current = ribbonPulsesRef.current.filter((pulse) => {
            pulse.progress += pulse.speed;
            const startT = Math.max(0, pulse.progress - pulse.tailLength);
            const endT = Math.min(1, pulse.progress);

            if (startT >= 1.0) return false;

            const steps = 7;
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

              // Outer ribbon aura
              ctx.strokeStyle = grad;
              ctx.lineWidth = isDesktop ? 3.5 : 2.5;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.shadowColor = '#ff6a00';
              ctx.shadowBlur = 15;
              ctx.globalAlpha = Math.max(0, pulseFade * 0.9);
              ctx.stroke();

              // Inner bright core
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = isDesktop ? 1.4 : 1.0;
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 6;
              ctx.globalAlpha = Math.max(0, pulseFade);
              ctx.stroke();

              // Leading photon point
              ctx.beginPath();
              ctx.arc(headPt.x, headPt.y, isDesktop ? 2.5 : 1.8, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#ffb703';
              ctx.shadowBlur = 10;
              ctx.fill();

              // Shed ambient golden embers from the ribbon
              if (Math.random() < 0.25 && sparksRef.current.length < 55) {
                sparksRef.current.push({
                  x: headPt.x,
                  y: headPt.y,
                  vx: (Math.random() - 0.5) * 0.8,
                  vy: -(0.4 + Math.random() * 1.3),
                  size: 1.2 + Math.random() * 2.0,
                  color: Math.random() > 0.4 ? '#ffb703' : '#ff7700',
                  alpha: 0.85,
                  fadeRate: 0.012 + Math.random() * 0.012,
                });
              }
            }

            return pulse.progress < 1.0 + pulse.tailLength;
          });
          ctx.restore();
        }

        // 3. IMAGE-BASED ANIMATION: SPECULAR CHROME DIAMOND GLINT (Throat & Chin Reflections)
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

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.3;
            ctx.shadowColor = '#ffea00';
            ctx.shadowBlur = 8;

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

        // 4. Safe Single-Bolt Lightning Render (Perimeter Sky)
        const bolt = activeBoltRef.current;
        if (bolt && bolt.segments && bolt.segments.length > 0) {
          bolt.alpha -= bolt.fadeRate;

          if (bolt.alpha > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            if (bolt.alpha > 0.85) {
              const flashA = (bolt.alpha - 0.85) * 0.45;
              ctx.fillStyle = bolt.isAmber
                ? `rgba(255, 183, 3, ${flashA})`
                : `rgba(56, 189, 248, ${flashA})`;
              ctx.fillRect(0, 0, w, h);
            }

            ctx.globalAlpha = Math.max(0, Math.min(1, bolt.alpha));

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

        // 5. Ambient Drifting Cosmic Golden Stardust & Solar Embers
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

        // 6. Subtle Cosmic Shooting Star Streaks
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

        // 7. Periodic Auto Lightning Timer (Strikes every 8-14s)
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

      {/* 2. Fullscreen Canvas: Artwork-Synchronized Solar Halo Corona, Molten Ribbon Pulses, Chrome Glints & Stardust */}
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
