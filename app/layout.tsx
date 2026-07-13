import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
// ... providers unchanged ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-background text-text-primary font-sans">
      <body className={inter.variable}>
        {/* Providers wrap everything */}
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
