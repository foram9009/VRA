import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@luxeagency.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@luxeagency.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.portfolioCategory.createMany({
    data: [
      { id: 'branding', name: 'Branding', slug: 'branding' },
      { id: 'web-design', name: 'Web Design', slug: 'web-design' },
      { id: 'motion', name: 'Motion & 3D', slug: 'motion' },
    ],
    skipDuplicates: true,
  });

  await prisma.blogCategory.createMany({
    data: [
      { id: 'insights', name: 'Design Insights', slug: 'insights' },
      { id: 'case-studies', name: 'Case Studies', slug: 'case-studies' },
    ],
    skipDuplicates: true,
  });

  await prisma.siteSetting.upsert({
    where: { key: 'siteName' },
    update: {},
    create: { key: 'siteName', value: 'Luxe Digital Agency' },
  });

  console.log('✅ Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
