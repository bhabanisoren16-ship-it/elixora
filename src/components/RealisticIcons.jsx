import React from 'react';

/**
 * High-fidelity, realistic skeuomorphic multi-tone SVG icons.
 * Designed to provide tactile depth, rich real-world materials (warm woods, 
 * polished brass, rich velvet, glazed ceramics, paper sheets, chrome), and 
 * stunning visual realism at any scale.
 */

export function RealisticHome({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="homeRoofGrad" x1="12" y1="2" x2="12" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <linearGradient id="homeWallGrad" x1="12" y1="10" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="homeDoorGrad" x1="12" y1="13.5" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <radialGradient id="homeWindowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      
      {/* Chimney */}
      <rect x="16" y="4" width="2.8" height="5" rx="0.5" fill="#9a3412" stroke="#78350f" strokeWidth="0.4" />
      <rect x="15.5" y="3.2" width="3.8" height="1.2" rx="0.4" fill="#c2410c" />
      
      {/* House Body */}
      <rect x="4" y="10" width="16" height="10.8" rx="1.2" fill="url(#homeWallGrad)" stroke="#94a3b8" strokeWidth="0.5" />
      
      {/* Roof with Realistic Overhang & Eaves */}
      <path d="M2.3 10.4L12 2.3L21.7 10.4C22.1 10.8 21.8 11.4 21.2 11.4H2.8C2.2 11.4 1.9 10.8 2.3 10.4Z" fill="url(#homeRoofGrad)" stroke="#7c2d12" strokeWidth="0.5" />
      
      {/* Roof Under-Eave Shadow */}
      <path d="M3.8 11.4L12 4.6L20.2 11.4H3.8Z" fill="#431407" opacity="0.3" />
      
      {/* Door with Brass Knob */}
      <rect x="10" y="13.5" width="4" height="7.3" rx="0.6" fill="url(#homeDoorGrad)" stroke="#78350f" strokeWidth="0.4" />
      <circle cx="13" cy="17.4" r="0.6" fill="#fde047" stroke="#b45309" strokeWidth="0.2" />
      
      {/* Window with Warm Amber Interior Light */}
      <rect x="5.5" y="13" width="3.4" height="4" rx="0.6" fill="url(#homeWindowGlow)" stroke="#64748b" strokeWidth="0.5" />
      <line x1="7.2" y1="13" x2="7.2" y2="17" stroke="#78350f" strokeWidth="0.4" />
      <line x1="5.5" y1="15" x2="8.9" y2="15" stroke="#78350f" strokeWidth="0.4" />

      {/* Lawn / Foundation */}
      <rect x="2" y="20.8" width="20" height="1.4" rx="0.7" fill="#10b981" />
    </svg>
  );
}

export function RealisticCalendar({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="calHeaderGrad" x1="12" y1="3" x2="12" y2="9.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="60%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="calPageGrad" x1="12" y1="8" x2="12" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="calRingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Sheet Drop Shadow */}
      <rect x="3.5" y="5.2" width="17" height="16.3" rx="2.2" fill="#090d16" opacity="0.4" />

      {/* Calendar Thick Paper Page */}
      <rect x="3" y="4.5" width="18" height="17" rx="2.2" fill="url(#calPageGrad)" stroke="#cbd5e1" strokeWidth="0.5" />

      {/* Cherry Red Header */}
      <path d="M3 6.7C3 5.5 3.9 4.5 5.2 4.5H18.8C20.1 4.5 21 5.5 21 6.7V9.5H3V6.7Z" fill="url(#calHeaderGrad)" />
      <line x1="4.5" y1="5.5" x2="19.5" y2="5.5" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="0.6" strokeLinecap="round" />

      {/* Twin-wire Chrome Binding Rings */}
      <rect x="6.4" y="2.6" width="1.6" height="3.8" rx="0.8" fill="url(#calRingGrad)" stroke="#334155" strokeWidth="0.3" />
      <rect x="11.2" y="2.6" width="1.6" height="3.8" rx="0.8" fill="url(#calRingGrad)" stroke="#334155" strokeWidth="0.3" />
      <rect x="16" y="2.6" width="1.6" height="3.8" rx="0.8" fill="url(#calRingGrad)" stroke="#334155" strokeWidth="0.3" />

      {/* Calendar Grid Date Dots */}
      <circle cx="6.5" cy="12.5" r="1" fill="#94a3b8" />
      <circle cx="10.2" cy="12.5" r="1" fill="#94a3b8" />
      <circle cx="13.9" cy="12.5" r="1" fill="#94a3b8" />
      <circle cx="17.6" cy="12.5" r="1" fill="#94a3b8" />

      <circle cx="6.5" cy="15.8" r="1" fill="#94a3b8" />
      <circle cx="10.2" cy="15.8" r="1" fill="#94a3b8" />
      
      {/* Highlighted Event Date: Vibrant Amber/Gold Badge */}
      <rect x="12.6" y="14.5" width="2.6" height="2.6" rx="0.8" fill="#f59e0b" stroke="#d97706" strokeWidth="0.4" />
      <circle cx="13.9" cy="15.8" r="0.75" fill="#ffffff" />
      
      <circle cx="17.6" cy="15.8" r="1" fill="#94a3b8" />

      <circle cx="6.5" cy="19" r="1" fill="#94a3b8" />
      <circle cx="10.2" cy="19" r="1" fill="#94a3b8" />
      <circle cx="13.9" cy="19" r="1" fill="#06b6d4" />
      <circle cx="17.6" cy="19" r="1" fill="#94a3b8" />
    </svg>
  );
}


