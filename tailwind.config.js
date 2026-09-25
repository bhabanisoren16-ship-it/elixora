/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#040508',
          900: '#06070f',
          800: '#0c0e1b',
          700: '#13162b',
          600: '#1b1f3c',
        },
        cyber: {
          cyan: '#00f2fe',
          cyanGlow: '#4facfe',
          violet: '#8b5cf6',
          purple: '#a855f7',
          pink: '#ec4899',
          gold: '#fbbf24',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        satisfy: ['Satisfy', 'cursive'],
        oxanium: ['Oxanium', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        lazydog: ['"Lazy Dog"', 'LazyDog', 'cursive', 'sans-serif'],
        righteous: ['Righteous', 'sans-serif'],
        bungee: ['Bungee', 'sans-serif'],
        titan: ['"Titan One"', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        audiowide: ['Audiowide', 'sans-serif'],
        shrikhand: ['Shrikhand', 'cursive'],
        chakra: ['"Chakra Petch"', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        syncopate: ['Syncopate', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 50px rgba(34, 211, 238, 0.7))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5), 0 0 10px -5px rgba(6, 182, 212, 0.3)',
        'neon-violet': '0 0 25px -5px rgba(139, 92, 246, 0.5), 0 0 10px -5px rgba(139, 92, 246, 0.3)',
        'neon-gold': '0 0 25px -5px rgba(251, 191, 36, 0.5), 0 0 10px -5px rgba(251, 191, 36, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
};
