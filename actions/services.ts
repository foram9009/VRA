// actions/services.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Role, Status } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const serviceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.string().transform((val) => {
    if (!val || val.trim() === '') return [];
    return val
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  }),
  priceRange: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  status: z.nativeEnum(Status).default(Status.DRAFT),
});

function requireAdminOrEditor(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export async function createService(formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    features: formData.get('features'),
    priceRange: formData.get('priceRange') || null,
    image: formData.get('image') || null,
    status: formData.get('status') as Status,
  };

  const parsed = serviceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  // Check for slug collision
  const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: 'A service with this slug already exists. Please use a unique slug.' };
  }

  try {
    await prisma.service.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        features: parsed.data.features,
        priceRange: parsed.data.priceRange,
        image: parsed.data.image,
        status: parsed.data.status,
      },
    });

    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    return { success: true };
  } catch (error) {
    console.error('[createService]', error);
    return { success: false, error: 'Failed to create service.' };
  }
}

export async function updateService(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    features: formData.get('features'),
    priceRange: formData.get('priceRange') || null,
    image: formData.get('image') || null,
    status: formData.get('status') as Status,
  };

  const parsed = serviceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  // Check for slug collision excluding itself
  const conflict = await prisma.service.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return { success: false, error: 'A service with this slug already exists.' };
  }

  try {
    await prisma.service.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        features: parsed.data.features,
        priceRange: parsed.data.priceRange,
        image: parsed.data.image,
        status: parsed.data.status,
      },
    });

    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    return { success: true };
  } catch (error) {
    console.error('[updateService]', error);
    return { success: false, error: 'Failed to update service.' };
  }
}

export async function deleteService(id: string) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath('/dashboard/services');
    revalidatePath('/services');
    return { success: true };
  } catch (error) {
    console.error('[deleteService]', error);
    return { success: false, error: 'Failed to delete service.' };
  }
}
