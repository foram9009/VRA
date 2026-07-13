'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MagneticButton from '@/components/ui/MagneticButton';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-white/5 p-8 rounded-2xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-3xl font-light tracking-widest text-primary block mb-2">VRA</span>
          <h2 className="text-xl font-medium text-white">Admin Portal Login</h2>
          <p className="text-text-secondary text-sm mt-1">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div role="alert" className="bg-red-950/30 border border-red-900/50 text-red-200 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@luxeagency.com"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <MagneticButton type="submit" disabled={loading} className="w-full bg-primary text-background font-semibold py-3 rounded-lg transition-colors duration-300 hover:bg-white disabled:opacity-50">
            {loading ? 'Logging in...' : 'Sign In'}
          </MagneticButton>
        </form>
      </div>
    </div>
  );
}
