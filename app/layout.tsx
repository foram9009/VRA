import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import MainLayout from '@/components/layout/MainLayout';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
});

// ── Viewport (must be exported separately in Next.js 15) ──────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070707',
};

// ── Site-wide SEO Metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Luxe Digital Agency — Strategy. Design. Technology.',
    template: '%s | Luxe Digital Agency',
  },
  description:
    'Award-winning digital agency specializing in brand strategy, UI/UX design, web development, and motion design. We build digital ecosystems that drive measurable growth.',
  keywords: [
    'digital agency',
    'brand strategy',
    'UI/UX design',
    'web development',
    'motion design',
    'creative agency',
  ],
  authors: [{ name: 'Luxe Digital Agency' }],
  creator: 'Luxe Digital Agency',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Luxe Digital Agency',
    title: 'Luxe Digital Agency — Strategy. Design. Technology.',
    description:
      'Award-winning digital agency specializing in brand strategy, UI/UX design, and web development.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Digital Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Digital Agency',
    description:
      'Award-winning digital agency specializing in brand strategy, UI/UX design, and web development.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark bg-background text-text-primary font-sans ${inter.variable}`}>
      <body>
        {/* SmoothScrollProvider initializes Lenis + GSAP ticker for the entire site */}
        <SmoothScrollProvider>
          <MainLayout>{children}</MainLayout>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
