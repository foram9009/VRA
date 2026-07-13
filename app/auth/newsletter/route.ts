// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/schemas/contact';
import { NewsletterService } from '@/services/prisma';
import { sendNewsletterConfirmation } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    await NewsletterService.subscribe(parsed.data.email);
    await sendNewsletterConfirmation(parsed.data.email);

    return NextResponse.json({ success: true, message: 'Subscribed successfully.' }, { status: 201 });
  } catch (e) {
    console.error('[NEWSLETTER_ERROR]', e);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}