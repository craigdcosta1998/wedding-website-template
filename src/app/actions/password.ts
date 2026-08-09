// ABOUTME: Server action for verifying site password and setting access cookie with rate limiting
'use server';

import { cookies, headers } from 'next/headers';
import { generatePasswordToken } from '@/lib/password';
import { checkRateLimit } from '@/lib/rate-limit';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const PASSWORD_RATE_LIMIT = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }; // 5 attempts per 15 minutes

export interface PasswordResult {
  success: boolean;
  error?: string;
}

export async function verifyPassword(password: string): Promise<PasswordResult> {
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(`password-action:${ip}`, PASSWORD_RATE_LIMIT);

  if (!rateCheck.allowed) {
    return { success: false, error: 'Too many attempts. Please try again later.' };
  }

  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return { success: true };
  }

  if (!password || password !== sitePassword) {
    return { success: false, error: 'Invalid password' };
  }

  const token = await generatePasswordToken(sitePassword);
  const cookieStore = await cookies();

  cookieStore.set('site_access', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return { success: true };
}
