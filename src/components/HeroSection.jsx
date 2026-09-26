import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { soundController } from '../utils/audio';

export default function HeroSection({ onGrabPassClick }) {

  // Event target: October 24, 2026, 18:30:00 IST
  const targetDate = new Date('2026-10-24T18:30:00+05:30').getTime();

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
    <section id="hero" className="relative min-h-[90vh] sm:min-h-screen pt-24 sm:pt-28 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Transparent Hero Container so the artwork is 100% visible */}
      <div className="max-w-4xl mx-auto text-center relative z-10 p-2 sm:p-4">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-obsidian-950/80 border border-amber-500/50 text-amber-300 text-[11px] sm:text-xs font-outfit font-bold uppercase tracking-wider mb-2 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
          <span>Welcome Class of 26</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>

        {/* Title Container with Party Theme Styling */}
        <div className="relative my-2 select-none">
          {/* Ambient Multi-Neon Party Glow behind title */}
          <div className="absolute -inset-6 blur-3xl opacity-80 rounded-full pointer-events-none bg-gradient-to-r from-amber-500/35 via-rose-500/30 to-cyan-500/35 animate-pulse" />

          {/* Main Title: Exact font from user's image (Unbounded Black) */}
          <div className="relative my-1 select-none">
            <h1 className="font-unbounded font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white uppercase text-center leading-none transition-all duration-300 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] hover:scale-[1.01]">
              ELIXORA 2.0
            </h1>
          </div>

          {/* Subtext */}
          <div className="flex items-center justify-center gap-3 mt-3 mb-4">
            <span className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-cyan-400" />
            <p className="font-outfit text-xs sm:text-sm tracking-[0.25em] text-cyan-300 font-extrabold uppercase drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">
              FRESHERS '26
            </p>
            <span className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
        </div>

        {/* Real-time Countdown Timer Grid */}
        <div className="mt-5 mb-5 inline-grid grid-cols-4 gap-2 sm:gap-3 max-w-sm sm:max-w-md mx-auto w-full px-2">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-2 sm:p-2.5 rounded-xl bg-obsidian-950/50 backdrop-blur-lg border border-white/20 shadow-glass group hover:border-amber-400/60 hover:shadow-neon-gold transition-all duration-300"
            >
              <div className="font-outfit font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-300 tracking-wider">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-[10px] font-outfit font-bold tracking-widest text-amber-400">
                {item.label}
              </div>
              {/* Corner accents */}
              <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400/70" />
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              soundController.playClick();
              onGrabPassClick();
            }}
            className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-cyber-violet text-white font-outfit font-extrabold tracking-wide text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2.5 border border-white/20 group"
          >
            <span>GRAB YOUR PASS</span>
            <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href="#details"
            onClick={() => soundController.playClick()}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-obsidian-900/80 border border-white/20 text-slate-200 font-outfit font-semibold text-xs sm:text-sm hover:bg-white/10 hover:border-amber-400/40 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <span>Explore Event Guide</span>
          </a>
        </div>


      </div>
    </section>
  );
}
