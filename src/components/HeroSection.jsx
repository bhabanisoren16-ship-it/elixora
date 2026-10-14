import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { soundController } from '../utils/audio';
import { scrollToTarget } from '../utils/smoothScroll';
import { adminStore } from '../utils/adminStore';
import ThreeChromeHero from './ThreeChromeHero';
import EventCountdown from './EventCountdown';
import MagneticButton from './MagneticButton';
import { RealisticTicket } from './RealisticIcons';

export default function HeroSection({ onGrabPassClick }) {
  const [settings, setSettings] = useState(() => adminStore.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(adminStore.getSettings());
    };
    window.addEventListener('elixora_admin_update', handleUpdate);
    return () => window.removeEventListener('elixora_admin_update', handleUpdate);
  }, []);

  return (
    <section id="hero" className="relative min-h-[85vh] sm:min-h-[92vh] pt-16 sm:pt-20 pb-8 sm:pb-12 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* 3D Interactive Chrome Centerpiece (Three.js WebGL Layer) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-80">
        <ThreeChromeHero />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-5xl mx-auto text-center relative z-10 p-2 sm:p-4 flex flex-col items-center">
        
        {/* Title Container with Exact Official Logo Graphic & 3D Lighting Accent */}
        <div className="relative my-1 sm:my-2 select-none flex flex-col items-center justify-center w-full">
          
          {/* Main Title Graphic: Official ELIXORA 2.0 Typography */}
          <div className="relative my-0.5 select-none animate-hero-float flex items-center justify-center w-full px-2">
            <h1 className="sr-only">ELIXORA 2.0 - Biotechnology Freshers '26</h1>
            <img
              src="/elixora-title.png"
              alt="ELIXORA 2.0"
              className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto object-contain mx-auto transition-transform duration-300 hover:scale-[1.02] drop-shadow-[0_8px_35px_rgba(0,0,0,0.95)]"
              loading="eager"
              decoding="sync"
            />
          </div>

          {/* Subtitle with Prismatic Laser Accents */}
          <div className="relative flex items-center justify-center gap-2.5 sm:gap-4 mt-2 sm:mt-3 mb-2 select-none">
            {/* Left Accent Laser Beam */}
            <span className="hidden xs:block h-[2px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-300 shadow-[0_0_10px_#00e5ff]" />
            
            <h2 className="font-outfit text-xs sm:text-sm md:text-base tracking-[0.22em] sm:tracking-[0.3em] font-black uppercase flex items-center gap-1.5 sm:gap-2">
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

          {/* Tagline: A Night to Remember */}
          <p className="font-outfit text-xs sm:text-sm md:text-base font-extrabold text-slate-300 tracking-[0.25em] uppercase mt-0.5 mb-3 text-glow-violet">
            A Night to Remember
          </p>
        </div>

        {/* Live Neon Event Countdown Display */}
        <div className="w-full my-3 sm:my-5">
          <EventCountdown />
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-4 w-full max-w-md">
          {/* Magnetic Primary CTA: GRAB YOUR PASS */}
          <MagneticButton
            onClick={() => {
              soundController.playClick?.();
              onGrabPassClick();
            }}
            className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white font-outfit font-black tracking-wide text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2.5 border border-white/20 group shimmer-shine"
          >
            <RealisticTicket className="w-4 h-4 shrink-0" />
            <span>GRAB YOUR PASS</span>
            <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>

          {/* Secondary CTA: Explore Event Guide */}
          <a
            href="#details"
            onClick={(e) => {
              e.preventDefault();
              soundController.playClick?.();
              scrollToTarget('#details');
            }}
            className="w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-obsidian-900/85 border border-white/20 text-slate-200 hover:text-white font-outfit font-bold text-xs sm:text-sm hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-300 transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-md"
          >
            <span>Explore Event Guide</span>
          </a>
        </div>
      </div>
    </section>
  );
}
