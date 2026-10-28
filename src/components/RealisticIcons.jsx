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
        {/* Leather/Acrylic Binder Header */}
        <linearGradient id="calHeadRed" x1="12" y1="2.5" x2="12" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="30%" stopColor="#f43f5e" />
          <stop offset="70%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Header Specular Gloss Flare */}
        <linearGradient id="calHeadSheen" x1="2" y1="3" x2="22" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Paper Sheet 3D Gradient */}
        <linearGradient id="calPaperSurface" x1="12" y1="8" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        {/* Stacked Sheet Edges Underneath */}
        <linearGradient id="calUnderPaper" x1="12" y1="18" x2="12" y2="22.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Polished Chrome Twin Binding Coils */}
        <linearGradient id="calChromeCoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f1f5f9" />
          <stop offset="65%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* 24K Gold Event Date Plaque */}
        <linearGradient id="calGoldPlaque" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* 1. Ground Drop Shadow under Calendar Block */}
      <rect x="2.5" y="5" width="19" height="17" rx="2.5" fill="#000000" opacity="0.45" />

      {/* 2. Stacked Under-Paper Page 2 (Right & Bottom Depth) */}
      <rect x="2.8" y="4.5" width="18.8" height="17.5" rx="2.4" fill="url(#calUnderPaper)" stroke="#64748b" strokeWidth="0.3" />

      {/* 3. Main Thick Cardstock Paper Page */}
      <rect x="2" y="3.8" width="20" height="18" rx="2.4" fill="url(#calPaperSurface)" stroke="#cbd5e1" strokeWidth="0.5" />

      {/* 4. Glossy Crimson Leather Header Bar */}
      <path d="M2 6.2C2 4.9 3.1 4.8 4.4 3.8H19.6C20.9 3.8 22 4.9 22 6.2V9.8H2V6.2Z" fill="url(#calHeadRed)" />

      {/* 5. Header Specular Gloss Streak */}
      <path d="M2.5 4.3C3.2 4 4 3.9 4.8 3.9H19.2C20 3.9 20.8 4 21.5 4.3L18.5 9.5H5.5L2.5 4.3Z" fill="url(#calHeadSheen)" />

      {/* 6. Gold Embossed Accent Trim */}
      <line x1="2" y1="9.8" x2="22" y2="9.8" stroke="#f59e0b" strokeWidth="0.65" />
      <line x1="2.5" y1="10.3" x2="21.5" y2="10.3" stroke="#4c0519" strokeWidth="0.4" />

      {/* 7. Chrome Twin Spiral Rings with Cast Shadows */}
      {/* Ring 1 (Left) */}
      <ellipse cx="6" cy="6" rx="1.1" ry="0.5" fill="#4c0519" opacity="0.7" />
      <rect x="5.1" y="1.8" width="1.8" height="4.4" rx="0.9" fill="url(#calChromeCoil)" stroke="#0f172a" strokeWidth="0.3" />
      <line x1="5.6" y1="2.2" x2="5.6" y2="5.8" stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" />

      {/* Ring 2 (Center) */}
      <ellipse cx="12" cy="6" rx="1.1" ry="0.5" fill="#4c0519" opacity="0.7" />
      <rect x="11.1" y="1.8" width="1.8" height="4.4" rx="0.9" fill="url(#calChromeCoil)" stroke="#0f172a" strokeWidth="0.3" />
      <line x1="11.6" y1="2.2" x2="11.6" y2="5.8" stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" />

      {/* Ring 3 (Right) */}
      <ellipse cx="18" cy="6" rx="1.1" ry="0.5" fill="#4c0519" opacity="0.7" />
      <rect x="17.1" y="1.8" width="1.8" height="4.4" rx="0.9" fill="url(#calChromeCoil)" stroke="#0f172a" strokeWidth="0.3" />
      <line x1="17.6" y1="2.2" x2="17.6" y2="5.8" stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" />

      {/* 8. Weekday Micro-Indicator Divider */}
      <line x1="4.2" y1="11.8" x2="19.8" y2="11.8" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1.2 1.2" />

      {/* 9. Calendar Grid Cells */}
      {/* Row 1 */}
      <circle cx="5.6" cy="13.8" r="0.95" fill="#64748b" />
      <circle cx="9.8" cy="13.8" r="0.95" fill="#64748b" />
      <circle cx="14" cy="13.8" r="0.95" fill="#64748b" />
      <circle cx="18.2" cy="13.8" r="0.95" fill="#64748b" />

      {/* Row 2 */}
      <circle cx="5.6" cy="16.8" r="0.95" fill="#64748b" />
      <circle cx="9.8" cy="16.8" r="0.95" fill="#64748b" />

      {/* 3D Highlighted Event Plaque for Party Night Date (Oct 24) */}
      <rect x="12.3" y="15.2" width="3.4" height="3.2" rx="0.9" fill="url(#calGoldPlaque)" stroke="#b45309" strokeWidth="0.4" />
      <circle cx="14" cy="16.8" r="0.85" fill="#ffffff" />
      <circle cx="18.2" cy="16.8" r="0.95" fill="#64748b" />

      {/* Row 3 */}
      <circle cx="5.6" cy="19.8" r="0.95" fill="#64748b" />
      <circle cx="9.8" cy="19.8" r="0.95" fill="#64748b" />
      <circle cx="14" cy="19.8" r="0.95" fill="#0ea5e9" />
      <circle cx="18.2" cy="19.8" r="0.95" fill="#64748b" />
    </svg>
  );
}

