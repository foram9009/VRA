'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Link from 'next/link';
import Image from 'next/image';
import { getPortfolioData } from '@/lib/data'; // Note: In Next.js 15, fetch in server component. Client state for filter only.

// Better pattern: Server page + client filter wrapper. I'll simplify to a server page with client interactivity.
export default function Portfolio() {
  // Data would normally be passed as props from server component. 
  // For brevity, I'll mock the fetch pattern here but structure it for SSR compatibility.
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getPortfolioData().then(([data, cats]) => {
      setProjects(data);
    });
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category?.slug === filter);

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">Portfolio</h1>
        <p className="text-text-secondary max-w-xl reveal">A curated selection of our most impactful digital experiences.</p>
      </div>

      <Section>
        <div className="flex flex-wrap gap-3 mb-10 reveal">
          {['all', 'branding', 'web-design', 'motion'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${filter === cat ? 'bg-primary text-background' : 'bg-card border border-white/10 text-text-secondary hover:border-primary/50'}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(project => (
            <Link key={project.id} href={`/portfolio/${project.slug}`} className="group block overflow-hidden rounded-lg reveal cursor-hover">
              <Image src={project.coverImage} alt={project.title} width={800} height={500} className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="bg-card p-4">
                <h3 className="text-lg font-medium mb-1">{project.title}</h3>
                <p className="text-text-secondary text-sm">{project.category?.name} • {project.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
