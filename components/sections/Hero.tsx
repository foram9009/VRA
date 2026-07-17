'use client';

import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import Link from 'next/link';
import HeroSlider, { type HeroSlide } from './HeroSlider';

// ─── Default slides ───────────────────────────────────────────────────────────
// Replace src values with your own uploaded images / videos.
// Video slides: set type: 'video' and point src to an .mp4 / .webm URL.
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    type: 'image',
    src: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg',
    label: 'Branding & Identity',
  },
  {
    type: 'image',
    src: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg',
    label: 'Luxury E-Commerce',
  },
  {
    type: 'image',
    src: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-5.jpg',
    label: 'Interactive Motion',
  },
  {
    type: 'image',
    src: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg',
    label: 'Editorial Design',
  },
];

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Image / Video Slider Background */}
      <HeroSlider slides={DEFAULT_SLIDES} interval={5500} />

      {/* Dark vignette + gradient overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background pointer-events-none z-10" />

      {/* Subtle grid on top */}
      <div className="absolute inset-0 z-[11] grid-bg pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-6xl mx-auto px-6 w-full">
        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest font-semibold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Award-Winning Digital Studio
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="heading-xl mb-6"
        >
          We Craft Digital
          <br />
          <span className="text-primary italic">Experiences</span> That Last
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-12 font-light tracking-wide"
        >
          Strategy. Design. Technology. We build brands that stand out in the noise and leave a lasting impact on the world.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton asChild strength={0.2}>
            <Link
              href="/portfolio"
              className="bg-primary text-background px-10 py-4 rounded-full font-bold hover:bg-white transition-colors uppercase tracking-widest text-xs cursor-hover"
            >
              View Our Work
            </Link>
          </MagneticButton>
          <MagneticButton asChild strength={0.2}>
            <Link
              href="/contact"
              className="border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 hover:border-white/40 transition-colors uppercase tracking-widest text-xs cursor-hover"
            >
              Start a Project
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-text-secondary text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 10L12 15L17 10" stroke="#D6B16D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
