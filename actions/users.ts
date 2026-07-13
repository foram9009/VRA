// actions/users.ts
'use server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendNewUserCredentials } from '@/lib/resend';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum([Role.ADMIN, Role.EDITOR, Role.USER]),
});

/**
 * Generates a cryptographically secure random password.
 * Meets complexity requirements: uppercase, lowercase, number, special char.
 */
function generateSecurePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%^&*';
  const all = upper + lower + digits + special;

  // Guarantee at least one of each required character class
  const password = [
    upper[crypto.randomInt(upper.length)],
    lower[crypto.randomInt(lower.length)],
    digits[crypto.randomInt(digits.length)],
    special[crypto.randomInt(special.length)],
    // Fill remaining length with random chars
    ...Array.from({ length: 8 }, () => all[crypto.randomInt(all.length)]),
  ];

  // Shuffle to avoid predictable pattern at start
  return password.sort(() => crypto.randomInt(3) - 1).join('');
}

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return { error: 'Unauthorized: Only admins can create users.' };
  }

  const data = Object.fromEntries(formData);
  const parsed = userSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  // Check if user already exists to avoid confusing DB errors
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: 'A user with this email already exists.' };

  const tempPassword = generateSecurePassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      password: hashedPassword,
    },
  });

  // Email the temporary password to the new user
  await sendNewUserCredentials(parsed.data.email, tempPassword);

  revalidatePath('/dashboard/users');
  return { success: 'User created. Credentials have been emailed to them.' };
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return { error: 'Unauthorized' };
  }

  // Prevent admin from accidentally demoting themselves
  if (userId === session.user.id) {
    return { error: 'You cannot change your own role.' };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return { error: 'Unauthorized' };
  }

  // Prevent admin from deleting themselves
  if (id === session.user.id) {
    return { error: 'You cannot delete your own account.' };
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath('/dashboard/users');
  return { success: true };
}