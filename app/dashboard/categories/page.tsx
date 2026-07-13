// app/dashboard/categories/page.tsx
import { prisma } from '@/lib/prisma';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const portfolioCategories = await prisma.portfolioCategory.findMany();
  const blogCategories = await prisma.blogCategory.findMany();

  return (
    <CategoriesClient
      initialPortfolioCategories={portfolioCategories}
      initialBlogCategories={blogCategories}
    />
  );
}
