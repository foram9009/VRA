'use client';

import Link from 'next/link';
import { ArrowRight, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 pt-20 pb-10">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <Link href="/" className="text-3xl font-light tracking-widest text-primary block mb-4">LUXE</Link>
          <p className="text-text-secondary leading-relaxed max-w-xs">
            Crafting immersive digital experiences through strategic design, cutting-edge technology, and creative storytelling.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-6">Explore</h4>
          <ul className="space-y-3 text-text-secondary">
            {['About', 'Services', 'Portfolio', 'Blog', 'Careers'].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase()}`} className="hover:text-primary transition-colors cursor-hover">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-medium mb-6">Contact</h4>
          <ul className="space-y-3 text-text-secondary">
            <li><a href="mailto:hello@luxeagency.com" className="hover:text-primary transition-colors cursor-hover">hello@luxeagency.com</a></li>
            <li><span>+1 (555) 123-4567</span></li>
            <li><span>New York, NY & Los Angeles, CA</span></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-medium mb-6">Newsletter</h4>
          <p className="text-text-secondary text-sm mb-4">Subscribe for exclusive insights and case studies.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-card border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:border-primary w-full"
            />
            <button className="bg-primary text-background p-2 rounded hover:bg-white transition-colors cursor-hover">
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="container-custom flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-text-secondary">
        <p>&copy; {new Date().getFullYear()} Luxe Digital Agency. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-primary transition-colors cursor-hover">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors cursor-hover">Terms</Link>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
            <a key={i} href="#" className="hover:text-primary transition-colors cursor-hover">
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
