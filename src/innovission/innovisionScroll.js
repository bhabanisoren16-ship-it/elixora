/**
 * Clean Native Scroll System
 * 
 * Provides 100% native browser scrolling without wheel-hijacking,
 * parallax scrubs, or scroll-blocking triggers.
 */
import gsap from 'gsap';

export function initInnovisionScroll() {
  if (typeof window === 'undefined') return () => {};

  destroyInnovisionScroll();

  // Ensure all section & card elements are immediately visible without scroll-delay effects
  try {
    gsap.set('[data-reveal], .scroll-pop-target, [data-fill]', {
      autoAlpha: 1,
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'transform,opacity,visibility',
    });
  } catch (e) {}

  return destroyInnovisionScroll;
}

export function destroyInnovisionScroll() {
  // Safe cleanup
}

export function refreshInnovisionScroll() {
  // Safe no-op
}
