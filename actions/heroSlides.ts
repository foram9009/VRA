// actions/heroSlides.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

export type HeroSlideData = {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  label?: string;
};

const SETTING_KEY = 'heroSlides';

/** Read the stored hero slides (or return an empty array if not set yet). */
export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    const record = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    if (!record) return [];
    const parsed = record.value as HeroSlideData[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Persist the full slides array (admin/editor only). */
export async function saveHeroSlides(slides: HeroSlideData[]) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.EDITOR)
  ) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.siteSetting.upsert({
      where: { key: SETTING_KEY },
      update: { value: slides as any },
      create: { key: SETTING_KEY, value: slides as any },
    });
    revalidatePath('/');          // home page hero
    revalidatePath('/dashboard/hero');
    return { success: true };
  } catch (e) {
    console.error('[saveHeroSlides]', e);
    return { success: false, error: 'Database error. Please try again.' };
  }
}
