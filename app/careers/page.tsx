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
            <div key={job.id} className="bg-card p-6 rounded-lg border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 reveal">
              <div>
                <h3 className="text-xl font-medium">{job.title}</h3>
                <p className="text-text-secondary text-sm mt-1">{job.location} • {job.type}</p>
              </div>
              <Link href={`/careers/${job.id}`} className="px-5 py-2 bg-white/5 border border-white/10 rounded hover:bg-primary hover:text-background transition-colors cursor-hover whitespace-nowrap">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
