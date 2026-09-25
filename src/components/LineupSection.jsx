import React from 'react';
import { Crown, Trophy, Award, Star } from 'lucide-react';

export default function LineupSection() {
  return (
    <section id="contest" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-outfit font-bold uppercase mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>FLAGSHIP CONTEST</span>
        </div>
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Mr. &amp; Ms. Fresher 2026
        </h2>
        <p className="mt-2 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-outfit">
          The ultimate spotlight of ELIXORA 2.0—crowning the most charismatic and talented newcomers of the batch.
        </p>
      </div>

      {/* Main Spotlight Box */}
      <div className="rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-white/20 bg-obsidian-950/45 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.1)] hover:border-amber-400/40 relative overflow-hidden transition-all duration-300">
        {/* Subtle atmospheric accents */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyber-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Header Row of the Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/25 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  Mr. &amp; Ms. Fresher 2026
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-outfit">
                  Crowning the most charismatic newcomers of the batch with exclusive tech trophies &amp; gifts.
                </p>
              </div>
            </div>
            <span className="text-xs font-outfit font-extrabold tracking-wider px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm shrink-0 uppercase">
              CONTEST
            </span>
          </div>

          {/* Dual Category Cards: Mr. Fresher & Ms. Fresher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mr. Fresher Card */}
            <div className="rounded-2xl p-6 bg-obsidian-900/40 backdrop-blur-md border border-white/15 hover:border-amber-400/60 shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-outfit font-bold text-amber-300 tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  MR. FRESHER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  BATCH 2026
                </span>
              </div>
              <h4 className="font-outfit font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-amber-300 transition-colors tracking-tight drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                The Charisma &amp; Presence Title
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-outfit">
                Recognizing confidence, wit, stage presence, and signature style on the runway.
              </p>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10 text-[11px] font-outfit text-slate-300">
                <span className="flex items-center gap-1 text-slate-200"><Star className="w-3 h-3 text-amber-400" /> Golden Sash</span>
                <span className="flex items-center gap-1 text-slate-200"><Award className="w-3 h-3 text-amber-400" /> Tech Trophy</span>
              </div>
            </div>

            {/* Ms. Fresher Card */}
            <div className="rounded-2xl p-6 bg-obsidian-900/40 backdrop-blur-md border border-white/15 hover:border-amber-400/60 shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-outfit font-bold text-amber-300 tracking-wider flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  MS. FRESHER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  BATCH 2026
                </span>
              </div>
              <h4 className="font-outfit font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-amber-300 transition-colors tracking-tight drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                The Elegance &amp; Talent Title
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-outfit">
                Honoring poise, dynamic persona, expressive intellect, and evening glamour.
              </p>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10 text-[11px] font-outfit text-slate-300">
                <span className="flex items-center gap-1 text-slate-200"><Star className="w-3 h-3 text-amber-400" /> Royal Tiara &amp; Sash</span>
                <span className="flex items-center gap-1 text-slate-200"><Award className="w-3 h-3 text-amber-400" /> Tech Trophy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

