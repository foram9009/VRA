// actions/blog.ts
'use server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { Role, Status } from '@prisma/client';

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url('Must be a valid image URL'),
  categoryId: z.string().min(1, 'Category is required'),
  // Safe tags transform — matches the portfolio action pattern
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

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export async function createBlog(formData: FormData) {
  const session = await auth();
  if (
    !session?.user ||
    !([Role.ADMIN, Role.EDITOR] as Role[]).includes(session.user.role)
  ) {
    return { error: 'Unauthorized' };
  }

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt') || undefined,
    coverImage: formData.get('coverImage'),
    categoryId: formData.get('categoryId'),
    tags: formData.get('tags') ?? '[]',
  };

  const parsed = blogSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: 'Validation failed', details: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.blog.create({
      data: {
        ...parsed.data,
        authorId: session.user.id,
        readTime: calculateReadTime(parsed.data.content),
        status: Status.DRAFT,
      },
    });
    revalidatePath('/dashboard/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (e) {
    console.error('[createBlog]', e);
    return { error: 'Database error. Please try again.' };
  }
}

export async function updateBlog(formData: FormData) {
  const session = await auth();
  if (
    !session?.user ||
    !([Role.ADMIN, Role.EDITOR] as Role[]).includes(session.user.role)
  ) {
    return { error: 'Unauthorized' };
  }

  const id = formData.get('id') as string;
  if (!id) return { error: 'Post ID is required' };

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt') || undefined,
    coverImage: formData.get('coverImage'),
    categoryId: formData.get('categoryId'),
    tags: formData.get('tags') ?? '[]',
  };

  const parsed = blogSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: 'Validation failed', details: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.blog.update({
      where: { id },
      data: {
        ...parsed.data,
        readTime: calculateReadTime(parsed.data.content),
      },
    });
    revalidatePath('/dashboard/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (e) {
    console.error('[updateBlog]', e);
    return { error: 'Database error. Please try again.' };
  }
}

export async function deleteBlog(id: string) {
  const session = await auth();
  if (
    !session?.user ||
    !([Role.ADMIN, Role.EDITOR] as Role[]).includes(session.user.role)
  ) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.blog.delete({ where: { id } });
    revalidatePath('/dashboard/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (e) {
    console.error('[deleteBlog]', e);
    return { error: 'Database error. Please try again.' };
  }
}
