'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * RevealHelper — globally animates any element with className "reveal"
 * using GSAP ScrollTrigger. Re-runs on every client navigation.
 */
export default function RevealHelper() {
  const pathname = usePathname();

  useEffect(() => {
    // Short delay so DOM is painted before we query elements
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>('.reveal');
      if (!elements.length) return;

      elements.forEach((el) => {
        // Avoid double-animating elements already handled
        if (el.dataset.gsapInited) return;
        el.dataset.gsapInited = 'true';

        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(timer);
      // Kill all reveal scroll triggers on navigation to prevent leaks
      ScrollTrigger.getAll()
        .filter(t => {
          const el = t.trigger as HTMLElement | null;
          return el?.classList.contains('reveal');
        })
        .forEach(t => t.kill());

      document.querySelectorAll<HTMLElement>('.reveal[data-gsap-inited]')
        .forEach(el => { delete el.dataset.gsapInited; });
    };
  }, [pathname]);

  return null;
}
