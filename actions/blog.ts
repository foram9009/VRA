// actions/blog.ts
'use server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  coverImage: z.string().url(),
  categoryId: z.string(),
  tags: z.array(z.string()),
});

export async function createBlog(formData: FormData) {
  const session = await auth();
  if (!session?.user || !([Role.ADMIN, Role.EDITOR] as Role[]).includes(session.user.role as Role)) return { error: 'Unauthorized' };
  
  const data = Object.fromEntries(formData);
  const parsed = blogSchema.safeParse({ ...data, tags: JSON.parse(data.tags as string) });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.blog.create({ data: { ...parsed.data, authorId: session.user.id, readTime: Math.ceil(parsed.data.content.split(' ').length / 200) } });
  revalidatePath('/dashboard/blog');
  return { success: true };
}

export async function updateBlog(formData: FormData) { /* Same pattern as portfolio/update */ }
export async function deleteBlog(id: string) { /* Same pattern as portfolio/delete */ }
