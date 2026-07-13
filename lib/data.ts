import { Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const publishedWhere = { status: Status.PUBLISHED };

export async function getHomeData() {
  const [portfolios, testimonials, clients, faqs, blogs] = await Promise.all([
    prisma.portfolio.findMany({ where: { status: Status.PUBLISHED }, take: 3 }),
    prisma.testimonial.findMany({ where: { status: Status.PUBLISHED }, take: 4 }),
    prisma.client.findMany({ where: { status: Status.PUBLISHED } }),
    prisma.fAQ.findMany({ where: { status: Status.PUBLISHED }, orderBy: { order: 'asc' } }),
    prisma.blog.findMany({ where: { status: Status.PUBLISHED }, take: 3, include: { author: true, category: true } }),
  ]);

  return { portfolios, testimonials, clients, faqs, blogs };
}

export async function getAboutData() {
  const [team] = await Promise.all([
    prisma.user.findMany({ where: { role: { in: ['ADMIN', 'EDITOR'] } }, select: { name: true, image: true, email: true } }),
  ]);
  return { team };
}

export async function getServiceData() {
  return prisma.service.findMany({ where: { status: Status.PUBLISHED } });
}

export async function getPortfolioData(category?: string) {
  const where = category && category !== 'all'
    ? { status: Status.PUBLISHED, categoryId: category }
    : publishedWhere;

  return Promise.all([
    prisma.portfolio.findMany({ where, include: { category: true } }),
    prisma.portfolioCategory.findMany(),
  ]);
}

export async function getBlogData(category?: string, page = 1) {
  const skip = (page - 1) * 6;
  const where = category && category !== 'all'
    ? { status: Status.PUBLISHED, categoryId: category }
    : publishedWhere;

  return Promise.all([
    prisma.blog.findMany({ where, skip, take: 6, include: { author: true, category: true } }),
    prisma.blog.count({ where }),
    prisma.blogCategory.findMany(),
  ]);
}

export async function getCareerData() {
  return prisma.career.findMany({ where: { status: Status.PUBLISHED } });
}
