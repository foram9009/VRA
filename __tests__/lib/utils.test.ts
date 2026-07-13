// __tests__/lib/utils.test.ts
import { slugify, formatDate } from '@/lib/utils';

describe('Utility Functions', () => {
  test('slugify converts string to URL-safe format', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Next.js 15 App Router')).toBe('nextjs-15-app-router');
  });

  test('formatDate returns formatted date string', () => {
    const date = new Date('2024-12-25');
    expect(formatDate(date)).toBe('December 25, 2024');
  });
});
