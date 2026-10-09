import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenisInstance = null;
let rafId = null;
let resizeHandler = null;

/**
 * Determine if the current device is a mobile or touch device.
 * Touch devices natively execute 120Hz/60Hz hardware-accelerated momentum scrolling.
 */
export function isMobileOrTouch() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.innerWidth < 768
  );
}

/**
 * Initialize Lenis smooth inertia scrolling strictly for desktop mouse/trackpad environments.
 * Mobile & touch devices use 100% native hardware-accelerated scrolling to permanently
 * prevent touch locking, stutters, and address-bar resize glitches.
 */
export function initSmoothScroll(options = {}) {
  if (typeof window === 'undefined') return null;

  // Clean up any prior instance
  destroySmoothScroll();

  // If on mobile / touch screen, rely 100% on ultra-fast native device scrolling
  if (isMobileOrTouch()) {
    try {
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    } catch (e) {}
    return null;
  }

  // Reset any conflicting inline styles on desktop
  try {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
  } catch (e) {}

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // High-performance Lenis configuration tailored strictly for desktop displays
  const lenis = new Lenis({
    lerp: prefersReducedMotion ? 1 : 0.088, // Silky smooth exponential damping physics for desktop wheels & touchpads
    wheelMultiplier: 1.0, // Natural 1:1 wheel response
    touchMultiplier: 1.0,
    smoothWheel: !prefersReducedMotion,
    syncTouch: false,
    autoRaf: false,
    anchors: false, // Let custom scrollToTarget handle anchors cleanly
    infinite: false,
    autoResize: true,
    ...options,
  });

  lenisInstance = lenis;
  window.__lenis = lenis;

  // Synchronized RAF loop on desktop
  function raf(time) {
    if (lenisInstance) {
      lenisInstance.raf(time);
    }
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  // Recalculate dimensions on window resize and orientation changes
  resizeHandler = () => {
    if (isMobileOrTouch()) {
      // User resized down to mobile viewport: destroy Lenis to free native touch
      destroySmoothScroll();
    } else if (lenisInstance) {
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
 * Handles both main page elements and scrollable inner containers (e.g. Senior Portal modal),
 * seamlessly supporting both desktop Lenis and 100% native mobile smooth scrolling.
 */
export function scrollToTarget(target, customOptions = {}) {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Compute mobile vs desktop header clearance
  const header = document.querySelector('header');
  const headerOffset = header ? header.offsetHeight + 14 : (window.innerWidth < 768 ? 90 : 80);

  // 1. Target is top or 0
  if (target === 0 || target === 'top' || target === '#hero') {
    if (lenisInstance && !lenisInstance.isStopped) {
      lenisInstance.scrollTo(0, {
        duration: prefersReducedMotion ? 0 : 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...customOptions,
      });
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    return;
  }

  // 2. Target is a numeric offset
  if (typeof target === 'number') {
    const clampedY = Math.max(0, target);
    if (lenisInstance && !lenisInstance.isStopped) {
      lenisInstance.scrollTo(clampedY, {
        duration: prefersReducedMotion ? 0 : 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...customOptions,
      });
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
    const innerHeaderOffset = stickyHeader ? stickyHeader.offsetHeight + 16 : 24;
    const targetOffset = currentScroll + (elemRect.top - containerRect.top) - innerHeaderOffset;

    scrollContainer.scrollTo({
      top: Math.max(0, targetOffset),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    return;
  }

  // Main page scroll:
  if (lenisInstance && !lenisInstance.isStopped) {
    lenisInstance.scrollTo(element, {
      duration: prefersReducedMotion ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      offset: -headerOffset,
      ...customOptions,
    });
  } else {
    // Native mobile/touch smooth scroll with exact header clearance
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: Math.max(0, elementTop - headerOffset),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
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
  try {
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollBehavior = '';
    document.body.style.scrollBehavior = '';
  } catch (e) {}
}

export function getLenis() {
  return lenisInstance;
}