/**
 * Photorealistic 3D Skeuomorphic Calendar Logo Badge
 * Chamfered titanium & obsidian glass emblem with 3D stacked calendar, chrome rings & gold accent.
 */
export function RealisticCalendarLogoBadge({ className = "w-10 h-10", ...props }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        {/* Outer Titanium / Cyan Bevel Rim */}
        <linearGradient id="calBadgeRimGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="25%" stopColor="#0284c7" />
          <stop offset="65%" stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
        <linearGradient id="calBadgeRimStroke" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#0369a1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
        </linearGradient>

        {/* Deep Obsidian Glass Floor */}
        <radialGradient id="calBadgeFloor" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#080d1a" />
          <stop offset="100%" stopColor="#02040a" />
        </radialGradient>

        {/* Inner Cyan Spotlight Glow */}
        <radialGradient id="calBadgeInnerGlow" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>

        {/* Calendar Leather Header Banner */}
        <linearGradient id="calBadgeHeaderGrad" x1="24" y1="11" x2="24" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="25%" stopColor="#f43f5e" />
          <stop offset="70%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Calendar Cardstock Page */}
        <linearGradient id="calBadgePaperGrad" x1="24" y1="18" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        {/* Polished Chrome Coil */}
        <linearGradient id="calBadgeChromeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f1f5f9" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* 24K Gold Highlight Plaque */}
        <linearGradient id="calBadgeGoldPlaque" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* 1. Deep 3D Cast Shadow */}
      <rect x="3" y="5" width="42" height="40" rx="12" fill="#000000" opacity="0.65" />

      {/* 2. Outer Chamfered Titanium Bezel */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#calBadgeRimGrad)" stroke="url(#calBadgeRimStroke)" strokeWidth="1.2" />

      {/* 3. Obsidian Glass Floor */}
      <rect x="3.6" y="3.6" width="40.8" height="40.8" rx="10.8" fill="url(#calBadgeFloor)" stroke="#0f172a" strokeWidth="0.6" />

      {/* 4. Ambient Cyan Spotlight Flare Behind Calendar */}
      <rect x="3.6" y="3.6" width="40.8" height="40.8" rx="10.8" fill="url(#calBadgeInnerGlow)" />

      {/* 5. Top Specular Bevel Edge Light */}
      <path d="M7 4.6H41" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" strokeLinecap="round" />

      {/* 6. Diagonal Gloss Glass Reflection Sheen */}
      <path d="M3.6 17L27 3.6H38L3.6 30V17Z" fill="#ffffff" fillOpacity="0.09" />

      {/* ================= 3D CALENDAR OBJECT ================= */}
      {/* Calendar Cast Shadow onto Obsidian Floor */}
      <rect x="8.5" y="13.5" width="31" height="26" rx="4" fill="#000000" opacity="0.5" />

      {/* Layer 1: Under-Paper Stack Sheet 1 */}
      <rect x="10" y="12.2" width="28" height="26.8" rx="3.5" fill="#94a3b8" />
      {/* Layer 2: Under-Paper Stack Sheet 2 */}
      <rect x="9.5" y="11.5" width="29" height="27" rx="3.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.3" />

      {/* Layer 3: Main Thick Bright Cardstock Page */}
      <rect x="9" y="11" width="30" height="27" rx="3.5" fill="url(#calBadgePaperGrad)" stroke="#cbd5e1" strokeWidth="0.6" />

      {/* Glossy Cherry Red Leather Header Banner */}
      <path d="M9 14.5C9 12.6 10.6 11 12.5 11H35.5C37.4 11 39 12.6 39 14.5V19.5H9V14.5Z" fill="url(#calBadgeHeaderGrad)" />
      
      {/* Header Specular Gloss Streak */}
      <path d="M10 11.8C10.8 11.3 11.8 11.1 13 11.1H35C36.2 11.1 37.2 11.3 38 11.8L35 18.5H13L10 11.8Z" fill="#ffffff" fillOpacity="0.32" />
      {/* Gold Trim Line at bottom of red header */}
      <line x1="9" y1="19.5" x2="39" y2="19.5" stroke="#f59e0b" strokeWidth="0.75" />
      <line x1="9.5" y1="20.2" x2="38.5" y2="20.2" stroke="#4c0519" strokeWidth="0.5" />

      {/* Chrome Twin-Wire Binding Rings */}
      {/* Ring 1 */}
      <ellipse cx="15.8" cy="14" rx="1.6" ry="0.8" fill="#4c0519" opacity="0.65" />
      <rect x="14.4" y="7.5" width="2.8" height="6.5" rx="1.4" fill="url(#calBadgeChromeGrad)" stroke="#0f172a" strokeWidth="0.4" />
      <line x1="15.2" y1="8.2" x2="15.2" y2="13.2" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" />

      {/* Ring 2 (Center) */}
      <ellipse cx="24" cy="14" rx="1.6" ry="0.8" fill="#4c0519" opacity="0.65" />
      <rect x="22.6" y="7.5" width="2.8" height="6.5" rx="1.4" fill="url(#calBadgeChromeGrad)" stroke="#0f172a" strokeWidth="0.4" />
      <line x1="23.4" y1="8.2" x2="23.4" y2="13.2" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" />

      {/* Ring 3 */}
      <ellipse cx="32.2" cy="14" rx="1.6" ry="0.8" fill="#4c0519" opacity="0.65" />
      <rect x="30.8" y="7.5" width="2.8" height="6.5" rx="1.4" fill="url(#calBadgeChromeGrad)" stroke="#0f172a" strokeWidth="0.4" />
      <line x1="31.6" y1="8.2" x2="31.6" y2="13.2" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" />

      {/* Weekday Micro-Indicator Bar */}
      <line x1="12" y1="22.5" x2="36" y2="22.5" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="1.5 1.5" />

      {/* Calendar Grid Date Dots */}
      {/* Row 1 */}
      <circle cx="14.5" cy="25.5" r="1.2" fill="#64748b" />
      <circle cx="20.8" cy="25.5" r="1.2" fill="#64748b" />
      <circle cx="27.2" cy="25.5" r="1.2" fill="#64748b" />
      <circle cx="33.5" cy="25.5" r="1.2" fill="#64748b" />

      {/* Row 2 */}
      <circle cx="14.5" cy="29.8" r="1.2" fill="#64748b" />
      <circle cx="20.8" cy="29.8" r="1.2" fill="#64748b" />
      
      {/* 24K Gold 3D Highlight Plaque (Event Day) */}
      <rect x="24.5" y="27.5" width="5.4" height="4.8" rx="1.5" fill="url(#calBadgeGoldPlaque)" stroke="#b45309" strokeWidth="0.5" />
      <circle cx="27.2" cy="29.9" r="1.2" fill="#ffffff" />
      <circle cx="33.5" cy="29.8" r="1.2" fill="#64748b" />

      {/* Row 3 */}
      <circle cx="14.5" cy="34" r="1.2" fill="#64748b" />
      <circle cx="20.8" cy="34" r="1.2" fill="#64748b" />
      <circle cx="27.2" cy="34" r="1.2" fill="#0ea5e9" />
      <circle cx="33.5" cy="34" r="1.2" fill="#64748b" />
    </svg>
  );
}

