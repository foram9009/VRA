'use client';
// app/portfolio/PortfolioGrid.tsx — CLIENT COMPONENT
// Handles category filtering state. Receives all data as props from the Server Component.
import { useState } from 'react';
import Section from '@/components/ui/Section';
import Link from 'next/link';
import Image from 'next/image';

type Project = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  year?: number | null;
  category?: { name: string; slug: string } | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

interface PortfolioGridProps {
  projects: Project[];
  categories: Category[];
}

export default function PortfolioGrid({ projects, categories }: PortfolioGridProps) {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all' ? projects : projects.filter((p) => p.category?.slug === filter);

  return (
    <Section>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          key="all"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            filter === 'all'
              ? 'bg-primary text-background'
              : 'bg-card border border-white/10 text-text-secondary hover:border-primary/50'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              filter === cat.slug
                ? 'bg-primary text-background'
                : 'bg-card border border-white/10 text-text-secondary hover:border-primary/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <p className="text-text-secondary col-span-full text-center py-16">
            No projects found in this category.
          </p>
        ) : (
          filtered.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group block overflow-hidden rounded-lg reveal cursor-hover"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="bg-card p-4">
                <h3 className="text-lg font-medium mb-1">{project.title}</h3>
                <p className="text-text-secondary text-sm">
                  {project.category?.name}
                  {project.year ? ` • ${project.year}` : ''}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </Section>
  );
}
