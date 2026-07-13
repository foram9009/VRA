'use server';

import { contactSchema, newsletterSchema } from '@/schemas/contact';
import { ContactService, NewsletterService } from '@/services/prisma';
import { sendContactEmail, sendNewsletterConfirmation } from '@/lib/resend';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

// Single flat state type — avoids discriminated union mismatches with useActionState
export type ContactActionState = {
  success: string | null;
  error: string | null;
  fields: Record<string, string[]>;
};

export type NewsletterActionState = {
  success: boolean;
  error: string | null;
};

export async function contactAction(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // 1. Validate with Zod schema
    const parsed = contactSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        error: 'Please check the form for errors.',
        success: null,
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    // 2. Get current user ID if logged in (optional linkage)
    const session = await auth();
    const userId = session?.user?.id;

    // 3. Persist to database
    await ContactService.create({ ...parsed.data, userId });

    // 4. Send notification email to admin
    await sendContactEmail(
      process.env.ADMIN_EMAIL || 'admin@luxeagency.com',
      `New Inquiry: ${parsed.data.subject || 'No Subject'}`,
      parsed.data.name,
      parsed.data.message
    );

    // 5. Invalidate dashboard contact list cache
    revalidatePath('/dashboard');

    return {
      success: 'Message sent successfully! We will get back to you shortly.',
      error: null,
      fields: {},
    };
  } catch (error) {
    console.error('[contactAction]', error);
    return {
      error: 'Something went wrong. Please try again later.',
      success: null,
      fields: {},
    };
  }
}

export async function newsletterAction(
  _prevState: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  const email = formData.get('email') as string;

  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    await NewsletterService.subscribe(parsed.data.email);
    await sendNewsletterConfirmation(parsed.data.email);
    return { success: true, error: null };
  } catch (e) {
    console.error('[newsletterAction]', e);
    return { success: false, error: 'Subscription failed. Please try again.' };
  }
}
