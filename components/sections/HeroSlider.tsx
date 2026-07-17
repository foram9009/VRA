'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type HeroSlide = {
  type: 'image' | 'video';
  src: string;
  /** Optional poster for video slides */
  poster?: string;
  /** Decorative label shown bottom-left */
  label?: string;
};

interface HeroSliderProps {
  slides: HeroSlide[];
  /** Auto-advance interval in ms (default 5500) */
  interval?: number;
}

// Fade + subtle zoom variants
const variants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

export default function HeroSlider({ slides, interval = 5500 }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = slides.length;

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setCurrent(((next % total) + total) % total);
      setProgress(0);
    },
    [total],
  );

  const prev = () => go(current - 1, -1);
  const next = useCallback(() => go(current + 1, 1), [current, go]);

  // Progress bar tick
  useEffect(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const step = 100 / (interval / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, 50);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [current, interval]);

  // Auto-advance
  useEffect(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, interval);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next, interval]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {slide.type === 'video' ? (
            <video
              src={slide.src}
              poster={slide.poster}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={slide.src}
              alt={slide.label ?? 'Hero slide'}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide label — bottom left */}
      <AnimatePresence mode="wait">
        {slide.label && (
          <motion.div
            key={`label-${current}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bottom-20 left-8 md:left-16 z-30"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-medium">
              {slide.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar — top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-30 bg-white/10">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      {/* Slide counter + dots — bottom right */}
      <div className="absolute bottom-8 right-8 md:right-16 z-30 flex flex-col items-end gap-3">
        {/* Counter */}
        <span className="text-[10px] tracking-widest text-white/40 tabular-nums font-medium">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative group"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === current
                    ? 'w-6 h-1.5 bg-primary'
                    : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Prev / Next arrow buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/15 bg-black/30 backdrop-blur-md hover:bg-black/50 hover:border-primary/50 transition-all duration-300 group"
      >
        <ChevronLeft size={20} className="text-white/60 group-hover:text-primary transition-colors" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/15 bg-black/30 backdrop-blur-md hover:bg-black/50 hover:border-primary/50 transition-all duration-300 group"
      >
        <ChevronRight size={20} className="text-white/60 group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
}
