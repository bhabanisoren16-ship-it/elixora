import React from 'react';
import { 
  Music, 
  Sparkles, 
  Crown, 
  Gamepad2, 
  Shirt, 
  MapPin, 
  ArrowRight,
  Disc3,
  Flame,
  Award
} from 'lucide-react';
import { 
  RealisticPalette, 
  RealisticCompass, 
  RealisticCalendar, 
  RealisticTrophy, 
  RealisticCrown,
  RealisticTicket
} from './RealisticIcons';
import { scrollToTarget } from '../utils/smoothScroll';

/**
 * PartyExperience: Immersive showcase of the confirmed event activities:
 * 1. Live DJ & Music Stage
 * 2. Dance & Cultural Performances
 * 3. Mr. & Ms. Fresher 2026 Runway
 * 4. Interactive Icebreakers & Games
 * 5. Curated Dress Code & Style Guide
 * 6. Venue & Event Blueprint
 */
export default function PartyExperience() {
  const experiences = [
    {
      id: 'music-stage',
      title: 'Live DJ & Concert Sound Stage',
      subtitle: 'Non-stop EDM, Club Anthems & Bass Drops',
      description: 'Powered by an arena sound system with synchronized volumetric spotlights and laser sweeps. Experience the sonic climax of the year.',
      tag: 'SOUND & LIGHTS',
      accentColor: 'from-cyan-500/20 via-sky-500/10 to-transparent',
      borderColor: 'border-cyan-400/40 hover:border-cyan-400',
      tagColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/40',
      icon: Disc3,
      actionText: 'Experience Beats',
      target: '#hero',
    },
    {
      id: 'dance-showcase',
      title: 'Dance & Spotlight Showcases',
      subtitle: 'Synchronized Choreography & Open Arena Circle',
      description: 'Dynamic stage routines crafted by departmental dance crews, transitioning into an open dance floor where seniors and juniors unite.',
      tag: 'PERFORMANCES',
      accentColor: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
      borderColor: 'border-purple-400/40 hover:border-purple-400',
      tagColor: 'text-purple-300 bg-purple-500/15 border-purple-400/40',
      icon: Flame,
      actionText: 'View Lineup',
      target: '#contest',
    },
    {
      id: 'fresher-contest',
      title: 'Mr. & Ms. Fresher 2026',
      subtitle: 'The Charisma & Elegance Batch Titles',
      description: 'The runway spotlight where confidence, style, wit, and presence take center stage, crowned with custom tech trophies and gifts.',
      tag: 'PAGEANT TITLE',
      accentColor: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-400/40 hover:border-amber-400',
      tagColor: 'text-amber-300 bg-amber-500/15 border-amber-400/40',
      icon: RealisticTrophy,
      actionText: 'Contest Details',
      target: '#contest',
    },
    {
      id: 'games-interactive',
      title: 'Interactive Games & Icebreakers',
      subtitle: 'Batch Challenges & Unforgettable Moments',
      description: 'High-energy crowd games, fast-paced trivia, and unexpected batch awards designed to forge lifelong friendships in one magical evening.',
      tag: 'ACTIVITIES',
      accentColor: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-400/40 hover:border-emerald-400',
      tagColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/40',
      icon: Gamepad2,
      actionText: 'See Highlights',
      target: '#details',
    },
    {
      id: 'dress-code',
      title: 'Curated Dress Code & Style Guide',
      subtitle: 'Indo-Western Fusion & Cyber Glam',
      description: 'Step out in your sharpest Indo-Western fusion, suits, evening gowns, and tailored silhouettes. Express your signature look for the red carpet.',
      tag: 'STYLE GUIDE',
      accentColor: 'from-fuchsia-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-fuchsia-400/40 hover:border-fuchsia-400',
      tagColor: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-400/40',
      icon: RealisticPalette,
      actionText: 'View Dress Code',
      target: '#dress-code',
    },
    {
      id: 'venue-navigation',
      title: 'Grand Arena & Transit Blueprint',
      subtitle: 'Ballroom, North Gate & Open Quadrangle',
      description: 'Access secret coordinates, North Arch entrance routes, metro transit drop-offs, and seamless map directions right to the arena doors.',
      tag: 'VENUE GUIDE',
      accentColor: 'from-sky-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-sky-400/40 hover:border-sky-400',
      tagColor: 'text-sky-300 bg-sky-500/15 border-sky-400/40',
      icon: RealisticCompass,
      actionText: 'View Venue Map',
      target: '#venue',
    },
  ];

  return (
    <section id="experiences" className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 scroll-mt-20 sm:scroll-mt-24">
      
      {/* Background Section Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-outfit font-extrabold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CONFIRMED PARTY EXPERIENCES</span>
        </div>

        <h2 className="font-outfit font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          What Awaits You at ELIXORA
        </h2>

        <p className="mt-3 text-white max-w-2xl mx-auto text-sm sm:text-base font-outfit font-bold subheading-readable tracking-wide">
          An electrifying fusion of music, fashion, stage spotlights, and memories that will define your college journey.
        </p>
      </div>

      {/* 6 Grid Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {experiences.map((exp) => {
          const Icon = exp.icon;
          return (
            <div
              key={exp.id}
              className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-obsidian-950/80 backdrop-blur-xl border ${exp.borderColor} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden`}
            >
              {/* Radial Light Wash on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${exp.accentColor} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="relative z-10">
                {/* Tag & Icon Row */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className={`text-[10px] sm:text-[11px] font-outfit font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${exp.tagColor}`}>
                    {exp.tag}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Title & Subtitle */}
                <h3 className="font-outfit font-black text-xl sm:text-2xl text-white group-hover:text-cyan-200 transition-colors tracking-tight leading-snug mb-1.5">
                  {exp.title}
                </h3>
                <h4 className="font-outfit text-xs sm:text-sm font-bold text-slate-300 mb-3 tracking-wide">
                  {exp.subtitle}
                </h4>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 font-outfit leading-relaxed subheading-readable">
                  {exp.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="relative z-10 pt-4 sm:pt-6 mt-4 border-t border-white/10">
                <a
                  href={exp.target}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(exp.target);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-outfit font-extrabold text-cyan-300 group-hover:text-cyan-200 hover:underline"
                >
                  <span>{exp.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