/**
 * Photorealistic 3D Skeuomorphic Location Logo Badge
 * Chamfered titanium & obsidian glass emblem with 3D sculpted ruby beacon pin & laser core.
 */
export function RealisticLocationLogoBadge({ className = "w-10 h-10", ...props }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        {/* Outer Titanium / Cyan Bevel Rim */}
        <linearGradient id="locBadgeRimGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="25%" stopColor="#0284c7" />
          <stop offset="65%" stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
        <linearGradient id="locBadgeRimStroke" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#0369a1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
        </linearGradient>

        {/* Deep Obsidian Glass Floor */}
        <radialGradient id="locBadgeFloor" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#080d1a" />
          <stop offset="100%" stopColor="#02040a" />
        </radialGradient>

        {/* Ambient Cyan Spotlight Flare Behind Pin */}
        <radialGradient id="locBadgeInnerGlow" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>

        {/* 3D Ruby Teardrop Pin Gradient */}
        <radialGradient id="locBadgeRubyGrad" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="25%" stopColor="#f43f5e" />
          <stop offset="60%" stopColor="#e11d48" />
          <stop offset="85%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
        <linearGradient id="locBadgeRubyStroke" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#f43f5e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4c0519" stopOpacity="0.95" />
        </linearGradient>

        {/* Pin Chrome Lens Bezel */}
        <radialGradient id="locBadgeChromeBezel" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </radialGradient>

        {/* Obsidian Lens Iris */}
        <radialGradient id="locBadgeObsidianIris" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="70%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>

        {/* Radiant Cyan Laser Pupil */}
        <radialGradient id="locBadgeLaserPupil" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="75%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </radialGradient>
      </defs>

      {/* 1. Deep 3D Cast Shadow */}
      <rect x="3" y="5" width="42" height="40" rx="12" fill="#000000" opacity="0.65" />

      {/* 2. Outer Chamfered Titanium Bezel */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#locBadgeRimGrad)" stroke="url(#locBadgeRimStroke)" strokeWidth="1.2" />

      {/* 3. Obsidian Glass Floor */}
      <rect x="3.6" y="3.6" width="40.8" height="40.8" rx="10.8" fill="url(#locBadgeFloor)" stroke="#0f172a" strokeWidth="0.6" />

      {/* 4. Ambient Cyan Spotlight Flare Behind Pin */}
      <rect x="3.6" y="3.6" width="40.8" height="40.8" rx="10.8" fill="url(#locBadgeInnerGlow)" />

      {/* 5. Top Specular Bevel Edge Light */}
      <path d="M7 4.6H41" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" strokeLinecap="round" />

      {/* 6. Diagonal Gloss Glass Reflection Sheen */}
      <path d="M3.6 17L27 3.6H38L3.6 30V17Z" fill="#ffffff" fillOpacity="0.09" />

      {/* ================= 3D RUBY BEACON PIN ================= */}
      {/* Soft Contact Shadow below pin tip */}
      <ellipse cx="24" cy="39" rx="8.5" ry="2.6" fill="#000000" opacity="0.65" />

      {/* Chrome Needle Tip touching the ground */}
      <polygon points="24,39 22.8,32 25.2,32" fill="#cbd5e1" stroke="#334155" strokeWidth="0.3" />

      {/* Volumetric 3D Teardrop Pin Body */}
      <path
        d="M24 8C16.8 8 11 13.8 11 21C11 29.5 22.5 37.8 23.2 38.3C23.7 38.6 24.3 38.6 24.8 38.3C25.5 37.8 37 29.5 37 21C37 13.8 31.2 8 24 8Z"
        fill="url(#locBadgeRubyGrad)"
        stroke="url(#locBadgeRubyStroke)"
        strokeWidth="0.85"
      />

      {/* Curved Glossy Glass Sheen on Top-Left Dome */}
      <path
        d="M15 16C17 11.5 20.5 9.5 24 9.5C25.5 9.5 26.5 9.8 27.5 10.3C23.5 11 18.5 14.5 16.5 19.5C15.8 18.2 15.3 17.2 15 16Z"
        fill="#ffffff"
        fillOpacity="0.75"
      />

      {/* Outer Polished Chrome Bezel for Optic Lens */}
      <circle cx="24" cy="20.5" r="6.2" fill="url(#locBadgeChromeBezel)" stroke="#334155" strokeWidth="0.5" />

      {/* Deep Obsidian Iris with Inset Shadow */}
      <circle cx="24" cy="20.5" r="4.8" fill="url(#locBadgeObsidianIris)" stroke="#0c4a6e" strokeWidth="0.4" />

      {/* Glowing Radiant Cyan Laser Core */}
      <circle cx="24" cy="20.5" r="2.8" fill="url(#locBadgeLaserPupil)" />
      
      {/* Specular White Lens Reflection Glints */}
      <circle cx="24" cy="20.5" r="1.3" fill="#ffffff" />
      <circle cx="22.6" cy="19.2" r="0.7" fill="#e0f2fe" opacity="0.9" />
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
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="25%" stopColor="#f43f5e" />
          <stop offset="60%" stopColor="#e11d48" />
          <stop offset="85%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
        <radialGradient id="pinShadowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#020617" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pinRimGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4c0519" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="pinLensGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
        <radialGradient id="pinCoreGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>
      </defs>

      {/* Realistic Soft Contact Shadow */}
      <ellipse cx="12" cy="22" rx="6" ry="1.8" fill="url(#pinShadowGrad)" />

      {/* Teardrop Pin Body */}
      <path
        d="M12 2C7.3 2 3.5 5.8 3.5 10.5C3.5 16.2 11 21.8 11.4 22.1C11.6 22.2 11.8 22.3 12 22.3C12.2 22.3 12.4 22.2 12.6 22.1C13 21.8 20.5 16.2 20.5 10.5C20.5 5.8 16.7 2 12 2Z"
        fill="url(#pinRedGrad)"
        stroke="url(#pinRimGrad)"
        strokeWidth="0.6"
      />

      {/* Curved Glossy Glass Sheen on Top-Left */}
      <path
        d="M6 7.5C7.2 4.5 10 3 12.5 3C13.5 3 14 3.2 14.5 3.5C11.8 4 8.5 6.2 7 9.5C6.5 8.7 6.2 8.1 6 7.5Z"
        fill="#ffffff"
        opacity="0.65"
      />

      {/* Outer Chrome Bezel for Lens */}
      <circle cx="12" cy="10.2" r="4.2" fill="url(#pinLensGrad)" stroke="#475569" strokeWidth="0.4" />

      {/* Deep Obsidian Iris with Specular Ring */}
      <circle cx="12" cy="10.2" r="3" fill="url(#pinCoreGrad)" stroke="#0c4a6e" strokeWidth="0.3" />
      
      {/* Glowing Center Pupil Core */}
      <circle cx="12" cy="10.2" r="1.3" fill="#ffffff" />
      <circle cx="11.4" cy="9.6" r="0.5" fill="#e0f2fe" opacity="0.9" />
    </svg>
  );
}

