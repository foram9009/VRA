'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen() {
  const [isLoaded, setIsLoaded] = useState(false);
  const logoRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded) return;

    const tl = gsap.timeline({
      onComplete: () => setIsLoaded(true),
    });

    // Initial state
    gsap.set(logoRef.current, { opacity: 0, y: 20 });
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });

    tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.inOut' },
        '-=0.4'
      )
      .to('.loading-overlay', { opacity: 0, duration: 0.6, ease: 'power2.inOut' });
  }, [isLoaded]);

  if (isLoaded) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background loading-overlay">
      <span ref={logoRef} className="heading-xl font-light tracking-widest text-primary">
        <b>VRA</b>
      </span>
      <div ref={lineRef} className="h-[1px] w-24 mt-6 bg-accent" />
    </div>
  );
}
