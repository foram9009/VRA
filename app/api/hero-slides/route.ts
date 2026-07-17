// app/api/hero-slides/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getHeroSlides } from '@/actions/heroSlides';
import { Role } from '@prisma/client';

export async function GET() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.EDITOR)
  ) {
    return new Response('Unauthorized', { status: 401 });
  }
  const slides = await getHeroSlides();
  return NextResponse.json({ slides });
}