export function RealisticClock({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <radialGradient id="clockBezelGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0ea5e9" />
          <stop offset="75%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </radialGradient>
        <radialGradient id="clockFaceGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        <linearGradient id="clockRimHighlight" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#082f49" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Clock Ground / Drop Shadow */}
      <circle cx="12" cy="12.8" r="9.8" fill="#020617" opacity="0.35" />

      {/* Metallic Cyan Outer Bezel */}
      <circle cx="12" cy="12" r="10" fill="url(#clockBezelGrad)" stroke="url(#clockRimHighlight)" strokeWidth="0.75" />

      {/* Inner Stepped Bezel Ring */}
      <circle cx="12" cy="12" r="8.8" fill="#0369a1" stroke="#082f49" strokeWidth="0.3" />

      {/* Clock Face Dial */}
      <circle cx="12" cy="12" r="8.2" fill="url(#clockFaceGrad)" stroke="#94a3b8" strokeWidth="0.4" />

      {/* Major 12, 3, 6, 9 Steel Batons */}
      <line x1="12" y1="4.6" x2="12" y2="6.4" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="17.6" x2="12" y2="19.4" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
      <line x1="4.6" y1="12" x2="6.4" y2="12" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
      <line x1="17.6" y1="12" x2="19.4" y2="12" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />

      {/* Minor Hour Tick Marks */}
      <line x1="16.5" y1="7.5" x2="15.4" y2="8.6" stroke="#64748b" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="7.5" y1="16.5" x2="8.6" y2="15.4" stroke="#64748b" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="16.5" y1="16.5" x2="15.4" y2="15.4" stroke="#64748b" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="7.5" y1="7.5" x2="8.6" y2="8.6" stroke="#64748b" strokeWidth="0.6" strokeLinecap="round" />

      {/* Hand Cast Shadows */}
      <line x1="12" y1="12.5" x2="15.8" y2="12.5" stroke="#020617" strokeOpacity="0.3" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="12.5" x2="12" y2="6.8" stroke="#020617" strokeOpacity="0.3" strokeWidth="1.1" strokeLinecap="round" />

      {/* 3D Hour Hand */}
      <line x1="12" y1="12" x2="15.5" y2="12" stroke="#0f172a" strokeWidth="1.3" strokeLinecap="round" />
      {/* 3D Minute Hand */}
      <line x1="12" y1="12" x2="12" y2="6.5" stroke="#0f172a" strokeWidth="1.1" strokeLinecap="round" />

      {/* Polished Red Second Hand with Counterbalance */}
      <line x1="12" y1="14" x2="12" y2="5.8" stroke="#ef4444" strokeWidth="0.55" strokeLinecap="round" />
      <circle cx="12" cy="14" r="0.6" fill="#ef4444" />

      {/* Center Rivet */}
      <circle cx="12" cy="12" r="1.1" fill="#b91c1c" stroke="#fef08a" strokeWidth="0.3" />

      {/* Glass Dome Curved Reflection */}
      <path d="M5.5 8C7.5 5.5 10.5 4.5 14 4.5C16.5 4.5 17.5 5 18.5 6C15.5 6.5 12 8 8 11.5L5.5 8Z" fill="#ffffff" fillOpacity="0.35" />
    </svg>
  );
}

