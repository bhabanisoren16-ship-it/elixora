import React, { useState, useEffect } from 'react';
import { 
  RealisticHome, 
  RealisticCalendar, 
  RealisticGraduationCap, 
  RealisticTicket 
} from './RealisticIcons';
import { scrollToTarget } from '../utils/smoothScroll';
import { soundController } from '../utils/audio';

export default function Navbar({ onOpenPass, hasGeneratedPass }) {
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset || window.scrollY || 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || window.scrollY || 0;

          // Ignore negative overscroll on iOS bounce
          if (currentScrollY < 0) {
            ticking = false;
            return;
          }

          // Near top: always keep navbar fully visible
          if (currentScrollY <= 25) {
            setIsScrolledDown(false);
          } else {
            const scrollDifference = currentScrollY - lastScrollY;
            // Scroll down threshold: user scrolled down by more than 8px
            if (scrollDifference > 8 && currentScrollY > 50) {
              setIsScrolledDown(true);
            } 
            // Scroll up threshold: user scrolled up by more than 8px
            else if (scrollDifference < -8) {
              setIsScrolledDown(false);
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    soundController.playClick?.();
    if (href === '#hero') {
      setIsScrolledDown(false);
      scrollToTarget(0);
      if (window.location.hash) {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (err) {}
      }
    } else {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsScrolledDown(true);
      }
      scrollToTarget(href);
      try {
        history.replaceState(null, '', href);
      } catch (err) {}
    }
  };

  const navLinks = [
    { name: 'Home', shortName: 'Home', href: '#hero', icon: RealisticHome },
    { name: 'Event Details', shortName: 'Details', href: '#details', icon: RealisticCalendar },
    { name: 'Seniors', shortName: 'Seniors', href: '#seniors', icon: RealisticGraduationCap },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-8 py-2 sm:py-3 transition-all duration-300 ease-in-out will-change-transform ${
        isScrolledDown
          ? '-translate-y-full opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel bg-obsidian-950/85 border border-white/10 shadow-2xl backdrop-blur-xl px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between relative">
        
        {/* Brand Logo (Desktop left placeholder/brand) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="text-xs font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white tracking-widest uppercase">
            ELIXORA 2.0
          </span>
        </div>

        {/* Desktop Navigation Links: 100% Centered in Middle */}
        <nav className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center gap-1.5 lg:gap-2.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isSenior = link.name === 'Seniors';
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-2 group ${
                  isSenior
                    ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-sm" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Mobile View: Single Top Row with Brand on Left and Nav Links in Right Top Side */}
        <div className="flex md:hidden items-center justify-between gap-2 w-full">
          {/* Mobile Left: Brand or Pass Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {hasGeneratedPass ? (
              <button
                onClick={() => onOpenPass()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 border border-cyan-400/50 text-cyan-300 text-[10.5px] font-outfit font-bold shadow-neon-cyan"
              >
                <RealisticTicket className="w-3.5 h-3.5 shrink-0" />
                <span>VIP PASS</span>
              </button>
            ) : (
              <span className="text-[11px] font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-200 tracking-wider">
                ELIXORA 2.0
              </span>
            )}
          </div>

          {/* Mobile Right: Nav Links in Right Top Side */}
          <nav 
            data-lenis-prevent
            className="flex items-center gap-1 min-[360px]:gap-1.5 ml-auto shrink-0"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isSenior = link.name === 'Seniors';
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className={`px-2 py-1 rounded-lg text-[10.5px] min-[370px]:text-[11px] font-medium transition-all flex items-center gap-1 shrink-0 whitespace-nowrap active:scale-95 ${
                    isSenior
                      ? 'text-amber-300 bg-amber-500/15 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.25)] font-semibold'
                      : 'text-slate-300 hover:text-white bg-white/5 border border-white/10 active:bg-white/15'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 drop-shadow-sm" />
                  <span>{link.shortName || link.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Desktop Right Action Buttons */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Quick View Pass Button (If pass generated) */}
          {hasGeneratedPass && (
            <button
              onClick={() => onOpenPass()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-outfit font-bold hover:scale-105 transition-transform shadow-neon-cyan"
            >
              <RealisticTicket className="w-4 h-4 shrink-0" />
              <span>MY VIP PASS</span>
            </button>
          )}

          {/* Grab Pass CTA */}
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              soundController.playClick?.();
              scrollToTarget('#register');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-violet via-purple-600 to-cyber-cyan text-white text-xs sm:text-sm font-semibold hover:shadow-neon-violet hover:scale-[1.02] transition-all flex items-center gap-2 border border-white/20"
          >
            <RealisticTicket className="w-4 h-4 shrink-0" />
            <span>Grab Pass</span>
          </a>
        </div>
      </div>
    </header>
  );
}
