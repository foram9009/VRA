// app/dashboard/careers/page.tsx
import { prisma } from '@/lib/prisma';
import CareersClient from './CareersClient';

export const dynamic = 'force-dynamic';

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Map database structures safely to pass to client component
  const serializedCareers = careers.map((c) => {
    let reqString = '';
    try {
      if (Array.isArray(c.requirements)) {
        reqString = (c.requirements as { text: string }[]).map((r) => r.text).join('\n');
      } else if (typeof c.requirements === 'string') {
        const parsed = JSON.parse(c.requirements);
        if (Array.isArray(parsed)) {
          reqString = parsed.map((r: any) => typeof r === 'string' ? r : r.text).join('\n');
        }
      }
    } catch (e) {
      console.warn('Failed to parse requirements json for career:', c.id, e);
    }

    return {
      id: c.id,
      title: c.title,
      location: c.location,
      type: c.type,
      description: c.description,
      requirements: reqString,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    };
  });

  return <CareersClient initialCareers={serializedCareers} />;
}