export function RealisticGraduationCap({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="gradTopGrad" x1="12" y1="3" x2="12" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="55%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="tasselGoldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Skull Cap Head Fitting (Underneath) */}
      <path d="M5.5 12V16.2C5.5 18.3 8.4 20 12 20C15.6 20 18.5 18.3 18.5 16.2V12L12 15L5.5 12Z" fill="#090d16" stroke="#475569" strokeWidth="0.4" />

      {/* Mortarboard Cast Shadow */}
      <polygon points="12,4.8 22.5,9.5 12,14.2 1.5,9.5" fill="#000000" opacity="0.4" transform="translate(0, 0.8)" />

      {/* Diamond Mortarboard Board */}
      <polygon points="12,4.5 22.5,9.2 12,13.8 1.5,9.2" fill="url(#gradTopGrad)" stroke="#64748b" strokeWidth="0.5" />

      {/* Silk Top Edge Highlight */}
      <polyline points="1.5,9.2 12,4.5 22.5,9.2" stroke="#94a3b8" strokeWidth="0.6" strokeLinecap="round" />

      {/* Center Golden Button */}
      <circle cx="12" cy="9.2" r="1.1" fill="#facc15" stroke="#b45309" strokeWidth="0.3" />

      {/* Golden Silk Draped Tassel Cord */}
      <path d="M12 9.2C13.8 9.2 17.2 9.8 18.5 12.5C19.2 13.8 19.4 15.2 19.4 17" stroke="url(#tasselGoldGrad)" strokeWidth="0.95" strokeLinecap="round" fill="none" />
      
      {/* Tassel Knot Ring */}
      <ellipse cx="19.4" cy="17" rx="0.9" ry="0.6" fill="#facc15" stroke="#78350f" strokeWidth="0.3" />
      
      {/* Tassel Silk Fringe Brush */}
      <path d="M18.6 17.5L18.1 21.2C18.1 21.6 18.7 21.8 19.4 21.8C20.1 21.8 20.7 21.6 20.7 21.2L20.2 17.5Z" fill="url(#tasselGoldGrad)" stroke="#92400e" strokeWidth="0.25" />
    </svg>
  );
}


export function RealisticLock({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="lockShackleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#cbd5e1" />
          <stop offset="85%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="lockBodyGrad" x1="12" y1="9.5" x2="12" y2="22.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#facc15" />
          <stop offset="80%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>
      {/* Hardened Steel Shackle */}
      <path d="M7 10V6.5C7 3.7 9.2 1.5 12 1.5C14.8 1.5 17 3.7 17 6.5V10" stroke="url(#lockShackleGrad)" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Heavy Brass Lock Body */}
      <rect x="4" y="9.5" width="16" height="13" rx="2.5" fill="url(#lockBodyGrad)" stroke="#78350f" strokeWidth="0.6" />
      
      {/* Bevel Edge Specular Highlight */}
      <line x1="5.5" y1="11" x2="18.5" y2="11" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="0.8" strokeLinecap="round" />
      
      {/* Keyhole Cutout */}
      <circle cx="12" cy="14.5" r="1.6" fill="#1e293b" />
      <polygon points="11.2,15.2 12.8,15.2 12.4,18.5 11.6,18.5" fill="#1e293b" />
    </svg>
  );
}

