import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenisInstance = null;
let rafId = null;
let resizeHandler = null;

/**
 * Initialize Lenis smooth inertia scrolling.
 * Delivers effortless, silky-smooth, fluid scrolling across desktop and mobile.
 */
export function initSmoothScroll(options = {}) {
  if (typeof window === 'undefined') return null;

  // Clean up any prior instance
  destroySmoothScroll();

  // Reset any conflicting inline styles
  try {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
  } catch (e) {}

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // High-performance Lenis configuration tailored for desktop & mobile displays (60Hz to 120Hz)
  const lenis = new Lenis({
    lerp: prefersReducedMotion ? 1 : 0.088, // Silky smooth exponential damping physics for desktop wheels & touchpads
    wheelMultiplier: 1.0, // Natural 1:1 wheel response
    touchMultiplier: 1.25, // Natural 1:1 touch response for mobile swipe gestures
    smoothWheel: !prefersReducedMotion,
    syncTouch: !prefersReducedMotion, // Enables smooth touch inertia momentum across mobile devices & tablets!
    syncTouchLerp: 0.075, // Silky touch damping for 60Hz and 120Hz mobile screens
    touchInertiaExponent: 1.65, // Physics momentum curve for swipe releases
    autoRaf: false, // Driven by our high-precision requestAnimationFrame loop
    anchors: true, // Automatically intercepts in-page #anchor clicks
    infinite: false,
    autoResize: true,
    ...options,
  });

  lenisInstance = lenis;
  window.__lenis = lenis;

  // Synchronized RAF loop
  function raf(time) {
    if (lenisInstance) {
      lenisInstance.raf(time);
    }
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  // Recalculate dimensions on window resize and orientation changes
  resizeHandler = () => {
    if (lenisInstance) {
      lenisInstance.resize();
    }
  };
  window.addEventListener('resize', resizeHandler, { passive: true });
  window.addEventListener('orientationchange', resizeHandler, { passive: true });

  if (typeof document !== 'undefined' && document.fonts) {
    document.fonts.ready.then(() => {
      if (lenisInstance) {
        lenisInstance.resize();
      }
    });
  }

  return lenis;
}

/**
 * Smoothly glide to any anchor target, element, or number offset with exact header offset clearance.
 * Handles both main page elements and scrollable inner containers (e.g. Senior Portal modal).
 */
export function scrollToTarget(target, customOptions = {}) {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const defaultScrollOptions = {
    duration: prefersReducedMotion ? 0 : 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential deceleration curve
    ...customOptions,
  };

  // 1. Target is top or 0
  if (target === 0 || target === 'top' || target === '#hero') {
    if (lenisInstance && !lenisInstance.isStopped) {
      lenisInstance.scrollTo(0, defaultScrollOptions);
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    return;
  }

  // 2. Target is a numeric offset
  if (typeof target === 'number') {
    const clampedY = Math.max(0, target);
    if (lenisInstance && !lenisInstance.isStopped) {
      lenisInstance.scrollTo(clampedY, defaultScrollOptions);
    } else {
      window.scrollTo({ top: clampedY, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    return;
  }

  // 3. Target is element or selector string
  let element = null;
  if (typeof target === 'string') {
    try {
      element = document.querySelector(target);
    } catch (e) {
      return;
    }
  } else if (target instanceof HTMLElement) {
    element = target;
  }

  if (!element) return;

  // Check if target is inside an inner scrollable modal container (like the Senior VIP Portal)
  let scrollContainer = window;
  let parent = element.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
      scrollContainer = parent;
      break;
    }
    parent = parent.parentElement;
  }

  if (scrollContainer !== window) {
    // Scroll inside nested scroll container with smooth animation
    const containerRect = scrollContainer.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    const currentScroll = scrollContainer.scrollTop;
    const stickyHeader = scrollContainer.querySelector('header') || scrollContainer.querySelector('nav');
    const headerOffset = stickyHeader ? stickyHeader.offsetHeight + 16 : 24;
    const targetOffset = currentScroll + (elemRect.top - containerRect.top) - headerOffset;

    scrollContainer.scrollTo({
      top: Math.max(0, targetOffset),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    return;
  }

  // Main page scroll: Lenis takes precedence if active, else native smooth scrollIntoView
  if (lenisInstance && !lenisInstance.isStopped) {
    lenisInstance.scrollTo(element, defaultScrollOptions);
  } else {
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
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
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', resizeHandler);
    resizeHandler = null;
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
