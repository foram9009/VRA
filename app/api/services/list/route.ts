import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('[services/list GET]', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
