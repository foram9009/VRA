import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Section from '@/components/ui/Section';
import { formatDate } from '@/lib/utils';

async function getPost(slug: string) {
  const post = await prisma.blog.findUnique({
    where: { slug },
    include: { author: true, category: true },
  });
  if (!post || post.status !== 'PUBLISHED') notFound();
  return post;
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  // Mock "Related Posts" logic - fetch others from same category
  const relatedPosts = await prisma.blog.findMany({
    where: { 
      categoryId: post.categoryId, 
      NOT: { id: post.id },
      status: 'PUBLISHED' 
    },
    take: 3,
    select: { id: true, title: true, slug: true, coverImage: true }
  });

  return (
    <article className="pb-20">
      {/* Header */}
      <header className="container-custom pt-32 pb-16 max-w-4xl mx-auto text-center reveal">
        <span className="text-primary uppercase tracking-widest text-sm font-semibold mb-4 block">
          {post.category.name}
        </span>
        <h1 className="heading-xl mb-8 leading-tight">{post.title}</h1>
        
        <div className="flex items-center justify-center gap-6 text-text-secondary text-sm">
          <div className="flex items-center gap-2">
             {post.author.image ? (
               <Image src={post.author.image} alt={post.author.name || 'Author'} width={32} height={32} className="rounded-full" />
             ) : (
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">JD</div>
             )}
             <span>{post.author.name || 'Anonymous'}</span>
          </div>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(new Date(post.createdAt))}
          </time>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="w-full h-[50vh] mb-16 reveal">
        <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
      </div>

      {/* Content Body */}
      <Section className="bg-surface/30 rounded-3xl">
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-text-secondary prose-a:text-primary">
          {/* 
            In a real app, use react-markdown or MDX. 
            For Prisma text field, simple whitespace handling is used here. 
            Ideally content would be split by newlines for paragraphs. 
          */}
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-6 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-3 reveal">
           {post.tags.map(tag => (
             <span key={tag} className="bg-card px-4 py-2 rounded-full text-xs text-text-secondary border border-white/5 hover:border-primary/50 transition-colors cursor-default">
               #{tag}
             </span>
           ))}
        </div>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section>
          <h3 className="text-2xl font-light mb-8 reveal">Read Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(rp => (
              <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block reveal cursor-hover">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image src={rp.coverImage} alt={rp.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h4 className="text-lg font-medium leading-tight group-hover:text-primary transition-colors">{rp.title}</h4>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
