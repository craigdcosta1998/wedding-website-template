// ABOUTME: Session management for household authentication using HMAC-signed cookies
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'household_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();

export interface HouseholdSession {
  householdId: string;
  householdCode: string;
  primaryContactName: string;
}

interface SignedSession {
  data: HouseholdSession;
  sig: string;
}

async function getSigningKey(): Promise<string> {
  return process.env.SITE_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-session-key';
}

async function hmacSign(data: string): Promise<string> {
  const key = await getSigningKey();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacVerify(data: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(data);
  if (signature.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function getSession(): Promise<HouseholdSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const parsed = JSON.parse(sessionCookie.value) as SignedSession;
    if (!parsed.data || !parsed.sig) {
      // Legacy unsigned cookie — reject it
      return null;
    }
    const dataStr = JSON.stringify(parsed.data);
    const valid = await hmacVerify(dataStr, parsed.sig);
    if (!valid) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export async function setSession(session: HouseholdSession): Promise<void> {
  const dataStr = JSON.stringify(session);
  const sig = await hmacSign(dataStr);
  const signed: SignedSession = { data: session, sig };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(signed), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
