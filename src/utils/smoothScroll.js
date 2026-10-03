import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenisInstance = null;
let rafId = null;

/**
 * Initialize Lenis smooth scroll with optimal settings for performance and aesthetics
 */
export function initSmoothScroll(options = {}) {
  if (typeof window === 'undefined') return null;

  // Destroy any existing instance & animation loop
  destroySmoothScroll();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    duration: prefersReducedMotion ? 0 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential deceleration curve
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: !prefersReducedMotion,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    infinite: false,
    autoRaf: false, // We drive raf via explicit RAF loop for 100% reliability
    ...options,
  });

  lenisInstance = lenis;
  window.__lenis = lenis;

  // Dedicated RAF animation loop for high refresh rate displays (60Hz / 120Hz / 144Hz)
  function raf(time) {
    if (lenisInstance) {
      lenisInstance.raf(time);
    }
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);

  return lenis;
}

/**
 * Smoothly scroll to any target (selector, DOM element, or number offset)
 */
export function scrollToTarget(target, customOptions = {}) {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  const options = {
    offset: isMobile ? -100 : -85,
    duration: prefersReducedMotion ? 0 : 1.2,
    ...customOptions,
  };

  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
    return;
  }

  // Fallback to native smooth scroll
  if (target === 0 || target === 'top') {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset + (options.offset || 0);
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  } else if (target instanceof HTMLElement) {
    const top = target.getBoundingClientRect().top + window.pageYOffset + (options.offset || 0);
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
}

/**
 * Pause scrolling (e.g., when full-screen modals open)
 */
export function pauseSmoothScroll() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

/**
 * Resume scrolling (e.g., when modal closes)
 */
export function resumeSmoothScroll() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

/**
 * Clean up Lenis instance
 */
export function destroySmoothScroll() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
    window.__lenis = null;
  }
}

export function getLenis() {
  return lenisInstance;
}
