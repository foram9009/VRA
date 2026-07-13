'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest text-primary hover:opacity-80 transition-opacity cursor-hover">
          LUXE
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm text-text-secondary hover:text-primary transition-colors duration-300 cursor-hover"
            >
              {link.name}
            </Link>
          ))}
          <MagneticButton className="bg-white/10 border border-white/20 text-primary px-5 py-2 rounded-full text-sm hover:bg-primary hover:text-background transition-all duration-300 cursor-hover">
            Get in Touch
          </MagneticButton>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-primary p-2 cursor-hover"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="text-2xl font-light text-text-secondary hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
