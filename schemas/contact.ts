// schemas/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// schemas/newsletter.ts
import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email('Valid email is required'),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
