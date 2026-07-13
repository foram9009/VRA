'use client';
// app/error.tsx — Global Error Boundary
// Catches unhandled runtime errors in Server Components and renders a fallback UI.
import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry) in production
    console.error('[Global Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <h1 className="heading-lg mb-4 text-white">Something went wrong</h1>
      <p className="text-text-secondary max-w-md mb-8">
        An unexpected error occurred. Our team has been notified.
        {error.digest && (
          <span className="block mt-2 text-xs text-text-muted font-mono">
            Error ID: {error.digest}
          </span>
        )}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-primary text-background px-6 py-3 rounded-full font-medium hover:bg-white transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-white/20 text-primary px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
