// lib/rbac.ts
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

export async function requireRole(allowedRoles: Role[]): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = session.user.role as Role | undefined;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null; // null = authorized, proceed
}

/**
 * Type-safe admin check that works with the augmented NextAuth Session type.
 * Accepts the session object from `auth()` — never `any`.
 */
export function isAdmin(session: Session | null): boolean {
  if (!session?.user?.role) return false;
  return session.user.role === Role.ADMIN || session.user.role === Role.EDITOR;
}
