'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from '@/components/ui/MagneticButton';
import Link from 'next/link';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(headlineRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
      })
      .from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
      .from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4');

      // Mouse parallax hint
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(headlineRef.current, { x: x * 0.5, y: y * 0.5, duration: 1 });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-10" />
      
      <div className="relative z-20 text-center max-w-4xl mx-auto">
        <h1 ref={headlineRef} className="heading-xl mb-6">
          We Craft Digital<br />
          <span className="text-primary">Experiences</span> That Last
        </h1>
        <p ref={subtitleRef} className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8">
          Strategy. Design. Technology. We build brands that stand out in the noise.
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <MagneticButton asChild strength={0.2}>
            <Link href="/portfolio" className="bg-primary text-background px-8 py-3 rounded-full font-medium hover:bg-white transition-colors">
              View Our Work
            </Link>
          </MagneticButton>
          <MagneticButton asChild strength={0.2}>
            <Link href="/contact" className="border border-white/20 text-primary px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
              Start a Project
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 15L17 10" stroke="#D6B16D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
