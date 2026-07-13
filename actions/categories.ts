// actions/categories.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
});

function requireAdminOrEditor(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export async function createPortfolioCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
  };

  const parsed = categorySchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  try {
    const existing = await prisma.portfolioCategory.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return { success: false, error: 'A category with this slug already exists.' };
    }

    await prisma.portfolioCategory.create({
      data: parsed.data,
    });

    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('[createPortfolioCategory]', error);
    return { success: false, error: 'Failed to create category.' };
  }
}

export async function deletePortfolioCategory(id: string) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Check if category is used in portfolios
    const count = await prisma.portfolio.count({
      where: { categoryId: id },
    });
    if (count > 0) {
      return { success: false, error: 'Cannot delete category because it is assigned to existing projects.' };
    }

    await prisma.portfolioCategory.delete({ where: { id } });
    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('[deletePortfolioCategory]', error);
    return { success: false, error: 'Failed to delete category.' };
  }
}

export async function createBlogCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
  };

  const parsed = categorySchema.omit({ description: true }).safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  try {
    const existing = await prisma.blogCategory.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return { success: false, error: 'A category with this slug already exists.' };
    }

    await prisma.blogCategory.create({
      data: parsed.data,
    });

    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('[createBlogCategory]', error);
    return { success: false, error: 'Failed to create category.' };
  }
}

export async function deleteBlogCategory(id: string) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Check if category is used in blogs
    const count = await prisma.blog.count({
      where: { categoryId: id },
    });
    if (count > 0) {
      return { success: false, error: 'Cannot delete category because it is assigned to existing blog posts.' };
    }

    await prisma.blogCategory.delete({ where: { id } });
    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('[deleteBlogCategory]', error);
    return { success: false, error: 'Failed to delete category.' };
  }
}
