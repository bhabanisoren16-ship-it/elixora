import React from 'react';
import { Ticket, Compass, Calendar, Palette, GraduationCap, Home } from 'lucide-react';
import { scrollToTarget } from '../utils/smoothScroll';

export default function Navbar({ onOpenPass, hasGeneratedPass }) {

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    if (href === '#hero') {
      scrollToTarget(0);
      if (window.location.hash) {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (err) {}
      }
    } else {
      scrollToTarget(href);
      try {
        history.replaceState(null, '', href);
      } catch (err) {}
    }
  };

  const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Event Details', href: '#details', icon: Calendar },
    { name: 'Dress Code', href: '#dress-code', icon: Palette },
    { name: 'Venue & Guide', href: '#venue', icon: Compass },
    { name: 'Seniors', href: '#seniors', icon: GraduationCap },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel bg-obsidian-950/85 border border-white/10 shadow-2xl backdrop-blur-xl px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        
        {/* Brand Logo (Hidden per user request) */}
        <a href="#hero" className="hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-cyber-violet p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <div className="w-full h-full bg-obsidian-900 rounded-[10px] flex items-center justify-center">
              <span className="font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-200 text-lg">
                E
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-outfit font-extrabold text-base sm:text-xl tracking-wider text-white">
                ELIXORA 2.0
              </span>
              <span className="text-[10px] font-outfit px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold">
                '26
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-outfit tracking-widest hidden sm:block uppercase">
              Biotechnology Freshers '26
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isSenior = link.name === 'Seniors';
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isSenior
                    ? 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSenior ? 'text-cyan-400' : 'text-cyber-cyan opacity-80'}`} />
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Mobile Top Row: Action Controls */}
        <div className="flex md:hidden items-center justify-between gap-2 w-full pb-1.5 border-b border-white/10">
          {/* Quick View Pass Button (If pass generated) */}
          {hasGeneratedPass ? (
            <button
              onClick={() => onOpenPass()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 border border-cyan-400/50 text-cyan-300 text-[11px] font-outfit font-bold shadow-neon-cyan"
            >
              <Ticket className="w-3 h-3" />
              <span>VIP PASS</span>
            </button>
          ) : (
            <span className="text-[11px] font-outfit font-bold text-cyan-300 tracking-wider">
              ELIXORA 2.0
            </span>
          )}

          {/* Grab Pass CTA */}
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#register');
            }}
            className="ml-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyber-violet via-purple-600 to-cyber-cyan text-white text-[11px] font-bold hover:shadow-neon-violet transition-all flex items-center gap-1.5 border border-white/20"
          >
            <Ticket className="w-3.5 h-3.5 text-cyan-200" />
            <span>Grab Pass</span>
          </a>
        </div>

        {/* Mobile Navigation Links Row (Directly visible at Top View in Mobile) */}
        <nav 
          data-lenis-prevent
          className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 scroll-smooth"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isSenior = link.name === 'Seniors';
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  isSenior
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.25)] font-semibold'
                    : 'text-slate-300 hover:text-white bg-white/5 border border-white/10 active:bg-white/15'
                }`}
              >
                <Icon className={`w-3 h-3 ${isSenior ? 'text-cyan-400' : 'text-cyber-cyan'}`} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Quick View Pass Button (If pass generated) */}
          {hasGeneratedPass && (
            <button
              onClick={() => onOpenPass()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-outfit font-bold hover:scale-105 transition-transform shadow-neon-cyan"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>MY VIP PASS</span>
            </button>
          )}

          {/* Grab Pass CTA */}
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#register');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-violet via-purple-600 to-cyber-cyan text-white text-xs sm:text-sm font-semibold hover:shadow-neon-violet hover:scale-[1.02] transition-all flex items-center gap-1.5 border border-white/20"
          >
            <Ticket className="w-3.5 h-3.5 text-cyan-200" />
            <span>Grab Pass</span>
          </a>
        </div>
      </div>
    </header>
  );
}
