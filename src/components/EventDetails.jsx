import React from 'react';
import { Calendar, Clock, MapPin, Navigation, Shirt, ExternalLink, Download, Compass, Info } from 'lucide-react';
import { EVENT_DETAILS, getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { soundController } from '../utils/audio';

export default function EventDetails() {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="details" className="relative pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 scroll-mt-20 sm:scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Event Details &amp; Blueprint
        </h2>
        <p className="mt-2 text-white max-w-2xl mx-auto text-sm sm:text-base font-outfit font-bold subheading-readable tracking-wide">
          All you need to navigate the biggest night of your college journey. Sync to your calendar and plan your style.
        </p>
      </div>

      {/* Box 1: Schedule & Venue Blueprint (Translucent Glass Screen with Light Spotlight) */}
      <div 
        onMouseMove={handleMouseMove}
        className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-7 translucent-glass-screen light-spotlight-card hover:border-cyan-300/50 hover:shadow-[0_12px_45px_0_rgba(0,0,0,0.35),0_0_35px_rgba(0,229,255,0.22)] relative overflow-hidden transition-all duration-300 mb-8"
      >
        {/* Interactive pointer light overlay & illuminated border */}
        <div className="light-spotlight-overlay" />
        <div className="light-spotlight-border" />
        <div className="card-top-light-beam" />
        <div className="light-glint-sweep" />

        {/* Ambient breathing aurora light beacons behind frosted glass */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none aurora-light-beacon" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none aurora-light-beacon" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-400/10 rounded-full blur-[90px] pointer-events-none aurora-light-beacon" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Card 1: Date & Time + Calendar Sync (Translucent Glass Card) */}
          <div 
            onMouseMove={handleMouseMove}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between translucent-glass-card light-spotlight-card hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
          >
            <div className="light-spotlight-overlay" />
            <div className="light-spotlight-border" />
            <div className="card-top-light-beam" />

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mb-3.5 shadow-[0_0_18px_rgba(0,229,255,0.35)] backdrop-blur-md">
                <Calendar className="w-5 h-5 text-cyan-300" />
              </div>

              <span className="text-xs font-outfit text-cyan-300 font-black tracking-widest uppercase">WHEN TO ARRIVE</span>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight mt-1.5 mb-3">
                {EVENT_DETAILS.humanDate}
              </h3>

              <div className="space-y-2 mb-3.5">
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs text-cyan-200 font-outfit font-bold tracking-wide">Entry &amp; Red Carpet</div>
                    <div className="text-sm sm:text-base font-outfit font-black text-white">06:30 PM - 07:45 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Sync Actions */}
            <div className="relative z-10 mt-auto pt-3.5 border-t border-white/20 space-y-2">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundController.playClick()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/40 via-sky-500/35 to-violet-500/35 hover:from-cyan-500/60 hover:to-sky-500/60 border border-cyan-300/60 text-white font-outfit font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] shadow-[0_4px_18px_rgba(0,229,255,0.3)] backdrop-blur-md"
              >
                <Calendar className="w-4 h-4 text-cyan-200" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-90" />
              </a>

              <button
                onClick={() => {
                  soundController.playClick();
                  downloadIcsFile();
                }}
                className="w-full py-2 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] border border-white/25 text-white font-outfit font-bold text-xs flex items-center justify-center gap-2 transition-all backdrop-blur-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Apple / Outlook (.ics)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Venue & Map Guide (Translucent Glass Card) */}
          <div 
            id="venue" 
            onMouseMove={handleMouseMove}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between translucent-glass-card light-spotlight-card hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all duration-300 group scroll-mt-24 sm:scroll-mt-28 relative overflow-hidden"
          >
            <div className="light-spotlight-overlay" />
            <div className="light-spotlight-border" />
            <div className="card-top-light-beam" />

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mb-3.5 shadow-[0_0_18px_rgba(0,229,255,0.35)] backdrop-blur-md">
                <MapPin className="w-5 h-5 text-cyan-300" />
              </div>

              <span className="text-xs font-outfit text-cyan-300 font-black tracking-widest uppercase">LOCATION &amp; BLUEPRINT</span>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight mt-1.5 mb-1.5">
                Grand Aurora Arena
              </h3>
              <p className="text-xs sm:text-sm text-white font-outfit font-bold mb-3 subheading-readable">
                Tech Campus Main Quadrangle &amp; Open Air Amphitheatre.
              </p>

              {/* Stylized Interactive Map Container (Frosted Glass) */}
              <div className="relative rounded-2xl overflow-hidden border border-cyan-400/50 bg-white/[0.08] backdrop-blur-md h-16 mb-3 flex items-center justify-between px-3.5 group shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                {/* Radar Grid Lines */}
                <div className="absolute inset-0 cyber-grid opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-transparent to-transparent pointer-events-none" />

                {/* Pulsing Target Dot */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-5 h-5 rounded-full bg-cyan-400/50 animate-ping" />
                    <div className="w-7 h-7 rounded-full bg-cyan-500/40 border-2 border-cyan-300 flex items-center justify-center text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.8)]">
                      <MapPin className="w-3.5 h-3.5 animate-bounce" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-outfit font-black text-white tracking-wider block">
                       AURORA ARENA • SECTOR 4
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono font-bold tracking-wide">
                      28.5355° N, 77.3910° E
                    </span>
                  </div>
                </div>

                {/* Compass marker */}
                <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-mono text-cyan-200 bg-white/[0.12] px-2.5 py-1 rounded-lg border border-white/25 backdrop-blur-md font-bold shadow-sm">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NORTH GATE</span>
                </div>
              </div>

              {/* Navigation Pointers */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-white bg-white/[0.08] backdrop-blur-md p-2 rounded-xl border border-white/20 font-outfit font-bold shadow-sm">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Metro Line 3</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/[0.08] backdrop-blur-md p-2 rounded-xl border border-white/20 font-outfit font-bold shadow-sm">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Gate 2 Drop</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3.5 border-t border-white/20">
              <a
                href="https://maps.google.com/?q=Tech+Campus+Grand+Arena"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundController.playClick()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/40 via-sky-500/35 to-violet-500/35 hover:from-cyan-500/60 hover:to-violet-500/60 border border-cyan-300/60 text-white font-outfit font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] shadow-[0_4px_18px_rgba(0,229,255,0.3)] backdrop-blur-md"
              >
                <Navigation className="w-4 h-4 text-cyan-200" />
                <span>Open in Google Maps Navigation</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-90" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Box 2: Dedicated Dress Costume Box (Translucent Glass Screen with Light Spotlight) */}
      <div 
        id="dress-code" 
        onMouseMove={handleMouseMove}
        className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-7 translucent-glass-screen light-spotlight-card hover:border-cyan-300/50 hover:shadow-[0_12px_45px_0_rgba(0,0,0,0.35),0_0_35px_rgba(0,229,255,0.22)] relative overflow-hidden transition-all duration-300 scroll-mt-24 sm:scroll-mt-28"
      >
        {/* Interactive pointer light overlay & illuminated border */}
        <div className="light-spotlight-overlay" />
        <div className="light-spotlight-border" />
        <div className="card-top-light-beam" />
        <div className="light-glint-sweep" />

        {/* Ambient breathing aurora atmospheric glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/25 rounded-full blur-[100px] pointer-events-none aurora-light-beacon" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/25 rounded-full blur-[100px] pointer-events-none aurora-light-beacon" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/12 rounded-full blur-[90px] pointer-events-none aurora-light-beacon" />

        <div className="relative z-10">
          {/* Header row */}
          <div className="pb-5 border-b border-white/15 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/20 border border-cyan-400/50 text-cyan-200 text-xs font-outfit font-extrabold uppercase mb-2.5 shadow-[0_0_12px_rgba(0,229,255,0.25)] backdrop-blur-md">
                <Shirt className="w-4 h-4 text-cyan-300" />
                <span>OFFICIAL ATTIRE CODE</span>
              </div>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight">
                Cyber Glam &amp; Ethereal Neon
              </h3>
              <p className="text-xs sm:text-sm text-white font-outfit font-bold mt-1 max-w-xl subheading-readable">
                Futuristic, stylish, and comfortable to dance. Think sleek streetwear infused with luminous accents.
              </p>
            </div>
          </div>

          {/* Costume Photo Space for Boys and Girls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-outfit text-cyan-300 tracking-wider uppercase font-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                COSTUME INSPIRATION LOOKBOOK
              </span>
              <span className="text-xs font-outfit text-white font-bold subheading-readable">
                Recommended Styling for Fresher Night
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              
              {/* Boys Costume Card (Translucent Glass Card) */}
              <div 
                onMouseMove={handleMouseMove}
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 translucent-glass-card light-spotlight-card hover:border-sky-400/50 hover:bg-white/[0.06] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="light-spotlight-overlay" />
                <div className="light-spotlight-border" />
                <div className="card-top-light-beam" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-outfit font-extrabold text-white tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                      BOYS' ATTIRE LOOKBOOK
                    </span>
                    <span className="text-[10px] font-outfit bg-sky-500/25 text-sky-200 px-3 py-1 rounded-full border border-sky-400/50 font-black uppercase tracking-wider backdrop-blur-md">
                      FORMAL TUXEDO &amp; SUIT
                    </span>
                  </div>

                  {/* Photo Space with Neon Rim Backlight */}
                  <div className="relative rounded-2xl overflow-hidden h-52 sm:h-60 w-full mb-3.5 border border-white/20 group-hover:border-sky-400/50 transition-all bg-black/40 shadow-md">
                    <div className="lookbook-backlight" />
                    <img
                      src="/costume-boys.jpg"
                      alt="Boys Formal Tuxedo and Suit Attire"
                      className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white font-outfit font-bold px-3 py-2 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg z-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_6px_#38bdf8]" />
                      <span className="truncate sm:whitespace-normal">Tailored black tuxedo with satin lapels &amp; crisp bowtie</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white font-outfit font-bold leading-relaxed mb-3.5 subheading-readable">
                    Sharp black tuxedo or tailored blazer, crisp white collared dress shirt, classic bowtie or silk necktie, and polished formal shoes.
                  </p>
                </div>

                <div className="relative z-10 pt-3 border-t border-white/15 flex flex-wrap gap-2">
                  <span className="text-xs font-outfit font-bold px-3 py-1 rounded-lg bg-white/[0.08] text-white border border-white/20 backdrop-blur-sm shadow-sm">#BlackTie</span>
                  <span className="text-xs font-outfit font-bold px-3 py-1 rounded-lg bg-white/[0.08] text-white border border-white/20 backdrop-blur-sm shadow-sm">#TailoredSuit</span>
                  <span className="text-xs font-outfit font-bold px-3 py-1 rounded-lg bg-white/[0.08] text-white border border-white/20 backdrop-blur-sm shadow-sm">#FormalAttire</span>
                </div>
              </div>

              {/* Girls Costume Card (Translucent Glass Card) */}
              <div 
                onMouseMove={handleMouseMove}
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 translucent-glass-card light-spotlight-card hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="light-spotlight-overlay" />
                <div className="light-spotlight-border" />
                <div className="card-top-light-beam" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-outfit font-extrabold text-white tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                      GIRLS' ATTIRE LOOKBOOK
                    </span>
                    <span className="text-[10px] font-outfit bg-cyan-500/25 text-cyan-200 px-3 py-1 rounded-full border border-cyan-400/50 font-black uppercase tracking-wider backdrop-blur-md">
                      ETHEREAL GLAM
                    </span>
                  </div>

                  {/* Photo Space with Neon Rim Backlight */}
                  <div className="relative rounded-2xl overflow-hidden h-52 sm:h-60 w-full mb-3.5 border border-white/20 group-hover:border-cyan-400/50 transition-all bg-black/40 shadow-md">
                    <div className="lookbook-backlight" />
                    <img
                      src="/costume-girls.jpg"
                      alt="Girls Cyber Costume Style"
                      className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white font-outfit font-bold px-3 py-2 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg z-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_6px_#00e5ff]" />
                      <span className="truncate sm:whitespace-normal">Iridescent party dress with cyan glow &amp; UV glitter</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white font-outfit font-bold leading-relaxed mb-3.5 subheading-readable">
                    Shimmering metallic or holographic fabrics accented with electric cyan and ultraviolet jewelry, plus UV face art.
                  </p>
                </div>

                <div className="relative z-10 pt-3 border-t border-white/15 flex flex-wrap gap-2">
                  <span className="text-xs font-outfit font-bold px-3 py-1 rounded-lg bg-white/[0.08] text-white border border-white/20 backdrop-blur-sm shadow-sm">#Iridescent</span>
                  <span className="text-xs font-outfit font-bold px-3 py-1 rounded-lg bg-white/[0.08] text-white border border-white/20 backdrop-blur-sm shadow-sm">#HolographicGlow</span>
                  <span className="text-xs font-outfit font-bold px-3 py-1 rounded-lg bg-white/[0.08] text-white border border-white/20 backdrop-blur-sm shadow-sm">#UVFacePaint</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
