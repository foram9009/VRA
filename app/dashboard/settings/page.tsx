// app/dashboard/settings/page.tsx
import { prisma } from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

const keys = [
  'siteName',
  'contactEmail',
  'contactPhone',
  'officeAddress',
  'socialTwitter',
  'socialInstagram',
  'socialLinkedin',
];

export default async function SettingsPage() {
  const settingsRecords = await prisma.siteSetting.findMany({
    where: {
      key: { in: keys },
    },
  });

  // Map to flat key-value pairs with default fallbacks
  const settings: Record<string, string> = {
    siteName: 'Luxe Digital Agency',
    contactEmail: 'hello@luxeagency.com',
    contactPhone: '+886 2 1234 5678',
    officeAddress: 'Taipei, Taiwan',
    socialTwitter: 'https://twitter.com/luxeagency',
    socialInstagram: 'https://instagram.com/luxeagency',
    socialLinkedin: 'https://linkedin.com/company/luxeagency',
  };

  settingsRecords.forEach((record) => {
    if (typeof record.value === 'string') {
      settings[record.key] = record.value;
    }
  });

  return <SettingsClient initialSettings={settings} />;
}
