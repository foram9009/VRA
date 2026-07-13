// lib/resend.ts
import { Resend, type CreateEmailOptions } from 'resend';

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Escapes HTML special characters to prevent XSS when embedding
 * user-supplied content into HTML email bodies.
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

async function sendEmail(payload: CreateEmailOptions) {
  const client = getResendClient();
  if (!client) {
    console.warn('[Resend] RESEND_API_KEY is not set — email not sent.');
    return { data: null, error: null };
  }
  return client.emails.send(payload);
}

export async function sendContactEmail(
  to: string,
  subject: string,
  name: string,
  message: string
) {
  // Escape all user-supplied input before injecting into HTML
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  return sendEmail({
    from: process.env.EMAIL_FROM || 'noreply@luxeagency.com',
    to,
    subject: escapeHtml(subject),
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${escapeHtml(to)}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  });
}

export async function sendNewsletterConfirmation(email: string) {
  return sendEmail({
    from: process.env.EMAIL_FROM || 'noreply@luxeagency.com',
    to: email,
    subject: 'Welcome to the Luxe Newsletter',
    html: `<h2>You're subscribed!</h2><p>Thank you for joining the Luxe Digital newsletter. Expect exclusive insights and creative updates.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail({
    from: process.env.EMAIL_FROM || 'noreply@luxeagency.com',
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="background:#D6B16D;color:#070707;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;">
        Reset Password
      </a>
      <p style="margin-top:16px;font-size:12px;color:#888;">If you did not request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendNewUserCredentials(email: string, tempPassword: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/login`;
  return sendEmail({
    from: process.env.EMAIL_FROM || 'noreply@luxeagency.com',
    to: email,
    subject: 'Your Luxe Agency Account',
    html: `
      <h2>Welcome to Luxe Agency</h2>
      <p>Your account has been created. Use the credentials below to log in and change your password immediately.</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Temporary Password:</strong> ${escapeHtml(tempPassword)}</p>
      <a href="${loginUrl}" style="background:#D6B16D;color:#070707;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;">
        Log In
      </a>
    `,
  });
}
