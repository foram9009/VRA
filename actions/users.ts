// actions/users.ts
'use server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum([Role.ADMIN, Role.EDITOR, Role.USER]),
});

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) return { error: 'Unauthorized' };
  
  const data = Object.fromEntries(formData);
  const parsed = userSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.user.create({ data: { ...parsed.data, password: await bcrypt.hash('TempPass123!', 12) } });
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) return { error: 'Unauthorized' };
  
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) return { error: 'Unauthorized' };
  
  await prisma.user.delete({ where: { id } });
  revalidatePath('/dashboard/users');
  return { success: true };
}