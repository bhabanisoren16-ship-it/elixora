import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Register ScrambleTextPlugin with GSAP
try {
  gsap.registerPlugin(ScrambleTextPlugin);
} catch (e) {
  console.warn('ScrambleTextPlugin initialization notice:', e);
}

export const SCRAMBLE_CHARS = 'XYZXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#';

/**
 * Scramble text effect on an element
 * @param {HTMLElement|string} target - DOM element or selector
 * @param {string} text - Final text to reveal
 * @param {object} options - Optional configuration
 */
export function scrambleText(target, text, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  const originalText = text || el.getAttribute('data-text') || el.textContent || '';
  if (!el.getAttribute('data-text')) {
    el.setAttribute('data-text', originalText);
  }

  const duration = options.duration ?? 0.6;
  const chars = options.chars ?? SCRAMBLE_CHARS;
  const speed = options.speed ?? 0.55;

  // Attempt GSAP ScrambleTextPlugin if registered
  if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrambleText) {
    try {
      return gsap.to(el, {
        duration,
        scrambleText: {
          text: originalText,
          chars,
          speed: options.speed ?? 0.55,
        },
        overwrite: true,
        onComplete: options.onComplete,
      });
    } catch (err) {}
  }

  // 60fps Precision RAF Scramble/Decode Engine
  if (el._scrambleRaf) {
    cancelAnimationFrame(el._scrambleRaf);
  }

  const startTime = performance.now();
  const durationMs = duration * 1000;
  const len = originalText.length;
  let lastCharChange = 0;
  let scrambledBuffer = '';

  const animate = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const revealedCount = Math.floor(progress * len);

    // Refresh cyber glitch characters every ~32ms
    if (now - lastCharChange > 32) {
      lastCharChange = now;
      let rand = '';
      for (let i = revealedCount; i < len; i++) {
        if (originalText[i] === ' ') {
          rand += ' ';
        } else {
          rand += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      scrambledBuffer = rand;
    }

    el.textContent = originalText.slice(0, revealedCount) + scrambledBuffer.slice(0, len - revealedCount);

    if (progress < 1) {
      el._scrambleRaf = requestAnimationFrame(animate);
    } else {
      el.textContent = originalText;
      el._scrambleRaf = null;
      if (options.onComplete) options.onComplete();
    }
  };

  el._scrambleRaf = requestAnimationFrame(animate);
  return el;
}

/**
 * Global hover handler restricted exclusively to Navbar navigation items
 */
export function initGlobalScrambleListener() {
  if (typeof window === 'undefined') return () => {};

  const handlePointerEnter = (e) => {
    // Only scramble text elements within the navigation bar
    const target = e.target.closest('header [data-scr], nav [data-scr]');
    if (!target) return;

    const text = target.getAttribute('data-text') || target.textContent;
    target.setAttribute('data-text', text);
    scrambleText(target, text, { duration: 0.42 });
  };

  document.addEventListener('pointerenter', handlePointerEnter, true);
  return () => {
    document.removeEventListener('pointerenter', handlePointerEnter, true);
  };
}
