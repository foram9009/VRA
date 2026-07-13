'use client';

import { useActionState } from 'react';
import Section from '@/components/ui/Section';
import MagneticButton from '@/components/ui/MagneticButton';
import { contactAction, type ContactActionState } from '@/lib/actions';

const initialState: ContactActionState = {
  success: null,
  error: null,
  fields: {},
};

export default function Contact() {
  const [state, formAction] = useActionState(contactAction, initialState);

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">Let&apos;s Talk</h1>
        <p className="text-text-secondary max-w-xl reveal">
          Ready to elevate your brand? Drop us a line.
        </p>
      </div>

      <Section>
        <form action={formAction} className="max-w-2xl mx-auto space-y-6 reveal">
          {state?.error && (
            <div
              role="alert"
              className="bg-red-900/20 border border-red-800 text-red-200 p-3 rounded"
            >
              {state.error}
            </div>
          )}
          {state?.success && (
            <div
              role="status"
              className="bg-green-900/20 border border-green-800 text-green-200 p-3 rounded"
            >
              {state.success}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                name="name"
                required
                placeholder="Name"
                autoComplete="name"
                className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fields?.name && (
                <p className="text-red-400 text-xs mt-1">{state.fields.name[0]}</p>
              )}
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                autoComplete="email"
                className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              />
              {state?.fields?.email && (
                <p className="text-red-400 text-xs mt-1">{state.fields.email[0]}</p>
              )}
            </div>
          </div>

          <input
            name="subject"
            placeholder="Subject (Optional)"
            className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors"
          />

          <div>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us about your project..."
              className="w-full bg-card border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
            />
            {state?.fields?.message && (
              <p className="text-red-400 text-xs mt-1">{state.fields.message[0]}</p>
            )}
          </div>

          <MagneticButton
            type="submit"
            className="w-full md:w-auto bg-primary text-background px-8 py-3 rounded hover:bg-white transition-colors"
          >
            Send Message
          </MagneticButton>
        </form>
      </Section>
    </>
  );
}
