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

  // Attempt GSAP ScrambleTextPlugin first
  try {
    return gsap.to(el, {
      duration,
      scrambleText: {
        text: originalText,
        chars,
        speed,
      },
      overwrite: true,
      onComplete: options.onComplete,
    });
  } catch (err) {
    // Robust fallback if plugin is unavailable
    let frame = 0;
    const totalFrames = Math.round(duration * 60);
    const len = originalText.length;

    clearInterval(el._scrambleTimer);
    el._scrambleTimer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealedCount = Math.floor(progress * len);

      let output = originalText.slice(0, revealedCount);
      for (let i = revealedCount; i < len; i++) {
        if (originalText[i] === ' ') {
          output += ' ';
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      el.textContent = output;

      if (frame >= totalFrames) {
        clearInterval(el._scrambleTimer);
        el.textContent = originalText;
        if (options.onComplete) options.onComplete();
      }
    }, 1000 / 60);

    return null;
  }
}

/**
 * Global hover handler for all elements with data-scr attribute
 */
export function initGlobalScrambleListener() {
  if (typeof window === 'undefined') return () => {};

  const handlePointerEnter = (e) => {
    const target = e.target.closest('[data-scr]');
    if (!target) return;

    const text = target.getAttribute('data-text') || target.textContent;
    target.setAttribute('data-text', text);
    scrambleText(target, text, { duration: 0.5 });
  };

  document.addEventListener('pointerenter', handlePointerEnter, true);
  return () => {
    document.removeEventListener('pointerenter', handlePointerEnter, true);
  };
}
