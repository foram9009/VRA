'use client';
// app/dashboard/error.tsx — Dashboard Error Boundary
import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Dashboard Error Boundary]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="max-w-md">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-400 text-2xl">⚠</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-3">Dashboard Error</h2>
        <p className="text-text-secondary mb-6">
          Something went wrong loading this section.
          {error.digest && (
            <span className="block mt-2 text-xs text-text-muted font-mono">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-background px-5 py-2.5 rounded-md font-medium hover:bg-white transition-colors text-sm"
          >
            Retry
          </button>
          <Link
            href="/dashboard"
            className="border border-white/10 text-text-secondary px-5 py-2.5 rounded-md font-medium hover:bg-white/5 transition-colors text-sm"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
