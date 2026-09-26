import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundController } from '../utils/audio';
import { Disc, Zap } from 'lucide-react';

export default function Background() {
  const canvasRef = useRef(null);
  const [isBeating, setIsBeating] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const soundwavesRef = useRef([]);
  const sparksRef = useRef([]);
  const burstBeamsRef = useRef([]);
  const animFrameRef = useRef(null);
  const beatTimerRef = useRef(null);

  // Track window scroll for smooth parallax adjustment on desktop
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Periodic festival beat pulse (spawns concentric soundwave rings from DJ console)
  const spawnBeatWave = useCallback((originX, originY, color) => {
    soundwavesRef.current.push({
      x: originX,
      y: originY,
      radius: 12,
      maxRadius: 380,
      speed: 3.2,
      color: color || (Math.random() > 0.5 ? '#00f2fe' : '#ffb703'),
      alpha: 0.85,
    });
  }, []);

  // Interactive Concert Beat Drop: Spawns laser sweeps, shockwaves & neon sparks
  const triggerConcertBeat = useCallback((originX = null, originY = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const x = originX !== null ? originX : w * 0.5;
    const y = originY !== null ? originY : h * 0.82;

    // Play DJ turntable scratch & sub-bass kick
    soundController.playVinylScratch();
    setIsBeating(true);
    setTimeout(() => setIsBeating(false), 500);

    // 1. Triple Expanding Neon Soundwave Shockwaves
    for (let r = 0; r < 3; r++) {
      soundwavesRef.current.push({
        x,
        y,
        radius: 10 + r * 20,
        maxRadius: 450 + r * 90,
        speed: 5.5 + r * 2.0,
        color: r % 2 === 0 ? '#00f2fe' : '#ffb703',
        alpha: 1.0,
      });
    }

    // 2. High-Energy Laser Flash Beams from click point
    for (let b = 0; b < 6; b++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      burstBeamsRef.current.push({
        ox: x,
        oy: y,
        angle,
        length: Math.max(w, h) * 1.2,
        color: b % 2 === 0 ? '#00f2fe' : '#ffb703',
        alpha: 0.9,
        fadeRate: 0.035,
        width: 14 + Math.random() * 16,
      });
    }

    // 3. Electric Neon Sparks Explosion
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 2 + Math.random() * 3.5,
        color: Math.random() > 0.5 ? '#00f2fe' : '#ffb703',
        alpha: 1.0,
        fadeRate: 0.016 + Math.random() * 0.015,
      });
    }
  }, []);

  // Main 60fps Canvas Loop: Stage Light Beams, Neon Soundwave Ripples & EQ Wave
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

    // Automatic festival beat pulse every 720ms (125 BPM house music tempo)
    const startBeatTimer = () => {
      beatTimerRef.current = setInterval(() => {
        if (canvasRef.current) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          // Radiate from DJ console area
          spawnBeatWave(w * 0.5, h * 0.82);
        }
      }, 720);
    };
    startBeatTimer();

    let startTime = performance.now();

    const animate = (timestamp) => {
      const time = (timestamp - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const isDesktop = w >= 768;

      // =========================================================================
      // 1. VOLUMETRIC STAGE LIGHT BEAMS & OUTDOOR FESTIVAL LASER SWEEPS (DESKTOP)
      // =========================================================================
      if (isDesktop) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // Stage projector anchors (DJ Booth & sound tower speakers)
        const projectors = [
          { ox: w * 0.38, oy: h * 0.88, color: 'rgba(0, 242, 254,', baseAngle: -Math.PI / 2 - 0.25, speed: 0.7, spread: 0.35, width: 70 },
          { ox: w * 0.62, oy: h * 0.88, color: 'rgba(255, 183, 3,', baseAngle: -Math.PI / 2 + 0.25, speed: 0.8, spread: 0.38, width: 75 },
          { ox: w * 0.50, oy: h * 0.90, color: 'rgba(0, 242, 254,', baseAngle: -Math.PI / 2, speed: 1.1, spread: 0.45, width: 55 },
          { ox: w * 0.28, oy: h * 0.92, color: 'rgba(168, 85, 247,', baseAngle: -Math.PI / 2 - 0.4, speed: 0.6, spread: 0.3, width: 60 },
          { ox: w * 0.72, oy: h * 0.92, color: 'rgba(255, 183, 3,', baseAngle: -Math.PI / 2 + 0.4, speed: 0.65, spread: 0.32, width: 65 },
        ];

        projectors.forEach((proj, idx) => {
          // Sweeping oscillation
          const currentAngle = proj.baseAngle + Math.sin(time * proj.speed + idx * 1.4) * proj.spread;
          const beamLen = Math.max(w, h) * 1.3;
          const tx = proj.ox + Math.cos(currentAngle) * beamLen;
          const ty = proj.oy + Math.sin(currentAngle) * beamLen;

          // Perpendicular vector for beam cone spread
          const perpX = -Math.sin(currentAngle) * proj.width;
          const perpY = Math.cos(currentAngle) * proj.width;

          // Volumetric cone gradient
          const grad = ctx.createLinearGradient(proj.ox, proj.oy, tx, ty);
          const pulseAlpha = 0.18 + Math.sin(time * 3 + idx) * 0.07;
          grad.addColorStop(0.0, `${proj.color} ${pulseAlpha * 1.4})`);
          grad.addColorStop(0.35, `${proj.color} ${pulseAlpha * 0.8})`);
          grad.addColorStop(0.7, `${proj.color} ${pulseAlpha * 0.3})`);
          grad.addColorStop(1.0, `${proj.color} 0)`);

          // Draw fan cone
          ctx.beginPath();
          ctx.moveTo(proj.ox, proj.oy);
          ctx.lineTo(tx - perpX, ty - perpY);
          ctx.lineTo(tx + perpX, ty + perpY);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          // Laser core line through the beam center
          ctx.beginPath();
          ctx.moveTo(proj.ox, proj.oy);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = `${proj.color} ${pulseAlpha * 1.8})`;
          ctx.lineWidth = 2.0;
          ctx.shadowColor = proj.color.includes('242') ? '#00f2fe' : '#ffb703';
          ctx.shadowBlur = 12;
          ctx.stroke();
        });

        // Click-burst laser beams
        burstBeamsRef.current = burstBeamsRef.current.filter((b) => {
          b.alpha -= b.fadeRate;
          if (b.alpha <= 0) return false;

          const tx = b.ox + Math.cos(b.angle) * b.length;
          const ty = b.oy + Math.sin(b.angle) * b.length;
          const perpX = -Math.sin(b.angle) * b.width * b.alpha;
          const perpY = Math.cos(b.angle) * b.width * b.alpha;

          const grad = ctx.createLinearGradient(b.ox, b.oy, tx, ty);
          const colorPrefix = b.color === '#00f2fe' ? 'rgba(0, 242, 254,' : 'rgba(255, 183, 3,';
          grad.addColorStop(0.0, `${colorPrefix} ${b.alpha * 0.8})`);
          grad.addColorStop(0.5, `${colorPrefix} ${b.alpha * 0.3})`);
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
      // 2. CONCENTRIC NEON SOUNDWAVE RIPPLES (PERSPECTIVE-MATCHED STREET PULSE)
      // =========================================================================
      ctx.save();
      soundwavesRef.current = soundwavesRef.current.filter((wave) => {
        wave.radius += wave.speed;
        wave.alpha -= 0.009;

        if (wave.alpha > 0 && wave.radius < wave.maxRadius) {
          ctx.beginPath();
          // Elliptical perspective to align with the street ground plane
          ctx.ellipse(wave.x, wave.y, wave.radius, wave.radius * 0.42, 0, 0, Math.PI * 2);
          ctx.strokeStyle = wave.color;
          ctx.lineWidth = 2.2;
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
      // 3. DYNAMIC STREET FESTIVAL EQ FREQUENCY WAVE
      // =========================================================================
      if (isDesktop) {
        ctx.save();
        const eqY = h * 0.77;
        const waveStartX = w * 0.15;
        const waveEndX = w * 0.85;
        const waveLen = waveEndX - waveStartX;
        const beatMultiplier = 1.0 + Math.sin(time * 8.7) * 0.35; // pulses to the 125 BPM beat

        // Glowing EQ frequency wave path
        ctx.beginPath();
        for (let x = 0; x <= waveLen; x += 6) {
          const currentX = waveStartX + x;
          const normX = x / waveLen;
          // Windowing function (dampens edges so wave is zero at ends)
          const envelope = Math.sin(normX * Math.PI);

          const harmonic1 = Math.sin(x * 0.02 + time * 4.2) * 14;
          const harmonic2 = Math.cos(x * 0.045 - time * 3.5) * 8;
          const harmonic3 = Math.sin(x * 0.08 + time * 6.0) * 4;
          const offset = (harmonic1 + harmonic2 + harmonic3) * envelope * beatMultiplier;

          if (x === 0) {
            ctx.moveTo(currentX, eqY + offset);
          } else {
            ctx.lineTo(currentX, eqY + offset);
          }
        }

        // Dual neon stroke (Cyan core with Amber outer glow)
        const eqGradient = ctx.createLinearGradient(waveStartX, eqY, waveEndX, eqY);
        eqGradient.addColorStop(0.0, 'rgba(0, 242, 254, 0)');
        eqGradient.addColorStop(0.2, 'rgba(0, 242, 254, 0.7)');
        eqGradient.addColorStop(0.5, 'rgba(255, 183, 3, 0.85)');
        eqGradient.addColorStop(0.8, 'rgba(0, 242, 254, 0.7)');
        eqGradient.addColorStop(1.0, 'rgba(0, 242, 254, 0)');

        ctx.strokeStyle = eqGradient;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.75;
        ctx.stroke();
        ctx.restore();
      }

      // =========================================================================
      // 4. FLOATING NEON FESTIVAL SPARKS
      // =========================================================================
      // Ambient spark spawner (drifting upward from DJ booth)
      if (Math.random() < 0.25 && sparksRef.current.length < 45) {
        sparksRef.current.push({
          x: w * (0.35 + Math.random() * 0.3),
          y: h * (0.8 + Math.random() * 0.15),
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(1.0 + Math.random() * 2.0),
          size: 1.5 + Math.random() * 2.5,
          color: Math.random() > 0.5 ? '#00f2fe' : '#ffb703',
          alpha: 0.9,
          fadeRate: 0.007 + Math.random() * 0.008,
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
        {/* Desktop Screen (md and wider): Native 16:9 Widescreen Artwork fitting the desktop viewport 100% */}
        <img
          src="/background-desktop.jpg"
          alt="ELIXORA 2.0 Festival Background"
          className="hidden md:block w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04]"
        />

        {/* Mobile Screen (< md): Native Portrait Cover */}
        <img
          src="/background-mobile.jpg"
          alt="ELIXORA 2.0 Festival Background"
          className="block md:hidden w-full h-full object-cover object-[center_20%] filter brightness-[1.02] contrast-[1.04]"
        />

        {/* Subtle Dark Vignette: Keeps Navbar & Lower Content Crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/60 via-transparent to-obsidian-950/80 pointer-events-none" />

        {/* Dynamic Festival Stage Light Flash on Beat Trigger */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-cyan-500/15 via-amber-500/10 to-transparent pointer-events-none transition-opacity duration-300 ${
            isBeating ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* 2. Fullscreen Stage Lasers, Neon Soundwave Ripples & EQ Frequency Waves Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
