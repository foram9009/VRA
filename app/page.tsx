import Hero from '@/components/sections/Hero';
import Section from '@/components/ui/Section';
import { getHomeData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';


export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      <Hero />

      {/* Featured Projects */}
      <Section id="work">
        <h2 className="heading-lg mb-12 reveal">Selected Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.portfolios.map((project: (typeof data.portfolios)[number]) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`} className="group relative block overflow-hidden rounded-lg reveal cursor-hover">
              <Image 
                src={project.coverImage} 
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-primary text-lg font-medium tracking-wide">{project.title}</span>
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
        <h3 className="text-center text-text-secondary mb-10 reveal">Trusted By Industry Leaders</h3>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 reveal">
          {data.clients.map((client: (typeof data.clients)[number]) => (
            <Image key={client.id} src={client.logoUrl} alt={client.name} width={140} height={40} className="grayscale hover:grayscale-0 transition-all duration-500" />
          ))}
        </div>
      </Section>

      {/* Newsletter */}
      <Section id="newsletter" className="bg-card rounded-3xl text-center">
        <h2 className="heading-lg mb-4 reveal">Stay Ahead of the Curve</h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-8 reveal">Weekly insights on design, strategy, and technology. No spam, ever.</p>
        <NewsletterForm />
      </Section>
    </>
  );
}
