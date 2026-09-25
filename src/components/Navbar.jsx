import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Ticket, Menu, X, Compass, Calendar, Palette } from 'lucide-react';
import { soundController } from '../utils/audio';

export default function Navbar({ onOpenPass, hasGeneratedPass }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const playing = soundController.toggleAmbient();
    setIsPlayingAudio(playing);
    soundController.playClick();
  };

  const navLinks = [
    { name: 'Overview', href: '#hero', icon: Sparkles },
    { name: 'Event Details', href: '#details', icon: Calendar },
    { name: 'Dress Code', href: '#dress-code', icon: Palette },
    { name: 'Venue & Guide', href: '#venue', icon: Compass },
    { name: 'Get Pass', href: '#register', icon: Ticket, highlight: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel bg-obsidian-950/80 border border-white/10 shadow-2xl backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group" onClick={() => soundController.playClick()}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            <div className="w-full h-full bg-obsidian-900 rounded-[10px] flex items-center justify-center">
              <span className="font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-cyan-300 text-lg">
                E
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-outfit font-extrabold text-base sm:text-xl tracking-wider text-white">
                ELIXORA 2.0
              </span>
              <span className="text-[10px] font-outfit px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                '26
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-outfit tracking-widest hidden sm:block uppercase">
              Freshers' Festival
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            if (link.highlight) return null;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => soundController.playClick()}
                className="px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
              >
                <Icon className="w-3.5 h-3.5 text-cyber-cyan opacity-80" />
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={isPlayingAudio ? "Mute Ambient Synth" : "Play Cyber Ambient Synth"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
              isPlayingAudio
                ? 'bg-cyber-cyan/15 border-cyber-cyan/60 text-cyber-cyan shadow-neon-cyan'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-cyber-cyan" />
                <span className="hidden sm:inline">LIVE AUDIO</span>
                <span className="flex items-end gap-0.5 h-3 w-3">
                  <span className="w-0.5 bg-cyber-cyan rounded animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-cyber-cyan rounded animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-cyber-cyan rounded animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline">AUDIO FX</span>
              </>
            )}
          </button>

          {/* Quick View Pass Button (If pass generated) */}
          {hasGeneratedPass && (
            <button
              onClick={() => {
                soundController.playClick();
                onOpenPass();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyber-gold/20 to-amber-500/20 border border-cyber-gold/50 text-cyber-gold text-xs font-outfit font-bold hover:scale-105 transition-transform shadow-neon-gold"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>MY VIP PASS</span>
            </button>
          )}

          {/* Grab Pass CTA */}
          <a
            href="#register"
            onClick={() => soundController.playClick()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-violet via-purple-600 to-cyber-cyan text-white text-xs sm:text-sm font-semibold hover:shadow-neon-violet hover:scale-[1.02] transition-all flex items-center gap-1.5 border border-white/20"
          >
            <Ticket className="w-3.5 h-3.5 text-cyan-200" />
            <span className="hidden xs:inline">Grab Pass</span>
            <span className="xs:hidden">Pass</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl glass-panel bg-obsidian-950/95 border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  soundController.playClick();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5"
              >
                <Icon className="w-4 h-4 text-cyber-cyan" />
                {link.name}
              </a>
            );
          })}
          {hasGeneratedPass && (
            <button
              onClick={() => {
                soundController.playClick();
                setMobileMenuOpen(false);
                onOpenPass();
              }}
              className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyber-gold/20 to-amber-500/20 border border-cyber-gold/50 text-cyber-gold text-xs font-outfit font-bold flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              VIEW MY VIP PASS
            </button>
          )}
        </div>
      )}
    </header>
  );
}
