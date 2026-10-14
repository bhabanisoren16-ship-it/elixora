import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Sparkles } from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { adminStore } from '../utils/adminStore';

/**
 * EventCountdown: Luxury Neon Live Countdown Display
 * Features:
 * - Animated digit transitions
 * - Neon glassmorphism casing with cyber-violet & cyan edge glow
 * - Dynamic sync with adminStore settings & EVENT_DETAILS
 * - Graceful fallback when event is live / expired
 */
export default function EventCountdown({ className = '' }) {
  const [settings, setSettings] = useState(() => adminStore.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(adminStore.getSettings());
    };
    window.addEventListener('elixora_admin_update', handleUpdate);
    return () => window.removeEventListener('elixora_admin_update', handleUpdate);
  }, []);

  const targetDateIso = settings.eventDateIso || '2026-10-24T18:30:00+05:30';
  const humanDate = settings.eventHumanDate || EVENT_DETAILS.humanDate;
  const venueTitle = settings.venueTitle || EVENT_DETAILS.location;
  const timeRange = settings.eventTimeRange || EVENT_DETAILS.humanTime;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateIso).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
          isExpired: false,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateIso]);

  const units = [
    { label: 'DAYS', value: timeLeft.days, color: 'from-cyan-300 via-white to-cyan-100' },
    { label: 'HOURS', value: timeLeft.hours, color: 'from-sky-300 via-white to-sky-100' },
    { label: 'MINUTES', value: timeLeft.minutes, color: 'from-purple-300 via-white to-pink-100' },
    { label: 'SECONDS', value: timeLeft.seconds, color: 'from-amber-300 via-white to-yellow-100' },
  ];

  return (
    <div className={`relative w-full max-w-xl mx-auto ${className}`}>
      {/* Ambient Neon Back-Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/15 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Countdown Container */}
      <div className="relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-obsidian-950/80 border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* Top Header Row with Verified Event Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10 text-[11px] sm:text-xs font-outfit">
          <div className="flex items-center gap-1.5 text-cyan-300 font-extrabold tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{timeLeft.isExpired ? 'FESTIVAL IS LIVE!' : 'OFFICIAL EVENT COUNTDOWN'}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="hidden min-[480px]:inline text-purple-300">
              {humanDate}
            </span>
            <span className="hidden min-[480px]:inline text-white/30">•</span>
            <span className="text-amber-300 font-semibold">{timeRange}</span>
          </div>
        </div>

        {/* 4 Neon Digit Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3.5">
          {units.map((unit, idx) => (
            <div
              key={unit.label}
              className="relative rounded-xl p-2 sm:p-3 bg-white/[0.04] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col items-center justify-center group hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all duration-300"
            >
              {/* Digit Box */}
              <div
                key={unit.value}
                className={`font-outfit font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b ${unit.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-in fade-in duration-300`}
              >
                {String(unit.value).padStart(2, '0')}
              </div>

              {/* Label */}
              <div className="mt-1 text-[9px] sm:text-[11px] font-outfit font-extrabold tracking-[0.2em] text-slate-400 group-hover:text-cyan-300 transition-colors">
                {unit.label}
              </div>

              {/* Micro Corner Accent */}
              <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-cyan-400/60 shadow-[0_0_4px_#00e5ff]" />
            </div>
          ))}
        </div>

        {/* Verified Venue Blueprint Footnote */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-center gap-1.5 text-center text-[10.5px] sm:text-xs text-slate-400 font-outfit">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">{venueTitle}</span>
        </div>
      </div>
    </div>
  );
}
