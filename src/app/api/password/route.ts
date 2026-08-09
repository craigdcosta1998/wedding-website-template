// ABOUTME: API route for password verification — sets site_access cookie via Set-Cookie header
import { NextRequest, NextResponse } from 'next/server';
import { generatePasswordToken } from '@/lib/password';
import { checkRateLimit } from '@/lib/rate-limit';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const PASSWORD_RATE_LIMIT = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }; // 5 attempts per 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(`password:${ip}`, PASSWORD_RATE_LIMIT);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return NextResponse.json({ success: true });
  }

  if (!password || password !== sitePassword) {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  }

  const token = await generatePasswordToken(sitePassword);
  const response = NextResponse.json({ success: true });

  response.cookies.set('site_access', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}
