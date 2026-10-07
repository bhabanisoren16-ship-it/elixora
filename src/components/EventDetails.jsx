import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Navigation, Shirt, ExternalLink, Download, Compass, Info } from 'lucide-react';
import { EVENT_DETAILS, getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { soundController } from '../utils/audio';
import { adminStore } from '../utils/adminStore';

export default function EventDetails() {
  const [settings, setSettings] = useState(() => adminStore.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(adminStore.getSettings());
    };
    window.addEventListener('elixora_admin_update', handleUpdate);
    return () => window.removeEventListener('elixora_admin_update', handleUpdate);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // Schedule & Venue active values from adminStore with fallbacks
  const isDateVenueAnnounced = Boolean(settings.isDateVenueAnnounced);
  const humanDate = settings.eventHumanDate || EVENT_DETAILS.humanDate;
  const timeRange = settings.eventTimeRange || '06:30 PM - 07:45 PM';
  const timingLabel = settings.eventTimingLabel || 'Entry & Red Carpet';
  const venueTitle = settings.venueTitle || 'Grand Aurora Arena';
  const venueSubtitle = settings.venueSubtitle || 'Tech Campus Main Quadrangle & Open Air Amphitheatre.';
  const venueSectorTag = settings.venueSectorTag || 'AURORA ARENA • SECTOR 4';
  const venueCoordinates = settings.venueCoordinates || '28.5355° N, 77.3910° E';
  const venueGateTag = settings.venueGateTag || 'NORTH GATE';
  const transitPoint1 = settings.transitPoint1 || 'Metro Line 3';
  const transitPoint2 = settings.transitPoint2 || 'Gate 2 Drop';
  const venueMapsUrl = settings.venueMapsUrl || 'https://maps.google.com/?q=Tech+Campus+Grand+Arena';

  // Teaser copy for announcement lock
  const teaserBadge = settings.teaserBadge || 'OFFICIAL SCHEDULE & VENUE';
  const teaserTitle = settings.teaserTitle || 'Yet to be announced';
  const teaserMessage = settings.teaserMessage || 'The official event date, red carpet timings, and secret venue coordinates will be revealed soon.';
  const teaserPill = settings.teaserPill || 'Dropping Soon • Keep An Eye Out';

  // Overrides for calendar helpers
  const calendarPayload = {
    location: `${venueTitle}, ${venueSubtitle}`,
    humanDate: humanDate,
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
        className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-7 translucent-glass-screen light-spotlight-card hover:border-cyan-300/50 hover:shadow-[0_12px_45px_0_rgba(0,0,0,0.35),0_0_35px_rgba(0,229,255,0.22)] relative overflow-hidden transition-all duration-300 mb-12 sm:mb-20"
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

        {/* Existing Content Grid (Kept completely intact underneath, blurred as frosted teaser when locked) */}
        <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 ${
          !isDateVenueAnnounced ? 'filter blur-[7px] sm:blur-[8px] opacity-75 select-none pointer-events-none transition-all max-h-[380px] xs:max-h-[420px] md:max-h-none overflow-hidden' : ''
        }`}>
          
          {/* Card 1: Date & Time + Calendar Sync (Translucent Glass Card) */}
          <div 
            onMouseMove={handleMouseMove}
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between translucent-glass-card light-spotlight-card hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
          >
            <div className="light-spotlight-overlay" />
            <div className="light-spotlight-border" />
            <div className="card-top-light-beam" />

            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_18px_rgba(0,229,255,0.35)] backdrop-blur-md">
                <Calendar className="w-5 h-5 text-cyan-300" />
              </div>

              <span className="text-xs font-outfit text-cyan-300 font-black tracking-widest uppercase block mb-1">
                WHEN TO ARRIVE
              </span>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight mb-2.5">
                {humanDate}
              </h3>

              <div className="space-y-2 mb-3.5">
                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs text-cyan-200 font-outfit font-bold tracking-wide">{timingLabel}</div>
                    <div className="text-sm sm:text-base font-outfit font-black text-white">{timeRange}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Sync Actions */}
            <div className="relative z-10 mt-auto pt-3.5 border-t border-white/20 space-y-2">
              <a
                href={getGoogleCalendarUrl(calendarPayload)}
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
                  downloadIcsFile(calendarPayload);
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
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between translucent-glass-card light-spotlight-card hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all duration-300 group scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden"
          >
            <div className="light-spotlight-overlay" />
            <div className="light-spotlight-border" />
            <div className="card-top-light-beam" />

            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_18px_rgba(0,229,255,0.35)] backdrop-blur-md">
                <MapPin className="w-5 h-5 text-cyan-300" />
              </div>

              <span className="text-xs font-outfit text-cyan-300 font-black tracking-widest uppercase block mb-1">
                LOCATION &amp; BLUEPRINT
              </span>
              <h3 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight mb-1.5 leading-snug">
                {venueTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-100 font-outfit font-bold mb-3.5 subheading-readable leading-relaxed">
                {venueSubtitle}
              </p>

              {/* Stylized Interactive Map Container (Frosted Glass with Responsive Flexible Height) */}
              <div className="relative rounded-2xl overflow-hidden border border-cyan-400/50 bg-white/[0.08] backdrop-blur-md min-h-[4.25rem] py-2.5 px-3 sm:px-3.5 mb-3 flex items-center justify-between gap-2.5 group shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                {/* Radar Grid Lines */}
                <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-transparent to-transparent pointer-events-none" />

                {/* Pulsing Target Dot & Venue Text */}
                <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0">
                    <span className="absolute w-5 h-5 rounded-full bg-cyan-400/50 animate-ping" />
                    <div className="w-7 h-7 rounded-full bg-cyan-500/40 border-2 border-cyan-300 flex items-center justify-center text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.8)]">
                      <MapPin className="w-3.5 h-3.5 animate-bounce" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-outfit font-black text-white tracking-wider block leading-tight">
                       {venueSectorTag}
                    </span>
                    <span className="text-[10px] sm:text-xs text-cyan-300 font-mono font-bold tracking-wide block mt-0.5 leading-tight">
                      {venueCoordinates}
                    </span>
                  </div>
                </div>

                {/* Compass marker */}
                <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-mono text-cyan-200 bg-white/[0.12] px-2 sm:px-2.5 py-1 rounded-lg border border-white/25 backdrop-blur-md font-bold shadow-sm shrink-0 whitespace-nowrap">
                  <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{venueGateTag}</span>
                </div>
              </div>

              {/* Navigation Pointers */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-white bg-white/[0.08] backdrop-blur-md p-2 rounded-xl border border-white/20 font-outfit font-bold shadow-sm">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{transitPoint1}</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/[0.08] backdrop-blur-md p-2 rounded-xl border border-white/20 font-outfit font-bold shadow-sm">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{transitPoint2}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3.5 border-t border-white/20">
              <a
                href={venueMapsUrl}
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

        {/* Blur Screen Overlay: "Yet to be announced" */}
        {!isDateVenueAnnounced && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-8 text-center backdrop-blur-md bg-gradient-to-b from-obsidian-950/65 via-obsidian-950/55 to-obsidian-950/70 rounded-3xl sm:rounded-[2rem] border border-cyan-400/35 shadow-[inset_0_0_50px_rgba(6,182,212,0.12)]">
            {/* Ambient neon pulse behind the card */}
            <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
            <div className="absolute inset-0 bg-radial from-obsidian-950/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center justify-center px-2">
              {/* Glowing Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] sm:text-xs font-outfit font-black uppercase tracking-widest mb-2.5 sm:mb-3.5 shadow-[0_0_20px_rgba(0,229,255,0.4)] backdrop-blur-xl">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{teaserBadge}</span>
              </div>

              {/* Overwrite Headline */}
              <h3 className="font-outfit font-black text-2xl xs:text-3xl sm:text-5xl text-white tracking-tight mb-2 sm:mb-2.5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                {teaserTitle}
              </h3>

              {/* Informative Subtext */}
              <p className="text-xs sm:text-sm text-cyan-100/90 font-outfit font-semibold max-w-xs sm:max-w-md mx-auto leading-relaxed">
                {teaserMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gap Header: For Juniors Only */}
      <div className="text-center pt-12 sm:pt-24 pb-3 sm:pb-4 relative z-10">
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          For Juniors Only
        </h2>
      </div>

      {/* Box 2: Dedicated Dress Costume Box (Translucent Glass Screen with Light Spotlight) */}
      <div 
        id="dress-code" 
        onMouseMove={handleMouseMove}
        className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-7 translucent-glass-screen light-spotlight-card hover:border-cyan-300/50 hover:shadow-[0_12px_45px_0_rgba(0,0,0,0.35),0_0_35px_rgba(0,229,255,0.22)] relative overflow-hidden transition-all duration-300 scroll-mt-20 sm:scroll-mt-24"
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
                Formal &amp; Indo-Western Fusion
              </h3>
              <p className="text-xs sm:text-sm text-white font-outfit font-bold mt-1 max-w-xl subheading-readable">
                Dress to impress in sharp western formals, tailored suits, or elegant Indo-Western and ethnic attire infused with radiant celebratory glam.
              </p>
            </div>
          </div>

          {/* Costume Photo Space for Boys and Girls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-outfit text-cyan-300 tracking-wider uppercase font-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                ATTIRE INSPIRATION LOOKBOOK
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
                      FORMAL SUITS &amp; INDO-WESTERN
                    </span>
                  </div>

                  {/* Photo Space with Neon Rim Backlight */}
                  <div className="relative rounded-2xl overflow-hidden h-52 sm:h-60 w-full border border-white/20 group-hover:border-sky-400/50 transition-all bg-black/40 shadow-md">
                    <div className="lookbook-backlight" />
                    <img
                      src="/costume-boys.jpg"
                      alt="Boys Formal Tuxedo and Suit Attire"
                      className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white font-outfit font-bold px-3 py-2 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg z-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_6px_#38bdf8]" />
                      <span className="truncate sm:whitespace-normal">Tailored black tuxedos, classic suits, blazers, or Indo-Western</span>
                    </div>
                  </div>
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
                      ELEGANT GOWNS &amp; ETHNIC GLAM
                    </span>
                  </div>

                  {/* Photo Space with Neon Rim Backlight */}
                  <div className="relative rounded-2xl overflow-hidden h-52 sm:h-60 w-full border border-white/20 group-hover:border-cyan-400/50 transition-all bg-black/40 shadow-md">
                    <div className="lookbook-backlight" />
                    <img
                      src="/costume-girls.jpg"
                      alt="Girls Cyber Costume Style"
                      className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white font-outfit font-bold px-3 py-2 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg z-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_6px_#00e5ff]" />
                      <span className="truncate sm:whitespace-normal">Chic evening gowns, cocktail dresses, or designer sarees &amp; lehengas</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
