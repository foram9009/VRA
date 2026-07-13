import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Section from '@/components/ui/Section';
import Link from 'next/link';
import ApplicationForm from './ApplicationForm';
import type { Metadata } from 'next';
import { Status } from '@prisma/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const career = await prisma.career.findUnique({ where: { id } });
  if (!career) return { title: 'Job Not Found' };
  return {
    title: `${career.title} | Careers`,
    description: career.description.slice(0, 150),
  };
}

export default async function CareerDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const career = await prisma.career.findUnique({ where: { id } });

  // Only show published jobs (or handle 404)
  if (!career || career.status !== Status.PUBLISHED) {
    notFound();
  }

  // Parse requirements from [{text: string}] JSON stored in DB
  let requirements: string[] = [];
  try {
    const raw = career.requirements;
    if (Array.isArray(raw)) {
      requirements = (raw as { text: string }[]).map(r => r.text).filter(Boolean);
    }
  } catch {
    requirements = [];
  }

  return (
    <>
      {/* Hero Header */}
      <div className="pt-32 pb-16 container-custom">
        <Link href="/careers" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to All Openings
        </Link>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold uppercase tracking-widest">
            {career.type}
          </span>
          <span className="px-3 py-1 bg-white/5 text-text-secondary border border-white/10 rounded-full text-xs uppercase tracking-widest">
            {career.location}
          </span>
        </div>
        <h1 className="heading-xl mb-4">{career.title}</h1>
      </div>

      <Section>
        <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-start">
          {/* Left — Job Info */}
          <div>
            <h2 className="text-xl font-medium text-primary mb-4">About the Role</h2>
            <p className="text-text-secondary leading-relaxed mb-10 whitespace-pre-line">{career.description}</p>

            {requirements.length > 0 && (
              <>
                <h2 className="text-xl font-medium text-primary mb-4">Requirements</h2>
                <ul className="space-y-3 mb-12">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary group">
                      <span className="mt-2 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 group-hover:scale-150 transition-transform" />
                      {req}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="text-xl font-medium text-primary mb-4">Why Join Us?</h2>
            <p className="text-text-secondary leading-relaxed">
              Unlimited PTO, competitive salary, remote-friendly culture, and the opportunity to work on global award-winning projects that push the boundaries of digital design.
            </p>
          </div>

          {/* Right — Application Form */}
          <div className="bg-card p-8 rounded-xl border border-white/5 sticky top-28">
            <ApplicationForm jobTitle={career.title} />
          </div>
        </div>
      </Section>
    </>
  );
}
