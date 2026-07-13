// app/portfolio/page.tsx — SERVER COMPONENT
// Data is fetched server-side; filtering is delegated to a client child.
import type { Metadata } from 'next';
import { getPortfolioData } from '@/lib/data';
import PortfolioGrid from './PortfolioGrid';

export const metadata: Metadata = {
  title: 'Portfolio | Luxe Digital Agency',
  description: 'A curated selection of our most impactful digital experiences — branding, web design, and motion work.',
};

export default async function PortfolioPage() {
  const [projects, categories] = await getPortfolioData();

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4">Portfolio</h1>
        <p className="text-text-secondary max-w-xl">
          A curated selection of our most impactful digital experiences.
        </p>
      </div>

      <PortfolioGrid projects={projects} categories={categories} />
    </>
  );
}
