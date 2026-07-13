// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/schemas/auth';
import { UserService } from '@/services/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const existing = await UserService.findByEmail(parsed.data.email);
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    await UserService.register(parsed.data.name, parsed.data.email, parsed.data.password);
    return NextResponse.json({ success: true, message: 'Registration successful. Please login.' }, { status: 201 });
  } catch (e) {
    console.error('[REGISTER_ERROR]', e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