export function RealisticShieldCheck({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="shieldRimGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="shieldEmeraldGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="40%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* Polished Gold Shield Rim */}
      <path d="M12 2L4 5.5V11C4 16.5 7.4 20.8 12 22C16.6 20.8 20 16.5 20 11V5.5L12 2Z" fill="url(#shieldRimGrad)" stroke="#78350f" strokeWidth="0.5" />
      
      {/* Inner Emerald Field */}
      <path d="M12 3.2L5.2 6.2V11C5.2 15.7 8.1 19.5 12 20.6C15.9 19.5 18.8 15.7 18.8 11V6.2L12 3.2Z" fill="url(#shieldEmeraldGrad)" stroke="#064e3b" strokeWidth="0.5" />
      
      {/* 3D Checkmark */}
      <polyline points="8.5,11.5 11,14.2 15.8,9.2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RealisticKey({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="keyGoldGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#facc15" />
          <stop offset="80%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
      {/* Key Bow Ring */}
      <circle cx="7.5" cy="12" r="5" fill="none" stroke="url(#keyGoldGrad)" strokeWidth="2.2" />
      {/* Key Stem */}
      <line x1="12.5" y1="12" x2="21.5" y2="12" stroke="url(#keyGoldGrad)" strokeWidth="2.2" strokeLinecap="round" />
      {/* Key Bit (Teeth) */}
      <path d="M18 12V16M21 12V15" stroke="url(#keyGoldGrad)" strokeWidth="2" strokeLinecap="round" />
      {/* Specular Inner Glint */}
      <circle cx="7.5" cy="12" r="3.2" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export function RealisticCrown({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="crownGoldGrad" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Crown Points */}
      <path d="M2.5 18.5H21.5L20 9L15 13.5L12 4.5L9 13.5L4 9L2.5 18.5Z" fill="url(#crownGoldGrad)" stroke="#78350f" strokeWidth="0.5" />
      
      {/* Headband with Jewels */}
      <rect x="2.5" y="17" width="19" height="3" rx="1" fill="#b45309" stroke="#78350f" strokeWidth="0.4" />
      <circle cx="6" cy="18.5" r="0.9" fill="#ef4444" />
      <circle cx="12" cy="18.5" r="1.1" fill="#06b6d4" />
      <circle cx="18" cy="18.5" r="0.9" fill="#10b981" />
      
      {/* Point Pearls */}
      <circle cx="4" cy="9" r="1.1" fill="#ffffff" stroke="#d97706" strokeWidth="0.4" />
      <circle cx="12" cy="4.5" r="1.3" fill="#ffffff" stroke="#d97706" strokeWidth="0.4" />
      <circle cx="20" cy="9" r="1.1" fill="#ffffff" stroke="#d97706" strokeWidth="0.4" />
    </svg>
  );
}

export function RealisticMapPin({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <radialGradient id="pinRedGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="85%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      {/* Ground Shadow */}
      <ellipse cx="12" cy="21.5" rx="5.5" ry="1.6" fill="#000000" opacity="0.4" />
      {/* Teardrop Pin */}
      <path d="M12 2C7.58 2 4 5.58 4 10C4 15.5 12 21.5 12 21.5C12 21.5 20 15.5 20 10C20 5.58 16.42 2 12 2Z" fill="url(#pinRedGrad)" stroke="#7f1d1d" strokeWidth="0.5" />
      {/* Glossy Reflection Highlight */}
      <ellipse cx="9" cy="6" rx="2" ry="1.2" fill="#ffffff" opacity="0.65" transform="rotate(-30 9 6)" />
      {/* Inner White Eye */}
      <circle cx="12" cy="10" r="3.2" fill="#ffffff" />
      <circle cx="12" cy="10" r="2.2" fill="#1e293b" />
    </svg>
  );
}

export function RealisticClock({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="clockBezelGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <radialGradient id="clockFaceGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>
      {/* Bezel Ring */}
      <circle cx="12" cy="12" r="10" fill="url(#clockBezelGrad)" stroke="#0c4a6e" strokeWidth="0.6" />
      {/* Clock Face */}
      <circle cx="12" cy="12" r="8.2" fill="url(#clockFaceGrad)" stroke="#94a3b8" strokeWidth="0.4" />
      {/* 12, 3, 6, 9 ticks */}
      <line x1="12" y1="4.8" x2="12" y2="6.2" stroke="#334155" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="12" y1="17.8" x2="12" y2="19.2" stroke="#334155" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="4.8" y1="12" x2="6.2" y2="12" stroke="#334155" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="17.8" y1="12" x2="19.2" y2="12" stroke="#334155" strokeWidth="0.9" strokeLinecap="round" />
      {/* Hour Hand */}
      <line x1="12" y1="12" x2="15" y2="12" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Minute Hand */}
      <line x1="12" y1="12" x2="12" y2="7" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
      {/* Second Hand (Red) */}
      <line x1="12" y1="13" x2="12" y2="6.2" stroke="#ef4444" strokeWidth="0.6" strokeLinecap="round" />
      {/* Center Rivet */}
      <circle cx="12" cy="12" r="1" fill="#ef4444" />
    </svg>
  );
}

