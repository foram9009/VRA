import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function requireRole(allowedRoles: Role[]) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userRole = session.user.role as Role;
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null; // Null means authorized
}

export function isAdmin(session: any) {
  return session?.user?.role === Role.ADMIN || session?.user?.role === Role.EDITOR;
}
