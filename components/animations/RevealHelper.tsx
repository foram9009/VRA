'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * RevealHelper — animates elements with class "reveal" using GSAP ScrollTrigger.
 * Initial hidden state is set via gsap.set() (NOT CSS) so content is always
 * visible as a fallback if GSAP fails or hasn't run yet.
 */
export default function RevealHelper() {
  const pathname = usePathname();

  useEffect(() => {
    // Give React time to fully paint the DOM
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>('.reveal');
      if (!elements.length) return;

      elements.forEach((el) => {
        // Skip elements already set up
        if (el.dataset.gsapInited) return;
        el.dataset.gsapInited = 'true';

        // Set initial hidden state via JS — NOT CSS
        // This way if GSAP doesn't run, the element is still visible
        gsap.set(el, { opacity: 0, y: 32 });

        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      // Kill reveal-related scroll triggers on route change
      ScrollTrigger.getAll()
        .filter(t => {
          const el = t.trigger as HTMLElement | null;
          return el?.classList.contains('reveal');
        })
        .forEach(t => t.kill());

      // Reset data attribute so elements animate again on next visit
      document.querySelectorAll<HTMLElement>('.reveal[data-gsap-inited]')
        .forEach(el => {
          delete el.dataset.gsapInited;
          gsap.set(el, { clearProps: 'all' });
        });
    };
  }, [pathname]);

  return null;
}