export function RealisticTrophy({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="trophyGoldGrad" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#facc15" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="pedestalGrad" x1="12" y1="18" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* Trophy Handles */}
      <path d="M5.5 5.5H4C2.9 5.5 2 6.4 2 7.5C2 10 3.8 11.5 6.2 11.5" stroke="url(#trophyGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18.5 5.5H20C21.1 5.5 22 6.4 22 7.5C22 10 20.2 11.5 17.8 11.5" stroke="url(#trophyGoldGrad)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Cup Body */}
      <path d="M5.5 3.5H18.5V9C18.5 12.6 15.6 15.5 12 15.5C8.4 15.5 5.5 12.6 5.5 9V3.5Z" fill="url(#trophyGoldGrad)" stroke="#78350f" strokeWidth="0.5" />
      {/* Specular Highlight on Rim */}
      <line x1="6.5" y1="4.5" x2="17.5" y2="4.5" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
      {/* Stem */}
      <rect x="10.8" y="15.5" width="2.4" height="3" fill="url(#trophyGoldGrad)" stroke="#854d0e" strokeWidth="0.4" />
      {/* Pedestal Base */}
      <rect x="7" y="18.5" width="10" height="3.5" rx="1" fill="url(#pedestalGrad)" stroke="#cbd5e1" strokeWidth="0.4" />
      {/* Gold Plaque on Base */}
      <rect x="9.5" y="19.5" width="5" height="1.5" rx="0.4" fill="#fbbf24" />
      {/* Center Star on Cup */}
      <polygon points="12,7 12.8,8.8 14.8,9 13.3,10.4 13.8,12.3 12,11.2 10.2,12.3 10.7,10.4 9.2,9 11.2,8.8" fill="#ffffff" />
    </svg>
  );
}

