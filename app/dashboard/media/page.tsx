// app/dashboard/media/page.tsx
import { prisma } from '@/lib/prisma';
import MediaClient from './MediaClient';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Map to simple serializable objects for client
  const serializedMedia = media.map((item) => ({
    id: item.id,
    url: item.url,
    cloudinaryId: item.cloudinaryId,
    type: item.type,
    folder: item.folder,
    size: item.size,
    createdAt: item.createdAt.toISOString(),
  }));

  return <MediaClient initialMedia={serializedMedia} />;
}
