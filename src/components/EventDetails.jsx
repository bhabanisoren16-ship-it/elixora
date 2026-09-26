import React from 'react';
import { Calendar, Clock, MapPin, Navigation, Shirt, ExternalLink, Download, Compass, Info } from 'lucide-react';
import { EVENT_DETAILS, getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { soundController } from '../utils/audio';

export default function EventDetails() {

  return (
    <section id="details" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      
      {/* Section Header */}
      <div className="text-center mb-14">
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Event Details &amp; Blueprint
        </h2>
        <p className="mt-2 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-outfit">
          All you need to navigate the biggest night of your college journey. Sync to your calendar and plan your style.
        </p>
      </div>

      {/* Box 1: Schedule & Venue Blueprint (When & Where) */}
      <div className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-7 border border-white/20 bg-obsidian-950/45 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.1)] hover:border-amber-400/40 relative overflow-hidden transition-all duration-300 mb-8">
        {/* Subtle warm sunset & cyan ambient light gradients blending with background */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Card 1: Date & Time + Calendar Sync */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between bg-obsidian-900/40 backdrop-blur-md border border-white/15 hover:border-amber-400/50 shadow-xl transition-all duration-300 group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_18px_rgba(245,158,11,0.3)]">
                <Calendar className="w-5 h-5" />
              </div>

              <span className="text-xs font-outfit text-amber-300 font-extrabold tracking-widest uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">WHEN TO ARRIVE</span>
              <h3 className="font-outfit font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                {EVENT_DETAILS.humanDate}
              </h3>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 shadow-inner">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-300 font-outfit font-medium">Entry &amp; Red Carpet</div>
                    <div className="text-sm font-outfit font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">06:30 PM - 07:45 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Sync Actions */}
            <div className="mt-auto pt-3 border-t border-white/15 space-y-1.5">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundController.playClick()}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/30 via-orange-500/25 to-amber-500/30 hover:from-amber-500/45 hover:to-orange-500/45 border border-amber-400/50 text-white font-outfit font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_4px_15px_rgba(245,158,11,0.2)]"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              <button
                onClick={() => {
                  soundController.playClick();
                  downloadIcsFile();
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-black/35 hover:bg-white/15 border border-white/15 text-slate-200 font-outfit font-medium text-xs flex items-center justify-center gap-2 transition-all hover:text-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Apple / Outlook (.ics)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Venue & Map Guide */}
          <div id="venue" className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between bg-obsidian-900/40 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 shadow-xl transition-all duration-300 group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/25 border border-cyan-500/50 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_18px_rgba(6,182,212,0.3)]">
                <MapPin className="w-5 h-5" />
              </div>

              <span className="text-xs font-outfit text-amber-300 font-extrabold tracking-widest uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">LOCATION &amp; BLUEPRINT</span>
              <h3 className="font-outfit font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1 mb-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                Grand Aurora Arena
              </h3>
              <p className="text-xs text-slate-200 font-outfit font-medium mb-2.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                Tech Campus Main Quadrangle &amp; Open Air Amphitheatre.
              </p>

              {/* Stylized Interactive Map Container */}
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/35 bg-black/35 backdrop-blur-md h-16 mb-2.5 flex items-center justify-between px-3 group shadow-inner">
                {/* Radar Grid Lines */}
                <div className="absolute inset-0 cyber-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Pulsing Target Dot */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-5 h-5 rounded-full bg-cyan-400/40 animate-ping" />
                    <div className="w-7 h-7 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.7)]">
                      <MapPin className="w-3.5 h-3.5 animate-bounce" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-outfit font-bold text-white tracking-wider block drop-shadow-sm">
                      AURORA ARENA • SECTOR 4
                    </span>
                    <span className="text-[9px] text-cyan-300 font-mono font-semibold">
                      28.5355° N, 77.3910° E
                    </span>
                  </div>
                </div>

                {/* Compass marker */}
                <div className="relative z-10 flex items-center gap-1 text-[9px] font-mono text-slate-200 bg-black/70 px-2 py-0.5 rounded border border-white/15">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  <span>NORTH GATE</span>
                </div>
              </div>

              {/* Navigation Pointers */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-200 bg-black/35 backdrop-blur-md p-1.5 rounded-lg border border-white/15 font-outfit font-medium">
                  <Navigation className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">Metro Line 3</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200 bg-black/35 backdrop-blur-md p-1.5 rounded-lg border border-white/15 font-outfit font-medium">
                  <Info className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">Gate 2 Drop</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-white/15">
              <a
                href="https://maps.google.com/?q=Tech+Campus+Grand+Arena"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundController.playClick()}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/30 via-sky-500/25 to-amber-500/25 hover:from-cyan-500/45 hover:to-amber-500/40 border border-cyan-400/50 text-white font-outfit font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_4px_15px_rgba(6,182,212,0.2)]"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-300" />
                <span>Open in Google Maps Navigation</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Box 2: Dedicated Dress Costume Box with Boys & Girls Photo Space */}
      <div id="dress-code" className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-7 border border-white/20 bg-obsidian-950/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(245,158,11,0.12)] hover:border-amber-400/40 relative overflow-hidden transition-all duration-300">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header row */}
          <div className="pb-5 border-b border-white/15 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-outfit font-bold uppercase mb-2">
                <Shirt className="w-3.5 h-3.5" />
                <span>OFFICIAL ATTIRE CODE</span>
              </div>
              <h3 className="font-outfit font-bold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                Cyber Glam &amp; Ethereal Neon
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-outfit mt-1 max-w-xl">
                Futuristic, stylish, and comfortable to dance. Think sleek streetwear infused with luminous accents.
              </p>
            </div>
          </div>

          {/* Costume Photo Space for Boys and Girls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-outfit text-amber-300 tracking-wider uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                COSTUME INSPIRATION LOOKBOOK
              </span>
              <span className="text-[11px] font-outfit text-slate-300">
                Recommended Styling for Fresher Night
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              
              {/* Boys Costume Card */}
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-obsidian-900/60 backdrop-blur-md border border-white/15 hover:border-amber-400/50 shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-outfit font-bold text-white tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      BOYS' ATTIRE LOOKBOOK
                    </span>
                    <span className="text-[10px] font-outfit bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/40 font-bold uppercase tracking-wider">
                      FORMAL TUXEDO &amp; SUIT
                    </span>
                  </div>

                  {/* Photo Space */}
                  <div className="relative rounded-2xl overflow-hidden h-52 sm:h-60 w-full mb-3.5 border border-white/15 group-hover:border-amber-400/50 transition-all bg-black/50 shadow-md">
                    <img
                      src="/costume-boys.jpg"
                      alt="Boys Formal Tuxedo and Suit Attire"
                      className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white font-outfit font-medium px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate sm:whitespace-normal">Tailored black tuxedo with satin lapels &amp; crisp bowtie</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-outfit leading-relaxed mb-3">
                    Sharp black tuxedo or tailored blazer, crisp white collared dress shirt, classic bowtie or silk necktie, and polished formal shoes.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex flex-wrap gap-2">
                  <span className="text-[11px] font-outfit font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">#BlackTie</span>
                  <span className="text-[11px] font-outfit font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">#TailoredSuit</span>
                  <span className="text-[11px] font-outfit font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">#FormalAttire</span>
                </div>
              </div>

              {/* Girls Costume Card */}
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-obsidian-900/60 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-outfit font-bold text-white tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      GIRLS' ATTIRE LOOKBOOK
                    </span>
                    <span className="text-[10px] font-outfit bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/40 font-bold uppercase tracking-wider">
                      ETHEREAL GLAM
                    </span>
                  </div>

                  {/* Photo Space */}
                  <div className="relative rounded-2xl overflow-hidden h-52 sm:h-60 w-full mb-3.5 border border-white/15 group-hover:border-cyan-400/50 transition-all bg-black/50 shadow-md">
                    <img
                      src="/costume-girls.jpg"
                      alt="Girls Cyber Costume Style"
                      className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white font-outfit font-medium px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate sm:whitespace-normal">Iridescent party dress with cyan glow &amp; UV glitter</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-outfit leading-relaxed mb-3">
                    Shimmering metallic or holographic fabrics accented with electric cyan and ultraviolet jewelry, plus UV face art.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex flex-wrap gap-2">
                  <span className="text-[11px] font-outfit font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">#Iridescent</span>
                  <span className="text-[11px] font-outfit font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">#HolographicGlow</span>
                  <span className="text-[11px] font-outfit font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">#UVFacePaint</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
