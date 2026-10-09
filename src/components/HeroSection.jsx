import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { soundController } from '../utils/audio';
import { scrollToTarget } from '../utils/smoothScroll';
import { adminStore } from '../utils/adminStore';

export default function HeroSection({ onGrabPassClick }) {
  const [settings, setSettings] = useState(() => adminStore.getSettings());

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
        
        <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-200 text-[11px] sm:text-xs font-outfit font-bold uppercase tracking-wider mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(0,229,255,0.25)] backdrop-blur-md">
          <span>Welcome Biotechnology Freshers '26</span>
        </div>

        {/* Title Container with Exact Official Logo Graphic */}
        <div className="relative my-1 sm:my-2 select-none flex flex-col items-center justify-center">
          {/* Main Title Graphic: 100% Exact Typography from Official Artwork */}
          <div className="relative my-0.5 select-none animate-hero-float flex items-center justify-center w-full px-2">
            <h1 className="sr-only">ELIXORA 2.0</h1>
            <img
              src="/elixora-title.png"
              alt="ELIXORA 2.0"
              className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto object-contain mx-auto transition-transform duration-300 hover:scale-[1.02] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]"
              loading="eager"
              decoding="sync"
            />
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
            <span>GRAB SENIOR PASS</span>
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
