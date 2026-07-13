// lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(to: string, subject: string, name: string, message: string) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@luxeagency.com',
    to,
    subject,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${to}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  });
}

export async function sendNewsletterConfirmation(email: string) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@luxeagency.com',
    to: email,
    subject: 'Welcome to the Luxe Newsletter',
    html: `<h2>You're subscribed!</h2><p>Thank you for joining the Luxe Digital newsletter. Expect exclusive insights and creative updates.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  return resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@luxeagency.com',
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="background:#D6B16D;color:#070707;padding:10px 20px;text-decoration:none;border-radius:4px;">Reset Password</a>
    `,
  });
}
