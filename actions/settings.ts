// actions/settings.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

function requireAdmin(role: Role): boolean {
  return role === Role.ADMIN;
}

export async function updateSettings(settings: Record<string, string>) {
  const session = await auth();
  if (!session?.user || !requireAdmin(session.user.role)) {
    return { success: false, error: 'Unauthorized. Only Administrators can modify global settings.' };
  }

  try {
    const promises = Object.entries(settings).map(([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await Promise.all(promises);

    revalidatePath('/', 'layout');
    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    console.error('[updateSettings]', error);
    return { success: false, error: 'Failed to save site settings.' };
  }
}
