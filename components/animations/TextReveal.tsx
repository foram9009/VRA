'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';

interface TextRevealProps {
  text: string;
  className?: string;
  splitBy?: 'words' | 'chars';
  delay?: number;
  stagger?: number;
}

export default function TextReveal({ 
  text, 
  className = '', 
  splitBy = 'words', 
  delay = 0,
  stagger = 0.05
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    // Simple splitting logic (production app would use SplitType library for complex unicode handling)
    const segments = splitBy === 'words' ? text.split(' ') : text.split('');
    
    // Create spans dynamically
    el.innerHTML = '';
    segments.forEach((segment, i) => {
      const span = document.createElement('span');
      span.textContent = segment;
      span.className = 'inline-block opacity-0 translate-y-full';
      if (splitBy === 'words' && segment !== ' ') span.classList.add('mr-[0.25em]'); // word spacing
      el.appendChild(span);
    });

    const spans = el.querySelectorAll('span');

    gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: stagger,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }, [text, splitBy, delay, stagger]);

  return (
    <h2 
      ref={containerRef}
      className={clsx('leading-tight tracking-tight text-4xl md:text-5xl lg:text-6xl font-medium', className)}
    />
  );
}
