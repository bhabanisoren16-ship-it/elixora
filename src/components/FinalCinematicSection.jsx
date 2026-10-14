import React, { useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, Film, Ticket } from 'lucide-react';
import { scrollToTarget } from '../utils/smoothScroll';
import MagneticButton from './MagneticButton';
import { RealisticTicket } from './RealisticIcons';

/**
 * FinalCinematicSection: Climax Section of the website
 * Headline: "YOUR NIGHT. YOUR PEOPLE. YOUR ELIXORA."
 * Features:
 * - Dramatic cinematic mask animation
 * - Controlled festive burst of neon cyan, violet, and gold confetti
 * - Final magnetic VIP Registration CTA
 * - Replay Cinematic Opening Sequence button
 */
export default function FinalCinematicSection({ onReplayIntro, onRegisterClick }) {
  const sectionRef = useRef(null);
  const hasTriggeredConfettiRef = useRef(false);

  // Trigger celebratory confetti when climax section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredConfettiRef.current) {
            hasTriggeredConfettiRef.current = true;
            try {
              confetti({
                particleCount: 65,
                spread: 75,
                origin: { y: 0.75 },
                colors: ['#00e5ff', '#c084fc', '#facc15', '#ffffff', '#38bdf8'],
                disableForReducedMotion: true,
              });
            } catch (err) {}
          }
        });
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleConfettiBlast = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#00e5ff', '#c084fc', '#facc15', '#ffffff', '#f43f5e'],
      });
    } catch (e) {}
  };

  return (
    <section
      ref={sectionRef}
      id="climax"
      className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 text-center overflow-hidden"
    >
      {/* Volumetric Climax Stage Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/20 to-pink-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Top Accent Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-300 text-xs font-outfit font-extrabold tracking-[0.25em] uppercase mb-6 sm:mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>THE CLIMAX OF FRESHERS '26</span>
      </div>

      {/* Climax Headline: "YOUR NIGHT. YOUR PEOPLE. YOUR ELIXORA." */}
      <div className="relative my-4 select-none">
        <h2 className="font-outfit font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          YOUR NIGHT.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300">
            YOUR PEOPLE.
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-400">
            YOUR ELIXORA.
          </span>
        </h2>

        {/* Ambient Horizontal Neon Sweep */}
        <div className="h-[2px] w-64 sm:w-96 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 shadow-[0_0_15px_#00e5ff]" />
      </div>

      {/* Subheading Narrative */}
      <p className="mt-4 sm:mt-6 text-white max-w-2xl mx-auto text-sm sm:text-lg font-outfit font-bold subheading-readable tracking-wide leading-relaxed">
        This is the chapter that starts your college legend. Secure your entry pass, step through the arches, and celebrate with the people who will define your next four years.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-lg mx-auto">
        
        {/* Primary Magnetic CTA */}
        <MagneticButton
          onClick={() => {
            handleConfettiBlast();
            if (onRegisterClick) {
              onRegisterClick();
            } else {
              scrollToTarget('#register');
            }
          }}
          className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white font-outfit font-black text-sm sm:text-base tracking-wider shadow-[0_0_35px_rgba(6,182,212,0.65)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 border border-white/30 group cursor-pointer"
        >
          <RealisticTicket className="w-5 h-5 shrink-0" />
          <span>CLAIM YOUR VIP PASS</span>
          <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1.5 transition-transform" />
        </MagneticButton>

        {/* Replay Cinematic Intro Button */}
        {onReplayIntro && (
          <button
            onClick={() => {
              onReplayIntro();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-outfit font-bold text-xs sm:text-sm tracking-wider transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
          >
            <Film className="w-4 h-4 text-purple-400" />
            <span>Replay Cinematic Intro</span>
          </button>
        )}
      </div>

      {/* Official Footnote */}
      <div className="mt-14 sm:mt-20 pt-8 border-t border-white/10 text-xs text-slate-400 font-outfit">
        <p className="tracking-wider uppercase font-semibold">
          ELIXORA 2.0 • The Official Biotechnology Freshers' Night '26
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Crafted with passion for the Batch of '26 • All Rights Reserved
        </p>
      </div>
    </section>
  );
}
