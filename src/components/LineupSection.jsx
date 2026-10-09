import React from 'react';
import { Crown, Trophy } from 'lucide-react';

export default function LineupSection() {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="contest" className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 scroll-mt-20 sm:scroll-mt-24">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Mr. &amp; Ms. Fresher 2026
        </h2>
        <p className="mt-2 text-white max-w-2xl mx-auto text-sm sm:text-base font-outfit font-bold subheading-readable tracking-wide">
          The ultimate spotlight of ELIXORA 2.0—crowning the most charismatic and talented newcomers of the batch.
        </p>
      </div>

      {/* Main Spotlight Box (Translucent Glass Screen with Light Spotlight) */}
      <div 
        onMouseMove={handleMouseMove}
        className="rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 translucent-glass-screen light-spotlight-card hover:border-cyan-300/50 hover:shadow-[0_12px_45px_0_rgba(0,0,0,0.35),0_0_35px_rgba(0,229,255,0.22)] relative overflow-hidden transition-all duration-300"
      >
        <div className="light-spotlight-overlay" />
        <div className="light-spotlight-border" />
        <div className="card-top-light-beam" />
        <div className="light-glint-sweep" />

        {/* Ambient atmospheric glows */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/25 rounded-full blur-[100px] pointer-events-none aurora-light-beacon" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/25 rounded-full blur-[100px] pointer-events-none aurora-light-beacon" />

        <div className="relative z-10">
          {/* Top Header Row of the Card */}
          <div className="pb-6 border-b border-white/10 mb-8">
            <div>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight">
                Mr. &amp; Ms. Fresher 2026
              </h3>
              <p className="text-xs sm:text-sm text-white mt-1 font-outfit font-bold subheading-readable">
                Crowning the most charismatic newcomers of the batch with exclusive tech trophies &amp; gifts.
              </p>
            </div>
          </div>

          {/* Dual Category Cards: Mr. Fresher & Ms. Fresher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mr. Fresher Card */}
            <div 
              onMouseMove={handleMouseMove}
              className="rounded-2xl p-6 translucent-glass-card light-spotlight-card hover:border-sky-400/60 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
            >
              <div className="light-spotlight-overlay" />
              <div className="light-spotlight-border" />
              <div className="card-top-light-beam" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-outfit font-black text-sky-300 tracking-wider flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-sky-400" />
                    MR. FRESHER
                  </span>
                </div>
                <h4 className="font-outfit font-black text-xl sm:text-2xl text-white mb-2 group-hover:text-sky-300 transition-colors tracking-tight">
                  The Charisma &amp; Presence Title
                </h4>
                <p className="text-xs sm:text-sm text-white leading-relaxed font-outfit font-bold subheading-readable">
                  Recognizing confidence, wit, stage presence, and signature style on the runway.
                </p>
              </div>
            </div>

            {/* Ms. Fresher Card */}
            <div 
              onMouseMove={handleMouseMove}
              className="rounded-2xl p-6 translucent-glass-card light-spotlight-card hover:border-purple-400/60 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
            >
              <div className="light-spotlight-overlay" />
              <div className="light-spotlight-border" />
              <div className="card-top-light-beam" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-outfit font-black text-purple-300 tracking-wider flex items-center gap-2">
                    <Crown className="w-4 h-4 text-purple-400" />
                    MS. FRESHER
                  </span>
                </div>
                <h4 className="font-outfit font-black text-xl sm:text-2xl text-white mb-2 group-hover:text-purple-300 transition-colors tracking-tight">
                  The Elegance &amp; Talent Title
                </h4>
                <p className="text-xs sm:text-sm text-white leading-relaxed font-outfit font-bold subheading-readable">
                  Honoring poise, dynamic persona, expressive intellect, and evening glamour.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
