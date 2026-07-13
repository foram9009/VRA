'use client';

import { useState } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function ApplicationForm({ jobTitle }: { jobTitle: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call — connect to real endpoint in production
    await new Promise(res => setTimeout(res, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-medium mb-2">Application Sent!</h3>
        <p className="text-text-secondary">We&apos;ll be in touch shortly regarding your application for <span className="text-primary">{jobTitle}</span>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-xl font-medium mb-2">Apply Now</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-text-secondary uppercase tracking-widest">First Name</label>
          <input required placeholder="e.g. Jordan" className="w-full bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-text-secondary uppercase tracking-widest">Last Name</label>
          <input required placeholder="e.g. Smith" className="w-full bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary uppercase tracking-widest">Email</label>
        <input required type="email" placeholder="you@example.com" className="w-full bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary uppercase tracking-widest">Portfolio / LinkedIn URL</label>
        <input required placeholder="https://yourportfolio.com" className="w-full bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary uppercase tracking-widest">Why are you a great fit?</label>
        <textarea required rows={4} placeholder="Tell us about your background and why this role excites you..." className="w-full bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary resize-none transition-colors" />
      </div>

      <div className="border-t border-dashed border-white/10 pt-5 space-y-1">
        <label className="text-xs text-text-secondary uppercase tracking-widest">Upload Resume (PDF)</label>
        <input type="file" accept=".pdf,.doc,.docx" className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-white cursor-pointer" />
      </div>

      <MagneticButton
        type="submit"
        disabled={status === 'submitting'}
        className={`w-full bg-white text-background py-4 rounded font-medium transition-all ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary'}`}
      >
        {status === 'submitting' ? 'Sending Application…' : 'Submit Application'}
      </MagneticButton>
    </form>
  );
}
