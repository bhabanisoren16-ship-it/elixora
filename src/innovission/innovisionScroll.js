/**
 * Exact INNOVISION 2026 Scroll Engine
 * Extracted and ported directly from https://www.innonitrkl.com
 * 
 * Features:
 * 1. smoothWheel: Physics inertial momentum wheel scrolling driven by GSAP ticker deltaRatio.
 * 2. homeScroll: Hero scrub parallax & ambient dimming (scale: 1 -> 0.88, y: 65, opacity: 1 -> 0.15).
 * 3. data-fill: Kinetic typography word-by-word scrub lighting up on scroll.
 * 4. data-reveal: Section and card entrance reveal on scroll (autoAlpha: 0, y: 55 -> autoAlpha: 1, y: 0, ease: 'expo.out').
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let scrollCleanups = [];

export function initInnovisionScroll() {
  if (typeof window === 'undefined') return () => {};

  // Clean up any existing listeners/triggers
  destroyInnovisionScroll();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  // 1. INNOVISION SMOOTH WHEEL (Desktop mouse / trackpad inertia momentum)
  if (!prefersReducedMotion && !isTouchDevice) {
    let currentY = window.pageYOffset || window.scrollY || 0;
    let targetY = currentY;
    let isWheeling = false;

    const onWheel = (e) => {
      // Don't hijack pinch-zoom or horizontal scroll
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Don't hijack if user is scrolling inside a modal, dropdown, or designated scroll container
      if (e.target?.closest?.('[data-lenis-prevent], [data-no-smooth], [role="dialog"], .scrollable-container')) {
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
        // If user jumped scroll (e.g. clicked an anchor or dragged scrollbar)
        if (Math.abs(actualScroll - currentY) > 12) {
          isWheeling = false;
          currentY = targetY = actualScroll;
          return;
        }

        // Exact Innovision inertia damping formula: (1 - Math.pow(0.88, gsap.ticker.deltaRatio()))
        currentY += (targetY - currentY) * (1 - Math.pow(0.88, gsap.ticker.deltaRatio()));

        if (Math.abs(targetY - currentY) < 0.5) {
          currentY = targetY;
          isWheeling = false;
        }

        window.scrollTo(0, Math.round(currentY));
        ScrollTrigger.update();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    gsap.ticker.add(tickerUpdate);

    scrollCleanups.push(() => {
      window.removeEventListener('wheel', onWheel);
      gsap.ticker.remove(tickerUpdate);
    });
  }

  // 2. INNOVISION HERO STICKY PARALLAX & SCRUB DIMMING
  const heroWrap = document.querySelector('#hero-wrap') || document.querySelector('#hero');
  const heroContent = document.querySelector('[data-h-content]');
  const heroDim = document.querySelector('[data-h-dim]');

  if (heroWrap && heroContent) {
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroWrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    heroTimeline.fromTo(
      heroContent,
      { scale: 1, y: 0, opacity: 1 },
      { scale: 0.88, y: 65, opacity: 0.15, ease: 'none' },
      0
    );

    if (heroDim) {
      heroTimeline.fromTo(
        heroDim,
        { opacity: 0 },
        { opacity: 0.70, ease: 'none' },
        0
      );
    }

    scrollCleanups.push(() => {
      heroTimeline.kill();
    });
  }

  // 3. INNOVISION KINETIC TYPOGRAPHY WORD FILL ON SCROLL ([data-fill])
  const fillWrappers = gsap.utils.toArray('[data-fill-wrap]');
  fillWrappers.forEach((wrap) => {
    const words = wrap.querySelectorAll('[data-fill]');
    if (words.length) {
      const fillTimeline = gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        }
      );

      scrollCleanups.push(() => {
        fillTimeline.kill();
      });
    }
  });

  // 4. INNOVISION SECTION & CARD ENTRANCE REVEALS ([data-reveal])
  const revealElements = gsap.utils.toArray('[data-reveal], .scroll-pop-target');
  const viewportHeight = window.innerHeight;

  revealElements.forEach((el) => {
    // If element is already in the viewport on initial load, show immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
      gsap.set(el, { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 50, scale: 0.97 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1.15,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      }
    );

    scrollCleanups.push(() => {
      tween.kill();
    });
  });

  // Refresh ScrollTrigger after a tick so all image sizes & fonts are settled
  const timer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 150);

  scrollCleanups.push(() => clearTimeout(timer));

  return destroyInnovisionScroll;
}

export function destroyInnovisionScroll() {
  scrollCleanups.forEach((cleanup) => {
    try {
      cleanup();
    } catch (e) {}
  });
  scrollCleanups = [];
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  } catch (e) {}
}

export function refreshInnovisionScroll() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
}
