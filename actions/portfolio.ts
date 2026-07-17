// actions/portfolio.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role, Status } from '@prisma/client';

const portfolioSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url('Must be a valid image URL'),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z
    .string()
    .transform((val) => {
      if (!val || val.trim() === '' || val === '[]') return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })
    .pipe(z.array(z.string())),
});

function requireAdminOrEditor(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export async function createPortfolio(formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    excerpt: formData.get('excerpt') || undefined,
    coverImage: formData.get('coverImage'),
    categoryId: formData.get('categoryId'),
    tags: formData.get('tags') ?? '[]',
  };

  const parsed = portfolioSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  // Check for slug collision
  const existing = await prisma.portfolio.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: 'A project with this slug already exists. Please use a different slug.' };
  }

  try {
    await prisma.portfolio.create({
      data: {
        ...parsed.data,
        authorId: session.user.id,
        images: [],
        status: Status.DRAFT,
      },
    });
    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (e) {
    console.error('[createPortfolio]', e);
    return { success: false, error: 'Database error. Please try again.' };
  }
}

export async function updatePortfolio(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    excerpt: formData.get('excerpt') || undefined,
    coverImage: formData.get('coverImage'),
    categoryId: formData.get('categoryId'),
    tags: formData.get('tags') ?? '[]',
  };

  const parsed = portfolioSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  // Check slug collision (excluding the current item)
  const slugConflict = await prisma.portfolio.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (slugConflict) {
    return { success: false, error: 'A project with this slug already exists.' };
  }

  try {
    await prisma.portfolio.update({
      where: { id },
      data: { ...parsed.data },
    });
    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (e) {
    console.error('[updatePortfolio]', e);
    return { success: false, error: 'Database error. Please try again.' };
  }
}

export async function deletePortfolio(id: string) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.portfolio.delete({ where: { id } });
    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (e) {
    console.error('[deletePortfolio]', e);
    return { success: false, error: 'Database error. Please try again.' };
  }
}

export async function togglePortfolioStatus(id: string, currentStatus: Status) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const newStatus = currentStatus === Status.PUBLISHED ? Status.DRAFT : Status.PUBLISHED;

  try {
    await prisma.portfolio.update({ where: { id }, data: { status: newStatus } });
    revalidatePath('/dashboard/portfolio');
    revalidatePath('/portfolio');
    return { success: true, newStatus };
  } catch (e) {
    console.error('[togglePortfolioStatus]', e);
    return { success: false, error: 'Database error. Please try again.' };
  }
}
