import React, { useState, useEffect } from 'react';
import { soundController } from '../utils/audio';

export default function CyberneticHud({ onReplayIntro, onOpenPass, hasPass }) {
  const [coords, setCoords] = useState('22.2500° N, 84.9000° E');
  const [hudSolid, setHudSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHudSolid(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      aria-label="Cybernetic Telemetry HUD"
      className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-3 pointer-events-none select-none transition-opacity duration-300"
      style={{ opacity: hudSolid ? 0.95 : 0.7 }}
    >
      {/* Chamfered Coordinate & Status HUD Pill */}
      <div
        className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 bg-black/70 backdrop-blur-xl border border-cyan-400/30 text-cyan-300 text-[10px] font-mono tracking-[0.2em] shadow-[0_0_20px_rgba(0,242,254,0.15)] group transition-all duration-300 hover:border-cyan-400 hover:text-white"
        style={{
          clipPath:
            'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f2fe] animate-pulse" />
        <span className="text-white/60 font-black">SYS.NAV //</span>
        <span>
          {coords}
        </span>
      </div>

      {/* Replay Cinematic Intro & Curtain Trigger */}
      {onReplayIntro && (
        <button
          onClick={() => {
            soundController.playClick?.();
            onReplayIntro();
          }}
          className="pointer-events-auto px-3 py-1.5 bg-purple-950/60 backdrop-blur-xl border border-purple-400/30 text-purple-300 hover:text-white hover:border-purple-400 text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          style={{
            clipPath:
              'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}
          title="Replay Orbital Alignment & Curtain Sequence"
        >
          <span>
            REPLAY INTRO
          </span>
        </button>
      )}
    </aside>
  );
}
