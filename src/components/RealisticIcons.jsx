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

export function RealisticPalette({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <radialGradient id="paletteWoodGrad" cx="38%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="45%" stopColor="#d97706" />
          <stop offset="85%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>

      {/* Cast Shadow */}
      <path d="M12 2.5C6.5 2.5 2 6.8 2 12C2 17.5 6.5 21.5 12 21.5C14.2 21.5 15.5 20.2 15.5 18.5C15.5 17.6 15.1 16.9 14.5 16.3C14 15.7 13.7 15 13.7 14.2C13.7 12.6 15 11.3 16.6 11.3H18.5C20.7 11.3 22.5 9.5 22.5 7.3C22.5 4.6 17.8 2.5 12 2.5Z" fill="#020617" opacity="0.35" transform="translate(0, 0.9)" />

      {/* Polished Maple Wood Palette */}
      <path d="M12 2.5C6.5 2.5 2 6.8 2 12C2 17.5 6.5 21.5 12 21.5C14.2 21.5 15.5 20.2 15.5 18.5C15.5 17.6 15.1 16.9 14.5 16.3C14 15.7 13.7 15 13.7 14.2C13.7 12.6 15 11.3 16.6 11.3H18.5C20.7 11.3 22.5 9.5 22.5 7.3C22.5 4.6 17.8 2.5 12 2.5Z" fill="url(#paletteWoodGrad)" stroke="#78350f" strokeWidth="0.6" />

      {/* Thumb Hole with Inset Depth */}
      <ellipse cx="17.4" cy="16.5" rx="1.8" ry="2.2" fill="#1e293b" opacity="0.55" stroke="#78350f" strokeWidth="0.5" />

      {/* 5 3D Glossy Paint Blobs with Specular Glints */}
      {/* Crimson Red */}
      <ellipse cx="6.8" cy="7.2" rx="1.8" ry="1.6" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.3" />
      <circle cx="6.2" cy="6.6" r="0.5" fill="#ffffff" opacity="0.85" />

      {/* Sunshine Yellow */}
      <ellipse cx="11.8" cy="5.5" rx="1.8" ry="1.6" fill="#facc15" stroke="#ca8a04" strokeWidth="0.3" />
      <circle cx="11.2" cy="4.9" r="0.5" fill="#ffffff" opacity="0.85" />

      {/* Azure Blue */}
      <ellipse cx="16.8" cy="7" rx="1.8" ry="1.6" fill="#0284c7" stroke="#0369a1" strokeWidth="0.3" />
      <circle cx="16.2" cy="6.4" r="0.5" fill="#ffffff" opacity="0.85" />

      {/* Emerald Green */}
      <ellipse cx="5.6" cy="12.2" rx="1.8" ry="1.6" fill="#10b981" stroke="#047857" strokeWidth="0.3" />
      <circle cx="5" cy="11.6" r="0.5" fill="#ffffff" opacity="0.85" />

      {/* Royal Purple */}
      <ellipse cx="8" cy="17" rx="1.8" ry="1.6" fill="#a855f7" stroke="#7e22ce" strokeWidth="0.3" />
      <circle cx="7.4" cy="16.4" r="0.5" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

export function RealisticCompass({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="brassBezelGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#facc15" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <radialGradient id="compassDialGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="70%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>

      {/* Pocket Watch Top Ring */}
      <circle cx="12" cy="2.5" r="1.8" stroke="url(#brassBezelGrad)" strokeWidth="0.9" fill="none" />

      {/* Bezel Outer Shadow */}
      <circle cx="12" cy="13" r="9.5" fill="#090d16" opacity="0.4" />

      {/* Heavy Polished Brass Casing */}
      <circle cx="12" cy="13" r="9.5" fill="url(#brassBezelGrad)" stroke="#78350f" strokeWidth="0.6" />
      
      {/* Inner Bezel Ring */}
      <circle cx="12" cy="13" r="8.2" fill="url(#compassDialGrad)" stroke="#facc15" strokeWidth="0.4" />

      {/* Cardinal Rose Ticks */}
      <line x1="12" y1="5.6" x2="12" y2="7.4" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18.6" x2="12" y2="20.4" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="4.6" y1="13" x2="6.4" y2="13" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="17.6" y1="13" x2="19.4" y2="13" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />

      {/* Diagonal Sub-ticks */}
      <circle cx="7.2" cy="8.2" r="0.4" fill="#64748b" />
      <circle cx="16.8" cy="8.2" r="0.4" fill="#64748b" />
      <circle cx="7.2" cy="17.8" r="0.4" fill="#64748b" />
      <circle cx="16.8" cy="17.8" r="0.4" fill="#64748b" />

      {/* 3D Magnetic Compass Needle */}
      {/* North Needle - Red (Light Side) */}
      <polygon points="12,6.5 12,13 10.3,13" fill="#f87171" />
      {/* North Needle - Red (Dark Side) */}
      <polygon points="12,6.5 13.7,13 12,13" fill="#dc2626" />

      {/* South Needle - Silver Chrome (Light Side) */}
      <polygon points="12,19.5 10.3,13 12,13" fill="#ffffff" />
      {/* South Needle - Silver Chrome (Dark Side) */}
      <polygon points="12,19.5 12,13 13.7,13" fill="#94a3b8" />

      {/* Center Brass Rivet Pin */}
      <circle cx="12" cy="13" r="1.5" fill="#fde047" stroke="#854d0e" strokeWidth="0.4" />
      <circle cx="11.6" cy="12.6" r="0.45" fill="#ffffff" />
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

export function RealisticTicket({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="ticketGoldGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#fbbf24" />
          <stop offset="65%" stopColor="#f59e0b" />
          <stop offset="90%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="ticketSheenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Cast Shadow */}
      <path d="M2 7C2 5.6 3.1 4.5 4.5 4.5H19.5C20.9 4.5 22 5.6 22 7C20.6 7 19.5 8.1 19.5 9.5C19.5 10.9 22 10.9 22 12C20.6 12 19.5 13.1 19.5 14.5C19.5 15.9 20.6 17 22 17C22 18.4 20.9 19.5 19.5 19.5H4.5C3.1 19.5 2 18.4 2 17C3.4 17 4.5 15.9 4.5 14.5C4.5 13.1 2 13.1 2 12C3.4 12 4.5 10.9 4.5 9.5C4.5 8.1 3.4 7 2 7Z" fill="#000000" opacity="0.35" transform="translate(0, 0.9)" />

      {/* Ticket Body with Notched Edge cutouts */}
      <path d="M2 7C2 5.6 3.1 4.5 4.5 4.5H19.5C20.9 4.5 22 5.6 22 7C20.6 7 19.5 8.1 19.5 9.5C19.5 10.9 22 10.9 22 12C20.6 12 19.5 13.1 19.5 14.5C19.5 15.9 20.6 17 22 17C22 18.4 20.9 19.5 19.5 19.5H4.5C3.1 19.5 2 18.4 2 17C3.4 17 4.5 15.9 4.5 14.5C4.5 13.1 2 13.1 2 12C3.4 12 4.5 10.9 4.5 9.5C4.5 8.1 3.4 7 2 7Z" fill="url(#ticketGoldGrad)" stroke="#78350f" strokeWidth="0.5" />

      {/* Holographic Sheen Layer */}
      <path d="M2 7C2 5.6 3.1 4.5 4.5 4.5H19.5C20.9 4.5 22 5.6 22 7C20.6 7 19.5 8.1 19.5 9.5C19.5 10.9 22 10.9 22 12C20.6 12 19.5 13.1 19.5 14.5C19.5 15.9 20.6 17 22 17C22 18.4 20.9 19.5 19.5 19.5H4.5C3.1 19.5 2 18.4 2 17C3.4 17 4.5 15.9 4.5 14.5C4.5 13.1 2 13.1 2 12C3.4 12 4.5 10.9 4.5 9.5C4.5 8.1 3.4 7 2 7Z" fill="url(#ticketSheenGrad)" />

      {/* Perforation Dashed Line */}
      <line x1="8" y1="5.5" x2="8" y2="18.5" stroke="#78350f" strokeWidth="0.75" strokeDasharray="1 1.2" />

      {/* Stub Barcode Lines */}
      <rect x="4.4" y="8" width="0.8" height="8" rx="0.3" fill="#78350f" />
      <rect x="5.8" y="9" width="0.6" height="6" rx="0.3" fill="#78350f" />

      {/* VIP Pass Emblem Star */}
      <path d="M14.5 7.8L15.6 10.2L18.2 10.5L16.3 12.3L16.8 14.9L14.5 13.6L12.2 14.9L12.7 12.3L10.8 10.5L13.4 10.2L14.5 7.8Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="0.3" />

      {/* Sparkle Glint */}
      <circle cx="17.8" cy="8.2" r="0.6" fill="#ffffff" />
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


