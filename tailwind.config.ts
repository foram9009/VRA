import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}', // FIX: was missing — classes in SmoothScrollProvider/ThreeProvider would be purged
    './schemas/**/*.{ts,tsx}',   // FIX: was missing — future-proofing
    './lib/**/*.{ts,tsx}',       // FIX: utility classes referenced here
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#070707',
        surface: '#111111',
        card: '#191919',
        primary: {
          DEFAULT: '#D6B16D',
          foreground: '#070707',
        },
        accent: {
          DEFAULT: '#D6B16D', // FIX: 'accent' is used in globals.css (.loading-screen bar) but was not defined as a Tailwind color
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#C9C9C9',
          muted: '#888888',
        },
        border: '#2A2A2A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out', // Used in dashboard overview page
      },
    },
  },
  plugins: [require('tailwindcss-animate') as ReturnType<typeof import('tailwindcss/plugin')>],
};

export default config;
