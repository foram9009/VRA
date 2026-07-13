// actions/careers.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Role, Status } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const careerSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  type: z.string().min(2, 'Type must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(), // split by newlines
  status: z.nativeEnum(Status).default(Status.DRAFT),
});

function requireAdminOrEditor(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export async function createCareer(formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    location: formData.get('location'),
    type: formData.get('type'),
    description: formData.get('description'),
    requirements: formData.get('requirements'),
    status: formData.get('status') as Status,
  };

  const parsed = careerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  // Parse requirements into [{text: 'req'}] format
  const reqList = parsed.data.requirements
    ? parsed.data.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0)
        .map((r) => ({ text: r }))
    : [];

  try {
    const career = await prisma.career.create({
      data: {
        title: parsed.data.title,
        location: parsed.data.location,
        type: parsed.data.type,
        description: parsed.data.description,
        requirements: reqList,
        status: parsed.data.status,
      },
    });

    revalidatePath('/dashboard/careers');
    revalidatePath('/careers');
    return { success: true, id: career.id };
  } catch (error) {
    console.error('[createCareer]', error);
    return { success: false, error: 'Failed to create career posting.' };
  }
}

export async function updateCareer(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    location: formData.get('location'),
    type: formData.get('type'),
    description: formData.get('description'),
    requirements: formData.get('requirements'),
    status: formData.get('status') as Status,
  };

  const parsed = careerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  const reqList = parsed.data.requirements
    ? parsed.data.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0)
        .map((r) => ({ text: r }))
    : [];

  try {
    await prisma.career.update({
      where: { id },
      data: {
        title: parsed.data.title,
        location: parsed.data.location,
        type: parsed.data.type,
        description: parsed.data.description,
        requirements: reqList,
        status: parsed.data.status,
      },
    });

    revalidatePath('/dashboard/careers');
    revalidatePath('/careers');
    revalidatePath(`/careers/${id}`);
    return { success: true };
  } catch (error) {
    console.error('[updateCareer]', error);
    return { success: false, error: 'Failed to update career posting.' };
  }
}

export async function deleteCareer(id: string) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Delete associated applications first to keep database clean
    await prisma.application.deleteMany({
      where: { careerId: id },
    });

    await prisma.career.delete({ where: { id } });

    revalidatePath('/dashboard/careers');
    revalidatePath('/careers');
    return { success: true };
  } catch (error) {
    console.error('[deleteCareer]', error);
    return { success: false, error: 'Failed to delete career posting.' };
  }
}
