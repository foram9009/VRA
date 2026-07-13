// app/api/portfolio/list/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') return new Response('Unauthorized', { status: 401 });
  const items = await prisma.portfolio.findMany({ include: { category: true } });
  return NextResponse.json({ items });
}

// app/api/portfolio/categories/route.ts, /api/blog/list/route.ts, /api/users/list/route.ts follow identical pattern.