export function RealisticCompass({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <radialGradient id="compassBezelGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
        <radialGradient id="compassDialGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="75%" stopColor="#020617" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <linearGradient id="needleNorthGrad" x1="12" y1="5" x2="12" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="40%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="needleSouthGrad" x1="12" y1="12" x2="12" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="60%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Soft Contact Shadow */}
      <circle cx="12" cy="12.8" r="9.6" fill="#020617" opacity="0.4" />

      {/* Outer Knurled Marine Brass Bezel */}
      <circle cx="12" cy="12" r="10" fill="url(#compassBezelGrad)" stroke="#451a03" strokeWidth="0.6" />

      {/* Inner Brass Rim Highlight */}
      <circle cx="12" cy="12" r="8.8" fill="#78350f" stroke="#fde047" strokeWidth="0.3" strokeOpacity="0.8" />

      {/* Deep Obsidian Navigational Dial */}
      <circle cx="12" cy="12" r="8.2" fill="url(#compassDialGrad)" stroke="#1e293b" strokeWidth="0.4" />

      {/* 8-Point Compass Rose Facets */}
      <polygon points="12,5.2 13.2,10.8 12,12" fill="#e2e8f0" fillOpacity="0.4" />
      <polygon points="12,5.2 10.8,10.8 12,12" fill="#64748b" fillOpacity="0.4" />
      <polygon points="18.8,12 13.2,13.2 12,12" fill="#e2e8f0" fillOpacity="0.4" />
      <polygon points="18.8,12 13.2,10.8 12,12" fill="#64748b" fillOpacity="0.4" />
      <polygon points="12,18.8 10.8,13.2 12,12" fill="#e2e8f0" fillOpacity="0.4" />
      <polygon points="12,18.8 13.2,13.2 12,12" fill="#64748b" fillOpacity="0.4" />
      <polygon points="5.2,12 10.8,10.8 12,12" fill="#e2e8f0" fillOpacity="0.4" />
      <polygon points="5.2,12 10.8,13.2 12,12" fill="#64748b" fillOpacity="0.4" />

      {/* Degree Markers */}
      <circle cx="12" cy="4.8" r="0.6" fill="#f87171" />
      <circle cx="19.2" cy="12" r="0.5" fill="#fde047" />
      <circle cx="12" cy="19.2" r="0.5" fill="#fde047" />
      <circle cx="4.8" cy="12" r="0.5" fill="#fde047" />

      {/* Magnetic Needle - North (Ruby Crimson with Silver Tip) */}
      <polygon points="12,4.8 13.5,12 12,11.2" fill="url(#needleNorthGrad)" stroke="#7f1d1d" strokeWidth="0.25" />
      <polygon points="12,4.8 10.5,12 12,11.2" fill="#fca5a5" stroke="#7f1d1d" strokeWidth="0.25" />

      {/* Magnetic Needle - South (Blued Steel) */}
      <polygon points="12,19.2 13.5,12 12,12.8" fill="url(#needleSouthGrad)" stroke="#0f172a" strokeWidth="0.25" />
      <polygon points="12,19.2 10.5,12 12,12.8" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.25" />

      {/* Center Brass Pivot Cap with Ruby Core */}
      <circle cx="12" cy="12" r="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.3" />
      <circle cx="12" cy="12" r="0.8" fill="#dc2626" />
      <circle cx="11.7" cy="11.7" r="0.3" fill="#ffffff" />

      {/* Glass Glint Reflection */}
      <path d="M6 8C7.8 5.6 10.5 4.6 13.8 4.6C16.2 4.6 17.5 5.2 18.2 6C15.2 6.5 12 8 8 11.5L6 8Z" fill="#ffffff" fillOpacity="0.35" />
    </svg>
  );
}

