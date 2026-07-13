import { prisma } from '@/lib/prisma';

export async function getHomeData() {
  const [portfolios, testimonials, clients, faqs, blogs] = await Promise.all([
    prisma.portfolio.findMany({ where: { status: 'PUBLISHED' }, take: 3 }),
    prisma.testimonial.findMany({ where: { status: 'PUBLISHED' }, take: 4 }),
    prisma.client.findMany({ where: { status: 'PUBLISHED' } }),
    prisma.faq.findMany({ where: { status: 'PUBLISHED' }, orderBy: { order: 'asc' } }),
    prisma.blog.findMany({ where: { status: 'PUBLISHED' }, take: 3, include: { author: true, category: true } }),
  ]);

  return { portfolios, testimonials, clients, faqs, blogs };
}

export async function getAboutData() {
  const [team, awards] = await Promise.all([
    prisma.user.findMany({ where: { role: 'ADMIN' || 'EDITOR' }, select: { name: true, image: true, email: true } }),
    prisma.siteSetting.findUnique({ where: { key: 'awards' }, or: [] }) as any,
  ]);
  return { team }; // Awards can be expanded in settings model later
}

export async function getServiceData() {
  return prisma.service.findMany({ where: { status: 'PUBLISHED' } });
}

export async function getPortfolioData(category?: string) {
  const where = category && category !== 'all' 
    ? { status: 'PUBLISHED', categoryId: category } 
    : { status: 'PUBLISHED' };
    
  return Promise.all([
    prisma.portfolio.findMany({ where, include: { category: true } }),
    prisma.portfolioCategory.findMany(),
  ]);
}

export async function getBlogData(category?: string, page = 1) {
  const skip = (page - 1) * 6;
  const where = category && category !== 'all' 
    ? { status: 'PUBLISHED', categoryId: category } 
    : { status: 'PUBLISHED' };
    
  return Promise.all([
    prisma.blog.findMany({ where, skip, take: 6, include: { author: true, category: true } }),
    prisma.blog.count({ where }),
    prisma.blogCategory.findMany(),
  ]);
}

export async function getCareerData() {
  return prisma.career.findMany({ where: { status: 'PUBLISHED' } });
}
