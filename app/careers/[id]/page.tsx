'use client';

import { useParams } from 'next/navigation';
import Section from '@/components/ui/Section';
import MagneticButton from '@/components/ui/MagneticButton';
import { useState } from 'react';

// In a real app, you'd fetch data via Server Component and pass props. 
// For brevity, I'll mock the job data structure based on Prisma schema.
const MOCK_JOB = {
  title: "Senior Frontend Engineer",
  location: "Remote / New York",
  type: "Full-Time",
  description: "We are looking for an elite frontend engineer to join our core team...",
  requirements: ["5+ years React experience", "Expertise in TypeScript & Next.js", "Strong eye for UI/UX", "Experience with GSAP/Framer Motion"],
};

export default function CareerDetailsPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">{MOCK_JOB.title}</h1>
        <div className="flex gap-4 text-text-secondary mb-8 reveal">
          <span>{MOCK_JOB.location}</span>
          <span>•</span>
          <span>{MOCK_JOB.type}</span>
        </div>
      </div>

      <Section>
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Job Description */}
          <div>
            <h3 className="text-xl font-medium text-primary mb-4 reveal">About the Role</h3>
            <p className="text-text-secondary leading-relaxed mb-8 reveal">{MOCK_JOB.description}</p>

            <h3 className="text-xl font-medium text-primary mb-4 reveal">Requirements</h3>
            <ul className="space-y-3 mb-12 reveal">
              {MOCK_JOB.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>

             <h3 className="text-xl font-medium text-primary mb-4 reveal">Why Join Luxe?</h3>
             <p className="text-text-secondary leading-relaxed reveal">
               Unlimited PTO, Competitive Salary, Remote-friendly culture, and the opportunity to work on global award-winning projects.
             </p>
          </div>

          {/* Application Form */}
          <div className="bg-card p-8 rounded-xl border border-white/5 h-fit reveal">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-medium mb-2">Application Sent</h3>
                <p className="text-text-secondary">We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-medium mb-4">Apply Now</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="First Name" className="bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary w-full" />
                  <input required placeholder="Last Name" className="bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary w-full" />
                </div>

                <input required type="email" placeholder="Email Address" className="bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary w-full" />
                
                <input required placeholder="Portfolio / LinkedIn URL" className="bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary w-full" />
                
                <textarea required rows={4} placeholder="Why are you a good fit?" className="bg-background border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary w-full resize-none" />

                <div className="border-t border-dashed border-white/10 pt-6">
                  <label className="block text-sm text-text-secondary mb-2">Upload Resume (PDF)</label>
                  <input type="file" accept=".pdf,.doc,.docx" className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-white cursor-pointer" />
                </div>

                <MagneticButton 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className={`w-full bg-white text-background py-4 rounded font-medium transition-all ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'submitting' ? 'Sending...' : 'Submit Application'}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
