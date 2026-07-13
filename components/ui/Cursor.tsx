'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    // GSAP quickTo for ultra-smooth 60fps following
    const dotMoveX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    const dotMoveY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
    const outlineMoveX = gsap.quickTo(outline, 'x', { duration: 0.5, ease: 'power2.out' });
    const outlineMoveY = gsap.quickTo(outline, 'y', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      dotMoveX(e.clientX);
      dotMoveY(e.clientY);
      outlineMoveX(e.clientX);
      outlineMoveY(e.clientY);
    };

    // Use event delegation on window so dynamically rendered elements are covered
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, .cursor-hover';

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        outline.classList.add('hovering');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        outline.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor cursor-dot fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        ref={outlineRef}
        className="custom-cursor cursor-outline fixed top-0 left-0 w-8 h-8 border border-primary/40 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color,box-shadow] duration-300 ease-out"
        aria-hidden="true"
      />
    </>
  );
}
