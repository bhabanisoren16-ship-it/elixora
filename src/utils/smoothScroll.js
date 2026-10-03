/**
 * Ultra-fast, zero-lag, hardware-accelerated native smooth scroll
 * Uses browser GPU compositor for 60-120fps scrolling with zero input lag.
 */

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  try {
    document.documentElement.style.scrollBehavior = 'smooth';
  } catch (e) {}

  return {
    destroy: () => {},
    scrollTo: (target, opts) => scrollToTarget(target, opts),
  };
}

/**
 * Smoothly glide to any anchor target or element with exact header offset clearance
 */
export function scrollToTarget(target, customOptions = {}) {
  if (typeof window === 'undefined') return;

  const isMobile = window.innerWidth < 768;
  const defaultOffset = isMobile ? -95 : -80;
  const offset = customOptions.offset !== undefined ? customOptions.offset : defaultOffset;

  if (target === 0 || target === 'top' || target === '#hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: Math.max(0, target + offset), behavior: 'smooth' });
    return;
  }

  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition + offset);
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

export function pauseSmoothScroll() {}
export function resumeSmoothScroll() {}
export function destroySmoothScroll() {}
export function getLenis() {
  return null;
}
