'use client';
// app/portfolio/PortfolioGrid.tsx — CLIENT COMPONENT
import { useState } from 'react';
import Section from '@/components/ui/Section';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Project = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  year?: number | null;
  category?: { name: string; slug: string } | null;
};

type Category = { id: string; name: string; slug: string };

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
      <div className="flex flex-wrap gap-3 mb-12 reveal">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            filter === 'all'
              ? 'bg-primary text-background shadow-lg shadow-primary/20'
              : 'tag-pill cursor-hover'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.slug)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === cat.slug
                ? 'bg-primary text-background shadow-lg shadow-primary/20'
                : 'tag-pill cursor-hover'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filtered.length === 0 ? (
            <p className="text-text-secondary col-span-full text-center py-16">
              No projects found in this category.
            </p>
          ) : (
            filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group block overflow-hidden rounded-xl border border-white/5 card-hover cursor-hover"
                >
                  {/* Image with zoom */}
                  <div className="relative h-72 img-zoom">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <span className="text-primary text-xs uppercase tracking-widest font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        View Project →
                      </span>
                    </div>
                  </div>
                  {/* Card Body */}
                  <div className="bg-card p-5 border-t border-white/5">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                    <p className="text-text-secondary text-sm flex items-center gap-2">
                      {project.category?.name && (
                        <span className="text-primary/70">{project.category.name}</span>
                      )}
                      {project.category?.name && project.year && <span className="text-white/20">•</span>}
                      {project.year && <span>{project.year}</span>}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
