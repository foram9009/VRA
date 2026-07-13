// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user || (session.user.role !== Role.ADMIN && session.user.role !== Role.EDITOR)) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 3. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, file.name);

    // 5. Determine media type
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

    // 6. Save metadata to database
    const media = await prisma.media.create({
      data: {
        url: uploadResult.url,
        cloudinaryId: uploadResult.publicId,
        type: mediaType,
        folder: 'luxe-agency',
        size: file.size,
      },
    });

    return NextResponse.json({ url: media.url, id: media.id });
  } catch (error) {
    console.error('[API_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
