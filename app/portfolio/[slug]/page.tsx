import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Section from '@/components/ui/Section';
import { formatDate } from '@/lib/utils';

async function getProject(slug: string) {
  const project = await prisma.portfolio.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });
  if (!project || project.status !== 'PUBLISHED') notFound();
  return project;
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  
  // Parse JSON images safely
  const images = Array.isArray(project.images) 
    ? project.images as Array<{url: string, caption?: string}> 
    : [];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 container-custom">
        <div className="max-w-4xl mx-auto text-center mb-16 reveal">
          <span className="text-primary uppercase tracking-widest text-sm font-semibold mb-4 block">
            {project.category?.name || 'Project'}
          </span>
          <h1 className="heading-xl mb-6">{project.title}</h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            {project.excerpt}
          </p>
        </div>

        {/* Main Visual */}
        <div className="relative w-full h-[60vh] rounded-xl overflow-hidden mb-16 reveal">
          <Image 
            src={project.coverImage} 
            alt={project.title}
            fill
            priority
            className="object-cover transform hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </section>

      {/* Project Meta Grid */}
      <Section className="bg-surface/50 rounded-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/10 pb-12 mb-12">
          {[
            { label: 'Client', value: project.client || 'Private' },
            { label: 'Year', value: project.year?.toString() || '2023' },
            { label: 'Role', value: 'Lead Design & Dev' },
            { label: 'Category', value: project.category?.name || 'Digital' },
          ].map((item, i) => (
            <div key={i} className="reveal">
              <span className="text-text-secondary text-sm uppercase tracking-wider block mb-2">{item.label}</span>
              <span className="text-white text-lg font-light">{item.value}</span>
            </div>

))}
        </div>

        {/* Description Content */}
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-8 reveal">
            <h3 className="text-2xl font-light text-primary">The Challenge</h3>
            <p className="text-text-secondary leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="md:col-span-7 reveal delay-100">
             {/* Simulated "Tech Stack" or features list */}
             <h3 className="text-2xl font-light text-primary mb-6">Highlights</h3>
             <ul className="space-y-4">
               {project.tags.map(tag => (
                 <li key={tag} className="flex items-center gap-3 text-text-secondary">
                   <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                   {tag}
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.length > 0 ? images.map((img, i) => (
             <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden reveal group">
                <Image src={img.url} alt={img.caption || 'Project detail'} fill className="object-cover" />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white">{img.caption}</p>
                  </div>
                )}
             </div>
          )) : (
            /* Fallback if no extra images */
            <div className="col-span-full p-12 border border-dashed border-white/20 rounded-lg text-center">
              <p className="text-text-secondary">Additional assets available on request.</p>
            </div>
          )}
        </div>
      </Section>

      {/* Next Project CTA */}
      <Section className="text-center">
        <h2 className="text-3xl font-light mb-8 reveal">Interested in working together?</h2>
        <Link href="/contact" className="inline-block bg-primary text-background px-8 py-4 rounded-full font-medium hover:bg-white transition-colors reveal cursor-hover">
          Start a Project
        </Link>
      </Section>
    </>
  );
}
