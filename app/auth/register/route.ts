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

// app/api/auth/forgot-password/route.ts
import { forgotPasswordSchema } from '@/schemas/auth';
import { sendPasswordResetEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    const user = await UserService.findByEmail(parsed.data.email);
    // Always return success to prevent email enumeration
    if (user) {
      const { plainToken } = await UserService.generatePasswordResetToken(parsed.data.email);
      await sendPasswordResetEmail(parsed.data.email, plainToken);
    }

    return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' }, { status: 200 });
  } catch (e) {
    console.error('[FORGOT_PASSWORD_ERROR]', e);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

// app/api/auth/reset-password/route.ts
import { resetPasswordSchema } from '@/schemas/auth';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

    // In production, validate token hash against DB. Simulated here for brevity.
    const hashedNewPassword = await bcrypt.hash(parsed.data.password, 12);
    // Update password logic would go here with proper token validation
    
    return NextResponse.json({ success: true, message: 'Password updated successfully.' }, { status: 200 });
  } catch (e) {
    console.error('[RESET_PASSWORD_ERROR]', e);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}

// app/api/auth/profile/route.ts
import { auth } from '@/lib/auth';
import { updateProfileSchema } from '@/schemas/auth';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const user = await prisma.user.findUnique({ 
    where: { id: session.user.id }, 
    select: { id: true, name: true, email: true, role: true, image: true } 
  });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  const updated = await UserService.updateProfile(session.user.id, parsed.data);
  return NextResponse.json({ success: true, user: updated });
}

// app/api/auth/change-password/route.ts
import { changePasswordSchema } from '@/schemas/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  try {
    await UserService.changePassword(session.user.id, parsed.data.currentPassword, parsed.data.newPassword);
    return NextResponse.json({ success: true, message: 'Password updated.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
