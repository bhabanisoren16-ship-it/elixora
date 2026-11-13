/**
 * Seeded random generator (mulberry32), draws deterministic celestial cloud silhouettes
 */
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;
const circle = (cx, cy, r) =>
  `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 1 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 1 ${r1(-2 * r)} 0`;

/**
 * Procedural celestial cumulus bank in a 2000x1125 box.
 */
function cloudBank(seed) {
  const rnd = seeded(seed);
  const p1 = rnd() * 6.3;
  const p2 = rnd() * 6.3;
  const base = (x) => 640 + 75 * Math.sin(x / 290 + p1) + 35 * Math.sin(x / 110 + p2);
  let back = 'M-100 780H2100V1125H-100Z';
  let front = '';

  for (let x = -60; x < 2080; x += 45 + rnd() * 75) {
    const cy = base(x) + rnd() * 40;
    const r = Math.max(55 + rnd() * 105, 800 - cy);
    back += circle(x, cy, r);
    if (rnd() < 0.1) {
      let ty = cy - r * 0.7;
      let tr = r * 0.7;
      for (let k = 0; k < 2 + rnd() * 2; k++) {
        back += circle(x + (rnd() - 0.5) * tr * 0.6, ty, tr);
        ty -= tr * 0.6;
        tr *= 0.72;
      }
    }
  }

  for (let x = -40; x < 2080; x += 140 + rnd() * 180) {
    const r = 120 + rnd() * 110;
    const cy = 1020 + rnd() * 110;
    front += circle(x, cy, r) + circle(x + r * 0.8, cy + 30 + rnd() * 40, r * (0.6 + rnd() * 0.3));
  }

  return { back, front };
}

/**
 * Pure Black Obsidian Curtain Layers (Default monochrome palette)
 */
export const LAYERS = [
  { color: '#000000', ink: '#141414', ...cloudBank(11) }, // Layer 0: Pure Pitch Black
  { color: '#050505', ink: '#181818', ...cloudBank(23) }, // Layer 1: Obsidian Black
  { color: '#090909', ink: '#1e1e1e', ...cloudBank(37) }, // Layer 2: Deep Charcoal Black
  { color: '#0e0e0e', ink: '#242424', ...cloudBank(41) }, // Layer 3: Onyx Black
  { color: '#040404', ink: '#191919', ...cloudBank(59) }, // Layer 4 (Front): Jet Black Nexus
];

/**
 * Vibrant Multiverse Cosmic Curtain Layers (Refresh Page Only)
 * Inverted color sequence:
 * Layer 0: Luminous Midnight Orchid Violet
 * Layer 1: Vivid Astral Sky Blue
 * Layer 2: Cosmic Neon Magenta / Hot Pink
 * Layer 3: Electric Royal Astral Violet
 * Layer 4 (Front): Cyber Celestial Cyan Abyss
 */
export const REFRESH_CURTAIN_LAYERS = [
  {
    // Layer 0: Luminous Midnight Orchid Violet
    color: '#1a0736',
    ink: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.9)',
    bgGradient: 'linear-gradient(180deg, #100324 0%, #3b0764 50%, #1a0736 100%)',
    ...cloudBank(11),
  },
  {
    // Layer 1: Vivid Astral Sky Blue
    color: '#0c2e59',
    ink: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.85)',
    bgGradient: 'linear-gradient(180deg, #071c38 0%, #0369a1 50%, #0c2e59 100%)',
    ...cloudBank(23),
  },
  {
    // Layer 2: Cosmic Neon Magenta / Hot Pink
    color: '#4a0740',
    ink: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.85)',
    bgGradient: 'linear-gradient(180deg, #2b0325 0%, #701a75 50%, #4a0740 100%)',
    ...cloudBank(37),
  },
  {
    // Layer 3: Electric Astral Purple
    color: '#2d0b57',
    ink: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.85)',
    bgGradient: 'linear-gradient(180deg, #1b0636 0%, #4c1d95 50%, #2d0b57 100%)',
    ...cloudBank(41),
  },
  {
    // Layer 4 (Front): Cyber Celestial Cyan
    color: '#072b3b',
    ink: '#00f2fe',
    glow: 'rgba(0, 242, 254, 0.85)',
    bgGradient: 'linear-gradient(180deg, #031b26 0%, #084c66 50%, #072b3b 100%)',
    ...cloudBank(59),
  },
];
