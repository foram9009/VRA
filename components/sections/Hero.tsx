'use client';

import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import Link from 'next/link';
import HeroScene from './HeroScene';

const textReveal = {
  hidden: { y: "120%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
      <HeroScene />
      
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-10" />
      
      <div className="relative z-20 text-center max-w-5xl mx-auto mt-20">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <div className="overflow-hidden pb-4">
            <motion.h1 variants={textReveal} className="heading-xl">
              We Craft Digital
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-6">
            <motion.h1 variants={textReveal} className="heading-xl">
              <span className="text-primary italic">Experiences</span> That Last
            </motion.h1>
          </div>
          
          <motion.p 
            variants={textReveal} 
            className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed mb-10 mt-4 font-light tracking-wide"
          >
            Strategy. Design. Technology. We build brands that stand out in the noise and leave a lasting impact.
          </motion.p>
          
          <motion.div 
            variants={textReveal} 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <MagneticButton asChild strength={0.2}>
              <Link href="/portfolio" className="bg-primary text-background px-8 py-4 rounded-full font-bold hover:bg-white transition-colors uppercase tracking-widest text-xs">
                View Our Work
              </Link>
            </MagneticButton>
            <MagneticButton asChild strength={0.2}>
              <Link href="/contact" className="border border-white/20 text-primary px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">
                Start a Project
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 15L17 10" stroke="#D6B16D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
}
