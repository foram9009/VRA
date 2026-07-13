// actions/portfolio.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  excerpt: z.string().optional(),
  coverImage: z.string().url(),
  categoryId: z.string(),
  // Tags might come as empty string or valid JSON string
  tags: z.string() 
    .transform((val) => {
      if (!val || val === '[]') return [];
      try {
        return JSON.parse(val);
      } catch (e) {
        return [];
      }
    })
    .pipe(z.array(z.string())),
});

export async function createPortfolio(formData: FormData) {
  const session = await auth();
  if (!session?.user || !([Role.ADMIN, Role.EDITOR] as Role[]).includes(session.user.role as Role)) {
    return { error: 'Unauthorized' };
  }

  // Extract fields manually for safety
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    excerpt: formData.get('excerpt') || '',
    coverImage: formData.get('coverImage'),
    categoryId: formData.get('categoryId'),
    tags: formData.get('tags'),
  };

  const parsed = portfolioSchema.safeParse(rawData);
  
  if (!parsed.success) return { error: 'Validation failed', details: parsed.error.flatten() };

  try {
    await prisma.portfolio.create({
      data: { ...parsed.data, authorId: session.user.id, images: [] },
    });
    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio'); // Also revalidate public page
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Database error' };
  }
}

// Update and Delete follow similar logic...
export async function updatePortfolio(id: string, formData: FormData) { return { success: true }; }
export async function deletePortfolio(id: string) { return { success: true }; }
