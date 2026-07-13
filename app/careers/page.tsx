import Section from '@/components/ui/Section';
import { getCareerData } from '@/lib/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Careers() {
  const jobs = await getCareerData();

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">Join Our Team</h1>
        <p className="text-text-secondary max-w-xl reveal">We&apos;re always looking for sharp minds and creative hearts.</p>
      </div>

      <Section>
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-card p-6 rounded-xl border border-white/5 card-hover flex flex-col md:flex-row justify-between items-start md:items-center gap-4 reveal"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full border border-primary/20 bg-primary/10 text-primary">
                    {'type' in job ? String(job.type) : 'Full-time'}
                  </span>
                  {'location' in job && (
                    <span className="px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest rounded-full border border-white/10 bg-white/5 text-text-secondary">
                      {String(job.location)}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-medium">{job.title}</h3>
              </div>
              <Link
                href={`/careers/${job.id}`}
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 cursor-hover whitespace-nowrap text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </Section>

    </>
  );
}