export function RealisticUser({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        {/* Spherical Head with 3D Specular Highlight & Warm Radiant Gold */}
        <radialGradient id="userHeadGoldGrad" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#fef08a" />
          <stop offset="52%" stopColor="#f59e0b" />
          <stop offset="80%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>

        {/* Anatomical Neck Cylinder with Ambient Jaw Shadow */}
        <linearGradient id="userNeckShadowGrad" x1="12" y1="10" x2="12" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="60%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Torso / Shoulders Royal Velvet & Gold Trim */}
        <linearGradient id="userTorsoRoyalGrad" x1="12" y1="13.5" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="14%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#7e22ce" />
          <stop offset="85%" stopColor="#3b0764" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Specular Rim / Rimlight */}
        <linearGradient id="userRimLightGold" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#fef08a" stopOpacity="0.6" />
          <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>

        {/* Ground Occlusion Shadow */}
        <radialGradient id="userBaseOcclusion" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft Ground Shadow */}
      <ellipse cx="12" cy="22.2" rx="8" ry="1.6" fill="url(#userBaseOcclusion)" />

      {/* 3D Contoured Neck with Jaw Shadow */}
      <path
        d="M10.2 11.2C10.2 11.2 10.4 14 9.6 14.8C10.6 15.2 13.4 15.2 14.4 14.8C13.6 14 13.8 11.2 13.8 11.2Z"
        fill="url(#userNeckShadowGrad)"
        stroke="#78350f"
        strokeWidth="0.3"
      />

      {/* 3D Torso / Shoulders with Smooth Curved Arc */}
      <path
        d="M3.8 21.2C3.8 17.2 7.4 14.2 12 14.2C16.6 14.2 20.2 17.2 20.2 21.2C20.2 21.8 19.7 22.2 19.1 22.2H4.9C4.3 22.2 3.8 21.8 3.8 21.2Z"
        fill="url(#userTorsoRoyalGrad)"
        stroke="url(#userRimLightGold)"
        strokeWidth="0.6"
      />

      {/* Torso Top Lapel / Gold Bevel Line */}
      <path
        d="M8.2 16.2C9.4 14.8 11 14.3 12 14.3C13 14.3 14.6 14.8 15.8 16.2"
        stroke="#fef08a"
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* 3D Spherical Head */}
      <circle
        cx="12"
        cy="7.6"
        r="4.7"
        fill="url(#userHeadGoldGrad)"
        stroke="url(#userRimLightGold)"
        strokeWidth="0.6"
      />

      {/* Primary Specular Glint Oval on Head */}
      <ellipse
        cx="9.8"
        cy="5.6"
        rx="1.6"
        ry="0.9"
        transform="rotate(-28 9.8 5.6)"
        fill="#ffffff"
        fillOpacity="0.9"
      />
      {/* Secondary Cyan Ambient Bounce Reflection */}
      <path
        d="M15.5 8.5C15.8 9.5 15.2 10.8 14.2 11.5"
        stroke="#38bdf8"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.75"
      />
    </svg>
  );
}

