'use client';

import { useFormState } from 'react-dom';
import Section from '@/components/ui/Section';
import MagneticButton from '@/components/ui/MagneticButton';
import { contactAction } from '@/lib/actions';

export default function Contact() {
  const [state, formAction] = useFormState(contactAction, { error: null });

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">Let's Talk</h1>
        <p className="text-text-secondary max-w-xl reveal">Ready to elevate your brand? Drop us a line.</p>
      </div>

      <Section>
        <form action={formAction} className="max-w-2xl mx-auto space-y-6 reveal">
          {state?.error && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 p-3 rounded">{state.error}</div>
          )}
          {state?.success && (
            <div className="bg-green-900/20 border border-green-800 text-green-200 p-3 rounded">{state.success}</div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <input name="name" required placeholder="Name" className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
            <input name="email" type="email" required placeholder="Email" className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
          </div>
          <input name="subject" placeholder="Subject (Optional)" className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
          <textarea name="message" required rows={5} placeholder="Tell us about your project..." className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none" />
          
          <MagneticButton type="submit" className="w-full md:w-auto bg-primary text-background px-8 py-3 rounded hover:bg-white transition-colors">
            Send Message
          </MagneticButton>
        </form>
      </Section>
    </>
  );
}
