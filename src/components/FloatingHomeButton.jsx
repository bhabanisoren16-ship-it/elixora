import React, { useState, useEffect } from 'react';
import { ArrowUp, Home } from 'lucide-react';
import { soundController } from '../utils/audio';

export default function FloatingHomeButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero section (~350px)
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHome = () => {
    soundController.playClick?.();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Clear URL hash to keep URL clean
    if (window.location.hash) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {}
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-300"
      aria-label="Back to top and home page"
    >
      <button
        type="button"
        onClick={scrollToHome}
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-obsidian-950/85 hover:bg-obsidian-900 border border-white/20 hover:border-amber-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.25)] hover:shadow-neon-gold backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-slate-200 hover:text-white"
        title="Quick jump to Home Page (Top)"
      >
        <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:bg-amber-500/30 transition-colors">
          <ArrowUp className="w-3.5 h-3.5 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
        </div>
        <span className="text-xs font-outfit font-extrabold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-cyan-200">
          Home
        </span>
      </button>
    </aside>
  );
}
