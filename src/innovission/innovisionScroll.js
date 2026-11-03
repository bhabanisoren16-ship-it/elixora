/**
 * Modern High-Performance Smooth Inertial Scroll System
 * 
 * Features:
 * 1. Hardware-accelerated inertial momentum scrolling on mouse wheel for desktop/laptop.
 * 2. Butter-smooth 60/120/144Hz RAF interpolation normalized across display refresh rates.
 * 3. 100% native touch handling on mobile/tablets with zero input latency.
 * 4. Zero sticky hero or scrub dimming (preserves natural clean page layout).
 * 5. Full immunity for modals, dropdowns, senior portal, and inner scroll containers.
 */
import gsap from 'gsap';

let scrollCleanups = [];
let isWheeling = false;
let currentY = 0;
let targetY = 0;

export function initInnovisionScroll() {
  if (typeof window === 'undefined') return () => {};

  destroyInnovisionScroll();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  // Global cancel hook for external callers (e.g. modals, anchor glides)
  window.__cancelInertiaWheel = () => {
    isWheeling = false;
  };

  // 1. HARDWARE-ACCELERATED INERTIAL SMOOTH WHEEL (Desktop mouse / trackpad)
  if (!prefersReducedMotion && !isTouchDevice) {
    currentY = window.pageYOffset || window.scrollY || 0;
    targetY = currentY;
    isWheeling = false;

    const onWheel = (e) => {
      // Don't hijack pinch-zoom or horizontal-dominant scroll
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Don't hijack if page is locked or modals are active
      if (
        document.body.style.overflow === 'hidden' ||
        document.documentElement.style.overflow === 'hidden'
      ) {
        isWheeling = false;
        return;
      }

      // Don't hijack if scrolling inside an inner scrollable modal, dialog, or dropdown
      if (
        e.target?.closest?.(
          '[data-lenis-prevent], [data-no-smooth], [role="dialog"], .scrollable-container, .overflow-y-auto, .overflow-y-scroll, select'
        )
      ) {
        isWheeling = false;
        return;
      }

      e.preventDefault();

      if (!isWheeling) {
        currentY = targetY = window.pageYOffset || window.scrollY || 0;
        isWheeling = true;
      }

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      targetY = Math.max(0, Math.min(maxScroll, targetY + delta * 0.95));
    };

    const tickerUpdate = () => {
      if (isWheeling) {
        const actualScroll = window.pageYOffset || window.scrollY || 0;

        // If user jumped scroll (e.g. dragged scrollbar or clicked an anchor)
        if (Math.abs(actualScroll - currentY) > 16) {
          isWheeling = false;
          currentY = targetY = actualScroll;
          return;
        }

        // Luxurious inertia momentum formula: deltaRatio normalizes across 60Hz, 120Hz, and 144Hz displays
        const factor = 1 - Math.pow(0.86, gsap.ticker.deltaRatio());
        currentY += (targetY - currentY) * factor;

        if (Math.abs(targetY - currentY) < 0.5) {
          currentY = targetY;
          isWheeling = false;
        }

        window.scrollTo(0, Math.round(currentY));
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    gsap.ticker.add(tickerUpdate);

    scrollCleanups.push(() => {
      window.removeEventListener('wheel', onWheel);
      gsap.ticker.remove(tickerUpdate);
      isWheeling = false;
    });
  }

  // Ensure all section & card elements remain immediately visible and interactive
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
  scrollCleanups.forEach((cleanup) => {
    try {
      cleanup();
    } catch (e) {}
  });
  scrollCleanups = [];
  isWheeling = false;
}

export function refreshInnovisionScroll() {
  if (typeof window !== 'undefined') {
    currentY = targetY = window.pageYOffset || window.scrollY || 0;
  }
}
