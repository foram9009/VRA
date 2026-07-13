import { PrismaClient } from '@prisma/client';

const pass = '&M,gW5FwD#GH';
const host = 'aws-0-ap-northeast-1.pooler.supabase.com';
const username = 'postgres.fiidpwnhfqoqfjxcfpdd';
const url = `postgresql://${username}:${encodeURIComponent(pass)}@${host}:6543/postgres`;

async function testSingle() {
  console.log(`Testing password: ${pass}`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log(`\n🎉 SUCCESS! Working connection string:\n${url}\n`);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error: any) {
    console.log(`❌ Failed: ${error.message || error}`);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testSingle();
