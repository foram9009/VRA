'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import gsap from 'gsap';
import MagneticButton from '@/components/ui/MagneticButton';

export default function NotFound() {
  useEffect(() => {
    gsap.from('h1', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from('p', { y: 20, opacity: 0, delay: 0.2, duration: 0.6 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background relative overflow-hidden">
      <h1 className="heading-xl mb-6">Page Not Found</h1>
      <p className="text-text-secondary max-w-md mb-8 text-lg">
        We couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <MagneticButton asChild strength={0.2}>
        <Link href="/" className="bg-primary text-background px-8 py-3 rounded-full hover:bg-white transition-colors">
          Return Home
        </Link>
      </MagneticButton>
    </div>
  );
}
