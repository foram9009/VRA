'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  excerpt: z.string().optional(),
  coverImage: z.string().url('Valid image URL required'),
  categoryId: z.string(),
  tags: z.array(z.string()),
});

export async function createPortfolio(formData: FormData) {
  const session = await auth();
  if (!session?.user || ![Role.ADMIN, Role.EDITOR].includes(session.user.role as Role)) {
    return { error: 'Unauthorized' };
  }

  const data = Object.fromEntries(formData);
  const parsed = portfolioSchema.safeParse({ ...data, tags: JSON.parse(data.tags as string) });
  
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.portfolio.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  revalidatePath('/dashboard/portfolio');
  return { success: true };
}

export async function updatePortfolio(formData: FormData) {
  const session = await auth();
  if (!session?.user || ![Role.ADMIN, Role.EDITOR].includes(session.user.role as Role)) {
    return { error: 'Unauthorized' };
  }

  const data = Object.fromEntries(formData);
  const id = data.id as string;
  const parsed = portfolioSchema.safeParse({ ...data, tags: JSON.parse(data.tags as string) });

  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.portfolio.update({ where: { id }, data: parsed.data });
  revalidatePath('/dashboard/portfolio');
  return { success: true };
}

export async function deletePortfolio(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) return { error: 'Unauthorized' };

  await prisma.portfolio.delete({ where: { id } });
  revalidatePath('/dashboard/portfolio');
  return { success: true };
}
