import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { soundController } from '../utils/audio';
import { scrollToTarget } from '../utils/smoothScroll';
import { adminStore } from '../utils/adminStore';

const TITLE_LETTERS = [
  { char: 'E', color: 'from-white via-[#dcf7ff] to-[#38bdf8]' },
  { char: 'L', color: 'from-white via-[#e0f2fe] to-[#60a5fa]' },
  { char: 'I', color: 'from-white via-[#ede9fe] to-[#a78bfa]' },
  { char: 'X', color: 'from-white via-[#f3e8ff] to-[#c084fc]' },
  { char: 'O', color: 'from-white via-[#fae8ff] to-[#e879f9]' },
  { char: 'R', color: 'from-white via-[#fce7f3] to-[#f472b6]' },
  { char: 'A', color: 'from-white via-[#ffe4e6] to-[#fb7185]' },
  { char: ' ', isSpace: true },
  { char: '2', color: 'from-white via-[#fef3c7] to-[#f59e0b]' },
  { char: '.', color: 'from-white via-[#dcfce7] to-[#34d399]' },
  { char: '0', color: 'from-white via-[#e0e7ff] to-[#818cf8]' },
];

export default function HeroSection({ onGrabPassClick }) {
  const [settings, setSettings] = useState(() => adminStore.getSettings());
  const lettersRef = useRef([]);
  const titleContainerRef = useRef(null);

  // Trigger playful kinetic shake on a specific letter
  const shakeLetter = (idx) => {
    const el = lettersRef.current[idx];
    if (!el || el.dataset.isShaking === 'true') return;

    el.dataset.isShaking = 'true';
    soundController.playHover?.();

    const sx = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 4);
    const sy = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3);
    const sr = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 4);

    gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          if (el) el.dataset.isShaking = 'false';
        }, 90);
      },
    })
      .to(el, {
        x: sx,
        y: sy,
        rotation: sr,
        scale: 1.08,
        duration: 0.05,
        ease: 'power1.inOut',
      })
      .to(el, {
        x: -sx * 0.75,
        y: -sy * 0.75,
        rotation: -sr * 0.75,
        scale: 1.04,
        duration: 0.06,
        ease: 'power1.inOut',
      })
      .to(el, {
        x: sx * 0.35,
        y: -sy * 0.35,
        rotation: sr * 0.35,
        scale: 1.02,
        duration: 0.06,
      })
      .to(el, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.28,
        ease: 'elastic.out(1.2, 0.3)',
      });
  };

  // Proximity Detection: Shakes individual letters when cursor moves near them
  useEffect(() => {
    let ticking = false;
    const handleGlobalMouseMove = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (titleContainerRef.current) {
          const containerRect = titleContainerRef.current.getBoundingClientRect();
          // Gate check: only calculate letter distances if mouse is anywhere near the title banner
          if (
            mouseX >= containerRect.left - 120 &&
            mouseX <= containerRect.right + 120 &&
            mouseY >= containerRect.top - 90 &&
            mouseY <= containerRect.bottom + 90
          ) {
            lettersRef.current.forEach((el, idx) => {
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              const dist = Math.hypot(mouseX - centerX, mouseY - centerY);

              // Shakes when cursor is moved near letter (< 85px)
              if (dist < 85) {
                shakeLetter(idx);
              }
            });
          }
        }
        ticking = false;
      });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(adminStore.getSettings());
    };
    window.addEventListener('elixora_admin_update', handleUpdate);
    return () => window.removeEventListener('elixora_admin_update', handleUpdate);
  }, []);

  // Event target: dynamically synced with Admin Portal settings
  const targetDate = new Date(settings.eventDateIso || '2026-10-24T18:30:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="hero" className="relative min-h-[75vh] sm:min-h-[85vh] pt-20 sm:pt-24 pb-4 sm:pb-6 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Transparent Hero Container so the artwork is 100% visible */}
      <div className="max-w-4xl mx-auto text-center relative z-10 p-2 sm:p-4">
        
        {/* Title Container with Exact Official Logo Graphic */}
        <div className="relative my-1 sm:my-2 select-none flex flex-col items-center justify-center">
          {/* Main Title: Exact Luxury High-Contrast Serif Typography with Celestial Tint & Interactive Proximity Shake */}
          <div
            ref={titleContainerRef}
            className="relative my-1 select-none animate-hero-float flex items-center justify-center w-full px-2 py-1"
          >
            <h1 className="font-innovision-serif font-black text-4xl min-[380px]:text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] tracking-[0.06em] sm:tracking-[0.09em] md:tracking-[0.12em] uppercase whitespace-nowrap leading-none flex items-baseline justify-center">
              {TITLE_LETTERS.map((item, idx) => {
                if (item.isSpace) {
                  return (
                    <span
                      key={idx}
                      className="inline-block w-2.5 sm:w-5 md:w-7 select-none"
                      aria-hidden="true"
                    >
                      &nbsp;
                    </span>
                  );
                }
                return (
                  <span
                    key={idx}
                    ref={(el) => (lettersRef.current[idx] = el)}
                    onMouseEnter={() => shakeLetter(idx)}
                    onClick={() => shakeLetter(idx)}
                    className={`inline-block transition-transform duration-75 will-change-transform bg-gradient-to-b ${item.color} bg-clip-text text-transparent drop-shadow-[0_6px_35px_rgba(0,0,0,0.98)] drop-shadow-[0_0_25px_rgba(255,255,255,0.22)] cursor-pointer select-none`}
                    style={{ transformOrigin: '50% 70%' }}
                    title={item.char}
                  >
                    {item.char}
                  </span>
                );
              })}
            </h1>
          </div>

          {/* Highlighted Subtitle (Clean without neon glow) */}
          <div className="relative flex items-center justify-center gap-2.5 sm:gap-4 mt-2 sm:mt-2.5 mb-1 sm:mb-2 select-none">
            {/* Left Accent Laser Beam */}
            <span className="hidden xs:block h-[2px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-300 shadow-[0_0_10px_#00e5ff]" />
            
            <h2 className="font-outfit text-xs sm:text-sm md:text-base tracking-[0.20em] sm:tracking-[0.28em] font-black uppercase flex items-center gap-1.5 sm:gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-300 to-teal-300">
                BIOTECHNOLOGY
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 via-pink-300 to-purple-300">
                FRESHERS
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400">
                '26
              </span>
            </h2>

            {/* Right Accent Laser Beam */}
            <span className="hidden xs:block h-[2px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-amber-400 to-orange-400 shadow-[0_0_10px_#fbbf24]" />
          </div>
        </div>

        {/* Real-time Countdown Timer Grid */}
        <div className="mt-2.5 sm:mt-4 mb-3 sm:mb-4 inline-grid grid-cols-4 gap-2 sm:gap-3 max-w-xs sm:max-w-md mx-auto w-full px-2">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-2 sm:p-2.5 rounded-xl bg-obsidian-950/50 backdrop-blur-lg border border-white/20 shadow-glass group hover:border-cyan-400/60 hover:-translate-y-1 hover:shadow-neon-cyan transition-all duration-300"
            >
              <div className="font-outfit font-extrabold text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 tracking-wider">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-[10px] font-outfit font-bold tracking-widest text-cyan-300">
                {item.label}
              </div>
              {/* Corner accents */}
              <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-cyan-400/80 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 mt-1 sm:mt-2">
          <button
            onClick={() => {
              soundController.playClick();
              onGrabPassClick();
            }}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white font-outfit font-extrabold tracking-wide text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2.5 border border-white/20 group shimmer-shine"
          >
            <span>GRAB YOUR PASS</span>
            <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href="#details"
            onClick={(e) => {
              e.preventDefault();
              soundController.playClick();
              scrollToTarget('#details');
            }}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-obsidian-900/80 border border-white/20 text-slate-200 font-outfit font-semibold text-xs sm:text-sm hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-300 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <span>Explore Event Guide</span>
          </a>
        </div>


      </div>
    </section>
  );
}
