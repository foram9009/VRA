// app/dashboard/layout.tsx — SERVER COMPONENT
// Keeping this as a Server Component (no 'use client') allows child pages to use
// generateMetadata() for per-page SEO titles and descriptions.
// All interactive sidebar logic is in the DashboardSidebar client component.
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import DashboardSidebar from '@/components/admin/DashboardSidebar';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Luxe Dashboard',
  },
  robots: {
    index: false, // Prevent search engines from indexing the admin dashboard
    follow: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth guard — provides a harder security layer on top of middleware
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const isAuthorized =
    session.user.role === Role.ADMIN || session.user.role === Role.EDITOR;

  if (!isAuthorized) {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden">
      <DashboardSidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
