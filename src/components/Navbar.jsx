import React, { useState, useEffect } from 'react';
import { 
  RealisticHome, 
  RealisticCalendar, 
  RealisticGraduationCap 
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
      className={`md:hidden fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2.5 transition-all duration-300 ease-in-out will-change-transform flex justify-end pointer-events-none ${
        isScrolledDown
          ? '-translate-y-full opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Floating Navigation Pill */}
      <nav
        aria-label="Main Navigation"
        data-lenis-prevent
        className="pointer-events-auto rounded-2xl glass-panel bg-obsidian-950/85 border border-white/10 shadow-2xl backdrop-blur-xl px-2 sm:px-3 py-1.5 flex items-center gap-1 sm:gap-2"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isSenior = link.name === 'Seniors';
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link.href)}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 group whitespace-nowrap active:scale-95 ${
                isSenior
                  ? 'text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.2)] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-sm" />
              <span className="hidden min-[370px]:inline">{link.name}</span>
              <span className="inline min-[370px]:hidden">{link.shortName || link.name}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
