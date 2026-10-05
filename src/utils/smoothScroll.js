import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenisInstance = null;
let rafId = null;

/**
 * Initialize Lenis smooth inertia scrolling
 * Delivers effortless, silky-smooth, fluid scrolling across desktop and mobile.
 */
export function initSmoothScroll(options = {}) {
  if (typeof window === 'undefined') return null;

  // Clean up any prior instance
  destroySmoothScroll();

  // Reset any conflicting inline styles
  try {
    document.documentElement.style.scrollBehavior = 'auto';
  } catch (e) {}

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    lerp: prefersReducedMotion ? 1 : 0.09, // Silky smooth exponential damping physics
    wheelMultiplier: 1.0, // Natural 1:1 wheel response
    touchMultiplier: 1.5,
    smoothWheel: !prefersReducedMotion,
    syncTouch: false, // Preserves native 120Hz/60Hz mobile compositor touch gestures
    autoRaf: true, // Native synchronized requestAnimationFrame loop
    anchors: true, // Automatically intercepts in-page #anchor clicks
    infinite: false,
    autoResize: true,
    ...options,
  });

  lenisInstance = lenis;
  window.__lenis = lenis;

  // Fallback RAF loop in case autoRaf isn't supported or active
  if (!lenis.options?.autoRaf) {
    function raf(time) {
      if (lenisInstance) {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }
    rafId = requestAnimationFrame(raf);
  }

  return lenis;
}

/**
 * Smoothly glide to any anchor target, element, or number offset with exact header offset clearance
 */
export function scrollToTarget(target, customOptions = {}) {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const defaultScrollOptions = {
    duration: prefersReducedMotion ? 0 : 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential deceleration curve
    ...customOptions,
  };

  if (target === 0 || target === 'top' || target === '#hero') {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, defaultScrollOptions);
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    return;
  }

  let element = null;
  if (typeof target === 'string') {
    try {
      element = document.querySelector(target);
    } catch (e) {
      return;
    }
  } else if (target instanceof HTMLElement) {
    element = target;
  } else if (typeof target === 'number') {
    if (lenisInstance) {
      lenisInstance.scrollTo(Math.max(0, target), defaultScrollOptions);
    } else {
      window.scrollTo({ top: Math.max(0, target), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    return;
  }

  if (element) {
    if (lenisInstance) {
      lenisInstance.scrollTo(element, defaultScrollOptions);
    } else {
      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
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
    try {
      lenisInstance.destroy();
    } catch (e) {}
    lenisInstance = null;
    window.__lenis = null;
  }
}

export function getLenis() {
  return lenisInstance;
}
