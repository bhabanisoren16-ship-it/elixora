import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger Plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Choreographs cinematic scroll-based storytelling across sections without 
 * hijacking normal scrolling or degrading mobile performance.
 */
export function initScrollStory() {
  if (typeof window === 'undefined') return () => {};

  // Respect user's reduced-motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return () => {};

  const ctx = gsap.context(() => {
    // 1. Staggered reveal for section headings
    const sectionHeadings = document.querySelectorAll('section h2');
    sectionHeadings.forEach((heading) => {
      gsap.fromTo(
        heading,
        { opacity: 0.15, y: 35, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // 2. Parallax depth on hero title container
    const heroContent = document.querySelector('#hero');
    if (heroContent) {
      gsap.to(heroContent, {
        y: 60,
        opacity: 0.75,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }

    // 3. Card Stagger reveals for Party Experiences and Gallery
    const cardGrids = document.querySelectorAll('#experiences .grid, #gallery .grid');
    cardGrids.forEach((grid) => {
      const cards = grid.children;
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0.2, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    // 4. Subtle scale reveal on the climax section
    const climaxSection = document.querySelector('section:has(h2:contains("YOUR NIGHT"))');
    if (climaxSection) {
      gsap.fromTo(
        climaxSection,
        { scale: 0.94, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: climaxSection,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  });

  return () => {
    ctx.revert();
  };
}
