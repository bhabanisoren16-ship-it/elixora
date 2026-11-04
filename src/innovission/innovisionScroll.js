/**
 * Modern High-Performance Smooth Inertial Scroll System - ELIXORA 2.0
 * 
 * Features:
 * 1. Hardware-accelerated inertial momentum scrolling on mouse wheel for all desktop & laptop devices.
 * 2. Butter-smooth 60/120/144/240Hz RAF interpolation normalized across display refresh rates via GSAP ticker.
 * 3. 100% native touch handling on mobile/tablets with zero input latency.
 * 4. Keyboard navigation support (ArrowDown, ArrowUp, PageDown, PageUp, Space, Home, End).
 * 5. Full immunity for inner scrollable containers, modals, dropdowns, and dialogs.
 * 6. Global programmatic smooth navigation hook for navbar links and anchors.
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

  currentY = window.pageYOffset || window.scrollY || 0;
  targetY = currentY;
  isWheeling = false;

  // Global cancel hook for external callers (e.g. modals)
  window.__cancelInertiaWheel = () => {
    isWheeling = false;
    currentY = targetY = window.pageYOffset || window.scrollY || 0;
  };

  // Global programmatic smooth scroll hook (used by scrollToTarget)
  window.__smoothScrollTo = (destY) => {
    if (typeof window === 'undefined') return;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    targetY = Math.max(0, Math.min(maxScroll, destY));
    currentY = window.pageYOffset || window.scrollY || 0;
    isWheeling = true;
  };

  // Sync with native external scrolling (e.g. dragging scrollbar, mobile touch swipe)
  const onExternalScroll = () => {
    if (!isWheeling) {
      currentY = targetY = window.pageYOffset || window.scrollY || 0;
    }
  };
  window.addEventListener('scroll', onExternalScroll, { passive: true });
  scrollCleanups.push(() => window.removeEventListener('scroll', onExternalScroll));

  // 1. HARDWARE-ACCELERATED INERTIAL SMOOTH WHEEL (Desktop mouse / trackpad)
  if (!prefersReducedMotion) {
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
          '[data-lenis-prevent], [data-no-smooth], [role="dialog"], .scrollable-container, .overflow-y-auto, .overflow-y-scroll, select, textarea, input'
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

      // Normalize wheel delta across browsers (Firefox lines, Chrome pixels, trackpad)
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) {
        deltaY *= 36;
      } else if (e.deltaMode === 2) {
        deltaY *= window.innerHeight;
      }

      // Mouse wheel discrete ticks give a satisfying, luxurious glide
      if (Math.abs(deltaY) >= 80) {
        deltaY = Math.sign(deltaY) * Math.min(Math.abs(deltaY) * 1.2, 260);
      }

      targetY = Math.max(0, Math.min(maxScroll, targetY + deltaY));
    };

    const tickerUpdate = () => {
      if (isWheeling) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        targetY = Math.max(0, Math.min(maxScroll, targetY));

        // Butter-smooth 60/120/144Hz normalized exponential damping
        const factor = 1 - Math.pow(1 - 0.088, gsap.ticker.deltaRatio());
        currentY += (targetY - currentY) * factor;

        if (Math.abs(targetY - currentY) < 0.4) {
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

    // 2. KEYBOARD SMOOTH GLIDE (ArrowDown, ArrowUp, PageDown, PageUp, Space, Home, End)
    const onKeyDown = (e) => {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          active.tagName === 'SELECT' ||
          active.isContentEditable)
      ) {
        return;
      }

      if (
        document.body.style.overflow === 'hidden' ||
        document.documentElement.style.overflow === 'hidden'
      ) {
        return;
      }

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      let handled = false;

      switch (e.key) {
        case 'ArrowDown':
          targetY = Math.min(maxScroll, targetY + 120);
          handled = true;
          break;
        case 'ArrowUp':
          targetY = Math.max(0, targetY - 120);
          handled = true;
          break;
        case 'PageDown':
        case ' ':
          if (!e.shiftKey) {
            targetY = Math.min(maxScroll, targetY + window.innerHeight * 0.82);
            handled = true;
          }
          break;
        case 'PageUp':
          targetY = Math.max(0, targetY - window.innerHeight * 0.82);
          handled = true;
          break;
        case 'Home':
          targetY = 0;
          handled = true;
          break;
        case 'End':
          targetY = maxScroll;
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        e.preventDefault();
        if (!isWheeling) {
          currentY = window.pageYOffset || window.scrollY || 0;
          isWheeling = true;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    scrollCleanups.push(() => window.removeEventListener('keydown', onKeyDown));
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
  if (typeof window !== 'undefined') {
    delete window.__smoothScrollTo;
  }
}

export function refreshInnovisionScroll() {
  if (typeof window !== 'undefined') {
    currentY = targetY = window.pageYOffset || window.scrollY || 0;
  }
}
