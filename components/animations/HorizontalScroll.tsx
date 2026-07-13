'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react'; // React hook for GSAP cleanup

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
}

export default function HorizontalScroll({ 
  children, 
  className = '', 
  reverse = false 
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Calculate total scroll width
    // Add some padding to ensure full visibility of last items
    const scrollWidth = contentRef.current.scrollWidth - window.innerWidth;
    
    const direction = reverse ? -1 : 1;

    gsap.to(contentRef.current, {
      x: () => -scrollWidth * direction,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollWidth}`, // Pin duration based on scroll width
        pin: true,
        scrub: 1, // Smooth scrubbing linked to scrollbar
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`overflow-hidden relative w-full ${className}`}
    >
      {/* The moving track */}
      <div 
        ref={contentRef} 
        className="flex flex-nowrap will-change-transform"
      >
        {children}
      </div>
      
      {/* Optional: Progress Indicator */}
      <div className="absolute bottom-4 right-12 w-24 h-1 bg-white/10 rounded-full overflow-hidden z-10">
        <div className="h-full bg-primary origin-left scale-x-0 progress-bar" />
      </div>
    </div>
  );
}