export function RealisticNavigation({ className = "w-4 h-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="navLeftGrad" x1="3" y1="12" x2="12" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="navRightGrad" x1="21" y1="12" x2="12" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="navRimGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Dynamic 3D Cast Shadow */}
      <polygon points="12,4.5 21,20.8 12,17.2 3,20.8" fill="#020617" opacity="0.45" transform="translate(0, 1.2)" />

      {/* Left Illuminated Wing */}
      <polygon points="12,2 3,19.5 12,16" fill="url(#navLeftGrad)" stroke="url(#navRimGrad)" strokeWidth="0.5" />

      {/* Right Shadowed Wing */}
      <polygon points="12,2 21,19.5 12,16" fill="url(#navRightGrad)" stroke="url(#navRimGrad)" strokeWidth="0.5" />

      {/* Center Spine Ridge Highlight */}
      <line x1="12" y1="2" x2="12" y2="16" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />

      {/* Specular Tip Glint */}
      <circle cx="12" cy="2.5" r="0.75" fill="#ffffff" />
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
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="85%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>

        {/* Anatomical Neck Cylinder with Warm Ambient Jaw Shadow */}
        <linearGradient id="userNeckShadowGrad" x1="12" y1="10" x2="12" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>

        {/* Torso / Shoulders Radiant Royal Velvet & Bright Gold Trim */}
        <linearGradient id="userTorsoRoyalGrad" x1="12" y1="13.5" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="18%" stopColor="#e879f9" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="80%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>

        {/* Specular Rim / Rimlight */}
        <linearGradient id="userRimLightGold" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor="#fef08a" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        {/* Ground Occlusion Shadow */}
        <radialGradient id="userBaseOcclusion" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft Ground Shadow */}
      <ellipse cx="12" cy="22.2" rx="8" ry="1.6" fill="url(#userBaseOcclusion)" />

      {/* 3D Contoured Neck with Jaw Shadow */}
      <path
        d="M10.2 11.2C10.2 11.2 10.4 14 9.6 14.8C10.6 15.2 13.4 15.2 14.4 14.8C13.6 14 13.8 11.2 13.8 11.2Z"
        fill="url(#userNeckShadowGrad)"
        stroke="#92400e"
        strokeWidth="0.3"
      />

      {/* 3D Torso / Shoulders with Smooth Curved Arc */}
      <path
        d="M3.8 21.2C3.8 17.2 7.4 14.2 12 14.2C16.6 14.2 20.2 17.2 20.2 21.2C20.2 21.8 19.7 22.2 19.1 22.2H4.9C4.3 22.2 3.8 21.8 3.8 21.2Z"
        fill="url(#userTorsoRoyalGrad)"
        stroke="url(#userRimLightGold)"
        strokeWidth="0.75"
      />

      {/* Torso Top Lapel / Gold Bevel Line */}
      <path
        d="M8.2 16.2C9.4 14.8 11 14.3 12 14.3C13 14.3 14.6 14.8 15.8 16.2"
        stroke="#ffffff"
        strokeWidth="0.9"
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

        {/* Luminous Electric Sapphire & Royal Violet Titanium Body */}
        <linearGradient id="ccBodyGrad" x1="2" y1="4" x2="22" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="30%" stopColor="#6366f1" />
          <stop offset="65%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>

        {/* Polished Metallic Bevel / Rim Light */}
        <linearGradient id="ccRimGrad" x1="1" y1="4" x2="23" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="30%" stopColor="#f0abfc" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        {/* Diagonal Specular Anisotropic Sheen */}
        <linearGradient id="ccSheenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>

        {/* Gold EMV Microchip Gradients */}
        <linearGradient id="ccChipGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Holographic Prismatic Badge */}
        <linearGradient id="ccHoloGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
          <stop offset="33%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="66%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Realistic Ground Shadow */}
      <ellipse cx="12" cy="20.8" rx="8.5" ry="1.6" fill="url(#ccDropShadow)" />

      {/* Card 3D Thickness Edge (Bottom Bevel) */}
      <rect x="2" y="6.8" width="20" height="12.8" rx="2.2" fill="#3b0764" />

      {/* Card Main Face */}
      <rect
        x="2"
        y="5.2"
        width="20"
        height="13.2"
        rx="2.2"
        fill="url(#ccBodyGrad)"
        stroke="url(#ccRimGrad)"
        strokeWidth="0.8"
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


