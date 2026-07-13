'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animateOnScroll?: boolean;
}

export default function Section({ 
  children, 
  id, 
  className = '', 
  animateOnScroll = true 
}: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animateOnScroll || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll('.reveal');
      elements?.forEach((el, i) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [animateOnScroll]);

  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className={`container-custom py-24 md:py-32 ${className}`}
    >
      {children}
    </section>
  );
}
