'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  
  if (!animateOnScroll) {
    return (
      <section id={id} className={cn('container-custom py-24 md:py-32', className)}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn('container-custom py-24 md:py-32', className)}
    >
      {children}
    </motion.section>
  );
}
