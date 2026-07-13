// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/schemas/contact';
import { ContactService } from '@/services/prisma';
import { sendContactEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    await ContactService.create({ ...parsed.data, userId: undefined });
    await sendContactEmail(process.env.ADMIN_EMAIL || 'admin@luxeagency.com', parsed.data.subject || 'New Inquiry', parsed.data.name, parsed.data.message);

    return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 201 });
  } catch (e) {
    console.error('[CONTACT_ERROR]', e);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}