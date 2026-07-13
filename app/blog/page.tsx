import Section from '@/components/ui/Section';
import { getBlogData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Blog({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  const page = Number(resolvedSearchParams.page) || 1;
  
  const [posts, total, categories] = await getBlogData(category, page);

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">Journal</h1>
        <p className="text-text-secondary max-w-xl reveal">Insights, case studies, and creative thinking from our studio.</p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all reveal cursor-hover">
              <div className="relative h-48">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <span className="text-xs text-primary uppercase tracking-wider">{post.category?.name}</span>
                <h3 className="text-lg font-medium mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-text-secondary text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-text-secondary">
                  <span>{formatDate(new Date(post.createdAt))}</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-12">
          {page > 1 && (
            <Link href={`/blog?page=${page - 1}`} className="px-4 py-2 border border-white/10 rounded hover:bg-card transition-colors cursor-hover">Prev</Link>
          )}
          <span className="px-4 py-2 text-text-secondary">Page {page}</span>
          {(page * 6) < total && (
            <Link href={`/blog?page=${page + 1}`} className="px-4 py-2 border border-white/10 rounded hover:bg-card transition-colors cursor-hover">Next</Link>
          )}
        </div>
      </Section>
    </>
  );
}
