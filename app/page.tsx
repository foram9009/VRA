import Hero from '@/components/sections/Hero';
import Section from '@/components/ui/Section';
import { getHomeData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';
import TextReveal from '@/components/animations/TextReveal';


export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      <Hero />

      {/* Featured Projects */}
      <Section id="work">
        <TextReveal text="Selected Work" className="heading-lg mb-12 text-left" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.portfolios.map((project: (typeof data.portfolios)[number]) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group block overflow-hidden rounded-xl border border-white/5 card-hover cursor-hover reveal"
            >
              {/* Image */}
              <div className="relative h-72 img-zoom">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                  <span className="text-primary text-xs uppercase tracking-widest font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    View Project →
                  </span>
                </div>
              </div>
              {/* Card Footer */}
              <div className="bg-card px-5 py-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                  {'category' in project && project.category && (
                    <p className="text-text-secondary text-xs mt-0.5">{(project.category as { name: string }).name}</p>
                  )}
                </div>
                {'year' in project && project.year && (
                  <span className="text-text-secondary text-xs tabular-nums">{String(project.year)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Section>


      {/* About Preview */}
      <Section id="about" className="bg-surface rounded-3xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <h2 className="heading-lg mb-6">More Than Pixels.<br />We Build Ecosystems.</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Founded on the belief that design should drive measurable growth, we partner with forward-thinking brands to create digital products that resonate. Our process is human-centered, data-informed, and relentlessly refined.
            </p>
            <Link href="/about" className="text-primary hover:underline cursor-hover">Learn About Us →</Link>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden reveal">
            <Image src="/placeholder-about.jpg" alt="Agency Workspace" fill className="object-cover opacity-80" />
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section id="stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '12+', label: 'Years Experience' },
            { number: '150+', label: 'Projects Delivered' },
            { number: '45', label: 'Awards Won' },
            { number: '98%', label: 'Client Retention' },
          ].map((stat, i) => (
            <div key={i} className="reveal">
              <span className="block text-4xl md:text-5xl font-light text-primary mb-2">{stat.number}</span>
              <span className="text-text-secondary text-sm tracking-wide uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Clients */}
      <Section id="clients">
        <TextReveal text="Trusted By Industry Leaders" className="text-center text-text-secondary mb-10 text-xs tracking-widest uppercase font-semibold" />
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 reveal">
          {data.clients.map((client: (typeof data.clients)[number]) => (
            <Image key={client.id} src={client.logoUrl} alt={client.name} width={140} height={40} className="grayscale hover:grayscale-0 transition-all duration-500" />
          ))}
        </div>
      </Section>

      {/* Newsletter */}
      <Section id="newsletter" className="bg-card rounded-3xl text-center">
        <TextReveal text="Stay Ahead of the Curve" className="heading-lg mb-4 text-center" />
        <p className="text-text-secondary max-w-xl mx-auto mb-8 reveal">Weekly insights on design, strategy, and technology. No spam, ever.</p>
        <NewsletterForm />
      </Section>
    </>
  );
}
