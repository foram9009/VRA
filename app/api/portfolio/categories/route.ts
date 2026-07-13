import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const categories = await prisma.portfolioCategory.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[portfolio/categories GET]', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
