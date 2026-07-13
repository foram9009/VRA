// actions/media.ts
'use server';

import { prisma } from '@/lib/prisma';
import { cloudinary } from '@/lib/cloudinary';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

function requireAdminOrEditor(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export async function deleteMedia(id: string) {
  const session = await auth();
  if (!session?.user || !requireAdminOrEditor(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // 1. Fetch item to get Cloudinary ID
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return { success: false, error: 'Media asset not found.' };
    }

    // 2. Delete from Cloudinary
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(media.cloudinaryId, (error, result) => {
        if (error) {
          console.warn('[CLOUDINARY_DELETE_WARNING]', error);
          // Proceed with db deletion even if Cloudinary fails, or handle depending on requirements.
        }
        resolve();
      });
    });

    // 3. Delete from database
    await prisma.media.delete({ where: { id } });

    revalidatePath('/dashboard/media');
    return { success: true };
  } catch (error) {
    console.error('[deleteMedia]', error);
    return { success: false, error: 'Failed to delete media asset.' };
  }
}
