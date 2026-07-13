import Section from '@/components/ui/Section';
import { getAboutData } from '@/lib/data';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function About() {
  const data = await getAboutData();

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">Our Story</h1>
        <p className="text-2xl text-text-secondary max-w-3xl reveal">Built by creators, for visionaries.</p>
      </div>

      <Section>
        <div className="grid md:grid-cols-2 gap-16">
          <div className="reveal">
            <h2 className="text-2xl font-light mb-4 text-primary">Mission</h2>
            <p className="text-text-secondary leading-relaxed">To elevate brands through intentional design, strategic thinking, and technology that doesn&apos;t just function—it performs.</p>
          </div>
          <div className="reveal">
            <h2 className="text-2xl font-light mb-4 text-primary">Vision</h2>
            <p className="text-text-secondary leading-relaxed">A digital landscape where creativity and conversion coexist. Where every pixel serves a purpose, and every interaction leaves a mark.</p>
          </div>
        </div>
      </Section>

      <Section id="team" className="bg-surface rounded-3xl">
        <h2 className="heading-lg mb-10 text-center reveal">The Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.team.map((member, i) => (
            <div key={i} className="text-center reveal">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/30">
                <Image src={member.image || '/placeholder-avatar.jpg'} alt={member.name || 'Team Member'} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-text-secondary text-sm">{i === 0 ? 'Founder & Creative Director' : 'Lead Strategist / Developer'}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