export function RealisticUpload({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="cloudBodyGrad" x1="12" y1="8" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="arrowUpCyanGrad" x1="12" y1="3" x2="12" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Cloud Base with 3D Curvature */}
      <path
        d="M6.5 19H17.5C19.4 19 21 17.4 21 15.5C21 13.8 19.8 12.3 18.1 12.1C17.7 8.7 14.8 6 11.2 6C8.5 6 6.1 7.7 5.2 10.3C3.4 10.8 2 12.5 2 14.5C2 17 4 19 6.5 19Z"
        fill="url(#cloudBodyGrad)"
        stroke="#94a3b8"
        strokeWidth="0.5"
      />
      {/* 3D Ascending Arrow */}
      <path
        d="M12 3.5L7.2 9H10.2V16.5H13.8V9H16.8L12 3.5Z"
        fill="url(#arrowUpCyanGrad)"
        stroke="#ffffff"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* Specular Highlight along Arrow */}
      <polyline points="12,4.8 8.8,8.5 10.8,8.5V15.5" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export function RealisticCreditCard({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        {/* Soft Ambient Ground Shadow under Card */}
        <radialGradient id="ccDropShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#020617" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>

        {/* Brushed Obsidian Titanium Body */}
        <linearGradient id="ccBodyGrad" x1="2" y1="4" x2="22" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="25%" stopColor="#1e1b4b" />
          <stop offset="55%" stopColor="#0f172a" />
          <stop offset="85%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        {/* Polished Metallic Bevel / Rim Light */}
        <linearGradient id="ccRimGrad" x1="1" y1="4" x2="23" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#c084fc" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.9" />
        </linearGradient>

        {/* Diagonal Specular Anisotropic Sheen */}
        <linearGradient id="ccSheenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>

        {/* Gold EMV Microchip Gradients */}
        <linearGradient id="ccChipGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#facc15" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>

        {/* Holographic Prismatic Badge */}
        <linearGradient id="ccHoloGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
          <stop offset="33%" stopColor="#fbbf24" stopOpacity="0.85" />
          <stop offset="66%" stopColor="#34d399" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Realistic Ground Shadow */}
      <ellipse cx="12" cy="20.8" rx="8.5" ry="1.6" fill="url(#ccDropShadow)" />

      {/* Card 3D Thickness Edge (Bottom Bevel) */}
      <rect x="2" y="6.8" width="20" height="12.8" rx="2.2" fill="#030712" />

      {/* Card Main Face */}
      <rect
        x="2"
        y="5.2"
        width="20"
        height="13.2"
        rx="2.2"
        fill="url(#ccBodyGrad)"
        stroke="url(#ccRimGrad)"
        strokeWidth="0.65"
      />

      {/* Diagonal Light Streak Reflection */}
      <path
        d="M2 9.5L12 5.2H16L5 18.4H2V9.5Z"
        fill="url(#ccSheenGrad)"
      />
      <path
        d="M10 5.2L20 17.5V18.4H17.5L7.5 5.2H10Z"
        fill="#ffffff"
        fillOpacity="0.08"
      />

      {/* EMV Gold Smart Chip with Contact Micro-Grooves */}
      <g transform="translate(4.2, 7.8)">
        {/* Chip Body */}
        <rect x="0" y="0" width="4.4" height="3.5" rx="0.6" fill="url(#ccChipGold)" stroke="#78350f" strokeWidth="0.3" />
        {/* Chip Circuit Grooves */}
        <line x1="0" y1="1.75" x2="4.4" y2="1.75" stroke="#854d0e" strokeWidth="0.25" />
        <line x1="2.2" y1="0" x2="2.2" y2="3.5" stroke="#854d0e" strokeWidth="0.25" />
        <rect x="1.4" y="0.8" width="1.6" height="1.9" rx="0.3" fill="none" stroke="#713f12" strokeWidth="0.25" />
        {/* Specular Glint on Chip */}
        <circle cx="0.8" cy="0.6" r="0.35" fill="#ffffff" fillOpacity="0.85" />
      </g>

      {/* Contactless Waves Symbol ))) */}
      <g stroke="#ffffff" strokeOpacity="0.85" strokeLinecap="round" fill="none">
        <path d="M10.2 8.3C10.6 8.7 10.6 9.3 10.2 9.7" strokeWidth="0.45" />
        <path d="M11.2 7.6C12 8.4 12 9.6 11.2 10.4" strokeWidth="0.45" />
        <path d="M12.2 6.9C13.4 8.1 13.4 9.9 12.2 11.1" strokeWidth="0.45" />
      </g>

      {/* VIP Hologram Badge */}
      <rect x="17.8" y="7.5" width="2.6" height="2.2" rx="0.4" fill="url(#ccHoloGrad)" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.25" />

      {/* Embossed Card Numbers (•••• •••• •••• 2026) */}
      <g fill="#ffffff" fillOpacity="0.95" filter="drop-shadow(0 0.5px 0.5px rgba(0,0,0,0.9))">
        {/* Dot Clusters */}
        <circle cx="4.8" cy="13.2" r="0.55" />
        <circle cx="6.2" cy="13.2" r="0.55" />
        <circle cx="7.6" cy="13.2" r="0.55" />
        <circle cx="9.0" cy="13.2" r="0.55" />

        <circle cx="10.8" cy="13.2" r="0.55" />
        <circle cx="12.2" cy="13.2" r="0.55" />
        <circle cx="13.6" cy="13.2" r="0.55" />
        <circle cx="15.0" cy="13.2" r="0.55" />

        {/* 26 Micro-digits */}
        <text x="17" y="13.8" fontFamily="monospace" fontSize="2.2" fontWeight="900" fill="#ffffff" letterSpacing="-0.2">
          26
        </text>
      </g>

      {/* Cardholder Name & Expiry Subline */}
      <g fill="#ffffff" fillOpacity="0.65">
        <rect x="4.5" y="15.8" width="5.5" height="0.7" rx="0.35" />
        <rect x="11" y="15.8" width="3" height="0.7" rx="0.35" />
      </g>

      {/* Interlocking Translucent Payment Network Circles (Mastercard / VIP style) */}
      <g transform="translate(17.2, 14.8)">
        <circle cx="1" cy="1" r="1.4" fill="#ef4444" fillOpacity="0.9" />
        <circle cx="2.6" cy="1" r="1.4" fill="#f59e0b" fillOpacity="0.9" />
      </g>
    </svg>
  );
}


