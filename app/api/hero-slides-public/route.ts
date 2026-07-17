// app/api/hero-slides-public/route.ts
// Public endpoint — no auth required (slides are public content on the homepage).
import { NextResponse } from 'next/server';
import { getHeroSlides } from '@/actions/heroSlides';

export const dynamic = 'force-dynamic';

export async function GET() {
  const slides = await getHeroSlides();
  return NextResponse.json({ slides });
}
