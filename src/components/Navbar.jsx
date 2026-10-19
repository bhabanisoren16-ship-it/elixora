import React, { useState, useEffect, useRef } from 'react';
import { 
  RealisticHome, 
  RealisticCalendar, 
  RealisticGraduationCap,
  RealisticTicket
} from './RealisticIcons';
import { scrollToTarget } from '../utils/smoothScroll';
import { soundController } from '../utils/audio';
import { scrambleText } from '../innovission/scrambleText';

export default function Navbar({ onOpenPass, hasGeneratedPass }) {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);
  const [activeSection, setActiveSection] = useState('HOME');
  const mobileMenuRef = useRef(null);

  // Synchronize active section with scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollY = window.pageYOffset || window.scrollY || 0;
      const detailsEl = document.getElementById('details');
      const seniorsEl = document.getElementById('seniors');

      const detailsTop = detailsEl ? detailsEl.offsetTop - 300 : 999999;
      const seniorsTop = seniorsEl ? seniorsEl.offsetTop - 300 : 999999;

      if (scrollY >= seniorsTop) {
        setActiveSection('SENIORS');
      } else if (scrollY >= detailsTop) {
        setActiveSection('EVENT DETAILS');
      } else {
        setActiveSection('HOME');
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

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

  // Close mobile menu on outside tap or Escape key press
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when user scrolls down
  useEffect(() => {
    if (isScrolledDown && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isScrolledDown, mobileMenuOpen]);

  // Close mobile menu when viewport expands to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavLinkClick = (e, href, name) => {
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
    { name: 'HOME', shortName: 'HOME', href: '#hero', icon: RealisticHome },
    { name: 'EVENT DETAILS', shortName: 'DETAILS', href: '#details', icon: RealisticCalendar },
    { name: 'SENIORS', shortName: 'SENIORS', href: '#seniors', icon: RealisticGraduationCap },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all duration-300 ease-in-out will-change-transform flex justify-end md:justify-center pointer-events-none ${
        isScrolledDown
          ? '-translate-y-full opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* 1. Mobile View Only: Cybernetic Menu Bar Button & Floating Dropdown (Top Right Side) */}
      <div 
        ref={mobileMenuRef}
        data-lenis-prevent
        className="flex md:hidden relative flex-col items-end pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => {
            soundController.playClick?.();
            setMobileMenuOpen((prev) => !prev);
          }}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu bar"
          className={`px-3 py-1.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] active:scale-95 cursor-pointer ${
            mobileMenuOpen
              ? 'bg-obsidian-950/90 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              : 'bg-obsidian-950/70 hover:bg-obsidian-900/90 border-white/20 hover:border-cyan-400/40'
          }`}
        >
          <span className="text-[11px] font-outfit font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-sky-300">
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </span>

          {/* 3 Animated Menu Bars (Transforms smoothly to 'X' when open) */}
          <div className="w-4 h-3.5 flex flex-col justify-between items-center relative shrink-0">
            <span
              className={`w-4 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                  ? 'rotate-45 translate-y-[5px] bg-cyan-400 shadow-[0_0_8px_#00f2fe]'
                  : 'bg-cyan-300'
              }`}
            />
            <span
              className={`w-4 h-0.5 rounded-full bg-white transition-all duration-200 ease-in-out ${
                mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span
              className={`w-4 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                  ? '-rotate-45 -translate-y-[5px] bg-cyan-400 shadow-[0_0_8px_#00f2fe]'
                  : 'bg-cyan-300'
              }`}
            />
          </div>
        </button>

        {/* Mobile Dropdown Panel: All 3 Buttons */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="absolute top-full right-0 mt-2 w-52 rounded-2xl bg-[#07090e]/95 border border-white/20 backdrop-blur-2xl p-2 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(6,182,212,0.2)] flex flex-col gap-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isSelected = activeSection === link.name || activeBtn === link.name;
              const isSenior = link.name === 'SENIORS';
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onPointerDown={() => setActiveBtn(link.name)}
                  onClick={(e) => {
                    setActiveSection(link.name);
                    setActiveBtn(link.name);
                    handleNavLinkClick(e, link.href, link.name);
                    setMobileMenuOpen(false);
                    const textEl = e.currentTarget.querySelector('[data-scr]');
                    if (textEl) scrambleText(textEl, link.name, { duration: 0.38 });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 active:scale-95 group border ${
                    isSelected
                      ? isSenior
                        ? 'text-amber-300 border-amber-400 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                        : 'text-white border-[#c084fc] bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : isSenior
                      ? 'text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                      : 'text-white/90 hover:text-white hover:bg-white/10 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-sm" />
                  <span data-scr data-text={link.name} className="inline-block select-none">{link.name}</span>
                </a>
              );
            })}

            {/* Quick View VIP Pass Button (If pass has been generated) */}
            {hasGeneratedPass && (
              <button
                type="button"
                onClick={() => {
                  soundController.playClick?.();
                  setMobileMenuOpen(false);
                  onOpenPass?.();
                }}
                className="w-full mt-0.5 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30 border border-cyan-400/50 text-cyan-300 shadow-neon-cyan flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <RealisticTicket className="w-4 h-4 shrink-0" />
                <span>MY VIP PASS</span>
              </button>
            )}
          </nav>
        )}
      </div>

      {/* 2. Desktop View Only: Centered Floating Transparent Navigation Pill (All 3 Buttons) */}
      <nav
        aria-label="Desktop Navigation"
        data-lenis-prevent
        className="hidden md:flex pointer-events-auto rounded-2xl bg-transparent border border-white/20 backdrop-blur-md px-2 sm:px-3 py-1.5 items-center gap-1 sm:gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isSelected = activeSection === link.name || activeBtn === link.name;
          const isSenior = link.name === 'SENIORS';
          return (
            <a
              key={link.name}
              href={link.href}
              onPointerDown={() => setActiveBtn(link.name)}
              onMouseEnter={(e) => {
                soundController.playHover?.();
                const textEl = e.currentTarget.querySelector('[data-scr]');
                if (textEl) {
                  scrambleText(textEl, link.name, { duration: 0.38 });
                }
              }}
              onClick={(e) => {
                setActiveSection(link.name);
                setActiveBtn(link.name);
                handleNavLinkClick(e, link.href, link.name);
                const textEl = e.currentTarget.querySelector('[data-scr]');
                if (textEl) {
                  scrambleText(textEl, link.name, { duration: 0.38 });
                }
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 group whitespace-nowrap active:scale-95 border ${
                isSelected
                  ? isSenior
                    ? 'text-amber-300 border-amber-400 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                    : 'text-white border-[#c084fc] bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : isSenior
                  ? 'text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                  : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-sm" />
              <span data-scr data-text={link.name} className="inline-block select-none">{link.name}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
