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
    duration: prefersReducedMotion ? 0 : 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential deceleration curve
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: !prefersReducedMotion,
    wheelMultiplier: 1.15, // Effortless and responsive: light flick moves easily without sluggish fatigue
    touchMultiplier: 1.5,
    syncTouch: false, // Preserves 120Hz/60Hz native mobile compositor touch gestures
    infinite: false,
    autoResize: true,
    ...options,
  });

  lenisInstance = lenis;
  window.__lenis = lenis;

  // Ultra-smooth RAF animation loop for high refresh displays (60Hz / 120Hz / 144Hz / 240Hz)
  function raf(time) {
    if (lenisInstance) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
  }

  rafId = requestAnimationFrame(raf);

  return lenis;
}

/**
 * Smoothly glide to any anchor target, element, or number offset with exact header offset clearance
 */
export function scrollToTarget(target, customOptions = {}) {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const defaultOffset = isMobile ? -95 : -80;
  const offset = customOptions.offset !== undefined ? customOptions.offset : defaultOffset;

  if (target === 0 || target === 'top' || target === '#hero') {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, {
        duration: prefersReducedMotion ? 0 : 1.15,
        offset: 0,
        ...customOptions,
      });
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
      lenisInstance.scrollTo(Math.max(0, target + offset), {
        duration: prefersReducedMotion ? 0 : 1.15,
        ...customOptions,
      });
    } else {
      window.scrollTo({ top: Math.max(0, target + offset), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    return;
  }

  if (element) {
    if (lenisInstance) {
      // Lenis automatically factors in scroll-padding-top on html, but if customOptions has explicit offset, pass it
      lenisInstance.scrollTo(element, {
        duration: prefersReducedMotion ? 0 : 1.15,
        ...customOptions,
      });
    } else {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition + offset);
      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
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
