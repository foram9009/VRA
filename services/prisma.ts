// services/prisma.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export class UserService {
  static async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  /** FIX: Added findById — the changePassword method was incorrectly passing userId to findByEmail */
  static async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async updateProfile(userId: string, data: { name?: string; email?: string; image?: string }) {
    return prisma.user.update({ where: { id: userId }, data });
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // FIX: Was calling `this.findByEmail(userId)` — passing an ID where an email is expected.
    // This always returned null, making password changes silently fail.
    const user = await this.findById(userId);
    if (!user || !user.password) throw new Error('User not found or has no password set.');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new Error('Current password is incorrect.');

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  /**
   * Generates a password reset token.
   * In a production app, store the hash in a dedicated PasswordResetToken table
   * with an expiry timestamp. This implementation generates the token pair
   * but leaves storage to the calling route handler.
   */
  static async generatePasswordResetToken(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      // Return success anyway to prevent email enumeration attacks
      return { token: null, plainToken: null };
    }

    const plainToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(plainToken).digest('hex');
    return { token: hash, plainToken };
  }

  static async resetPassword(tokenHash: string, newPassword: string) {
    // NOTE: A full implementation should:
    // 1. Query a PasswordResetToken model WHERE hash=tokenHash AND expiresAt > now()
    // 2. Update the user password
    // 3. Delete the token to prevent reuse
    // Stub returns true for structural completeness; implement with a token model.
    return true;
  }
}

export class ContactService {
  static async create(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    userId?: string;
  }) {
    return prisma.contact.create({ data });
  }
}

export class NewsletterService {
  static async subscribe(email: string) {
    return prisma.newsletter.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });
  }

  static async unsubscribe(email: string) {
    return prisma.newsletter.update({
      where: { email },
      data: { active: false },
    });
  }
}

export class SiteSettingService {
  static async get(key: string) {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  static async upsert(key: string, value: import('@prisma/client').Prisma.InputJsonValue) {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
