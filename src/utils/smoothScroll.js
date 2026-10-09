/**
 * Universal Hardware-Accelerated Smooth Scroll System
 * 
 * Provides 100% native GPU compositor scrolling for user mouse, trackpad, and touch inputs,
 * completely eliminating wheel-hijacking, lag, stutters, middle-click breakage, and frozen scroll locks.
 * Programmatic anchor clicks (e.g. #register, #details, #seniors) glide seamlessly via high-precision RAF easing.
 */

let activeScrollAnimationId = null;

/**
 * High-precision easeInOutCubic deceleration curve for luxurious programmatic glides
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smoothly animate window scroll position to targetY without hijacking user wheel events
 */
function animateWindowScroll(targetY, duration = 850) {
  if (typeof window === 'undefined') return;

  if (activeScrollAnimationId) {
    cancelAnimationFrame(activeScrollAnimationId);
    activeScrollAnimationId = null;
  }

  const startY = window.pageYOffset || window.scrollY || 0;
  const distance = targetY - startY;

  if (Math.abs(distance) < 3 || duration <= 0) {
    window.scrollTo(0, targetY);
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  const startTime = performance.now();

  // Cancel animation if user manually scrolls or touches
  const cancelOnUserInteraction = () => {
    if (activeScrollAnimationId) {
      cancelAnimationFrame(activeScrollAnimationId);
      activeScrollAnimationId = null;
    }
    window.removeEventListener('wheel', cancelOnUserInteraction);
    window.removeEventListener('touchstart', cancelOnUserInteraction);
  };

  window.addEventListener('wheel', cancelOnUserInteraction, { passive: true, once: true });
  window.addEventListener('touchstart', cancelOnUserInteraction, { passive: true, once: true });

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, Math.round(startY + distance * ease));

    if (progress < 1) {
      activeScrollAnimationId = requestAnimationFrame(step);
    } else {
      activeScrollAnimationId = null;
      window.removeEventListener('wheel', cancelOnUserInteraction);
      window.removeEventListener('touchstart', cancelOnUserInteraction);
    }
  }

  activeScrollAnimationId = requestAnimationFrame(step);
}

/**
 * Initialize scroll system (cleans up any conflicting lock classes and ensures native fluidity)
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  try {
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
  } catch (e) {}

  return {
    destroy: destroySmoothScroll,
    scrollTo: (target, opts) => scrollToTarget(target, opts),
    stop: pauseSmoothScroll,
    start: resumeSmoothScroll,
  };
}

/**
 * Smoothly glide to any anchor target, element, or number offset with exact header clearance.
 * Works seamlessly across desktop, laptop, and mobile.
 */
export function scrollToTarget(target, customOptions = {}) {
  if (typeof window === 'undefined') return;

  const header = document.querySelector('header');
  const headerOffset = header ? header.offsetHeight + 14 : (window.innerWidth < 768 ? 90 : 80);
  const duration = customOptions.duration ? customOptions.duration * 1000 : 750;

  // 1. Target is top, 0, or #hero
  if (target === 0 || target === 'top' || target === '#hero') {
    animateWindowScroll(0, duration);
    return;
  }

  // 2. Target is a numeric offset
  if (typeof target === 'number') {
    animateWindowScroll(Math.max(0, target), duration);
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
    const containerRect = scrollContainer.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    const currentScroll = scrollContainer.scrollTop;
    const stickyHeader = scrollContainer.querySelector('header') || scrollContainer.querySelector('nav');
    const innerHeaderOffset = stickyHeader ? stickyHeader.offsetHeight + 16 : 24;
    const targetOffset = currentScroll + (elemRect.top - containerRect.top) - innerHeaderOffset;

    scrollContainer.scrollTo({
      top: Math.max(0, targetOffset),
      behavior: 'smooth',
    });
    return;
  }

  // Main page scroll with exact header offset clearance
  const elementTop = element.getBoundingClientRect().top + (window.pageYOffset || window.scrollY || 0);
  const finalTargetY = Math.max(0, elementTop - headerOffset);

  animateWindowScroll(finalTargetY, duration);
}

/**
 * Pause scrolling when full-screen modals open
 */
export function pauseSmoothScroll() {
  if (typeof document === 'undefined') return;
  try {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  } catch (e) {}
}

/**
 * Resume scrolling when modals close
 */
export function resumeSmoothScroll() {
  if (typeof document === 'undefined') return;
  try {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('lenis-stopped');
    document.body.classList.remove('lenis-stopped');
  } catch (e) {}
}

/**
 * Clean up scroll locks
 */
export function destroySmoothScroll() {
  resumeSmoothScroll();
  if (activeScrollAnimationId) {
    cancelAnimationFrame(activeScrollAnimationId);
    activeScrollAnimationId = null;
  }
}

export function isMobileOrTouch() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function getLenis() {
  return null;
}
