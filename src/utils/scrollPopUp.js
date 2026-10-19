/**
 * Universal Scroll Pop-up Transition System
 * 
 * Smoothly pops up cards and sections into view as the user scrolls down the page.
 * Strictly uses GPU-composited transform and opacity to guarantee 0% layout reflow,
 * ensuring the fixed atmospheric concert background image remains completely undisturbed!
 */
export function initScrollPopUp() {
  if (typeof window === 'undefined') return () => {};

  let observer = null;

  const observeElements = () => {
    const elements = document.querySelectorAll('.scroll-pop-target');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('scroll-pop-visible'));
      return;
    }

    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-pop-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const viewportHeight = window.innerHeight;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If already visible in the initial viewport, reveal immediately without pop
      if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
        el.classList.add('scroll-pop-visible');
      } else {
        observer.observe(el);
      }
    });
  };

  const timer = setTimeout(observeElements, 60);

  return () => {
    clearTimeout(timer);
    if (observer) observer.disconnect();
  };
}
