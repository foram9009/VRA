'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !dotRef.current || !outlineRef.current) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    // GSAP quickTo for ultra-smooth 60fps following
    const dotMove = gsap.quickTo(dotRef.current, 'x, y', { duration: 0.1, ease: 'power2.out' });
    const outlineMove = gsap.quickTo(outlineRef.current, 'x, y', { duration: 0.5, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dotMove(mouse.x, mouse.y);
      outlineMove(mouse.x, mouse.y);
    });

    // Hover states for interactive elements
    const addHoverClass = () => outlineRef.current?.classList.add('hovering');
    const removeHoverClass = () => outlineRef.current?.classList.remove('hovering');

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, .cursor-hover');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', addHoverClass);
      el.addEventListener('mouseleave', removeHoverClass);
    });

    return () => {
      window.removeEventListener('mousemove', () => {});
      // Cleanup listeners if needed in production
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor cursor-dot fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference translate-x-[-50%] translate-y-[-50%]" />
      <div ref={outlineRef} className="custom-cursor cursor-outline fixed top-0 left-0 w-8 h-8 border border-primary/40 rounded-full pointer-events-none z-[9999] translate-x-[-50%] translate-y-[-50%] transition-all duration-300 ease-out hover:w-12 hover:h-12 hover:bg-white/5" />
    </>
  );
}
