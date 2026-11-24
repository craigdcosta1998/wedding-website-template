// ABOUTME: Dedicated-secret household cookies with signed expiry and database revocation version
import 'server-only';
import { cookies } from 'next/headers';
const COOKIE = 'household_session';
const MAX_AGE = 60 * 60 * 24 * 7;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();
export interface HouseholdSession {
  householdId: string;
  authVersion: string;
  issuedAt: number;
  expiresAt: number;
}
export function hasHouseholdSessionConfig() {
  const secret = process.env.SESSION_SECRET;
  return Boolean(secret && secret.length >= 32 && secret !== process.env.SITE_PASSWORD && secret !== process.env.SUPABASE_SERVICE_ROLE_KEY);
}
async function key() {
  if (!hasHouseholdSessionConfig()) throw new Error('Invitation sessions are not configured');
  return crypto.subtle.importKey('raw', encoder.encode(process.env.SESSION_SECRET!),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
export async function signHouseholdSession(session: HouseholdSession): Promise<string> {
  const data = JSON.stringify(session);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await key(), encoder.encode(data)));
  return JSON.stringify({ data, signature: Array.from(sig, b => b.toString(16).padStart(2, '0')).join('') });
}
export async function verifyHouseholdSession(value: string, now = Date.now()): Promise<HouseholdSession | null> {
  try {
    if (value.length > 2048) return null;
    const { data, signature } = JSON.parse(value);
    if (typeof data !== 'string' || typeof signature !== 'string' || !/^[a-f0-9]{64}$/.test(signature)) return null;
    const bytes = Uint8Array.from(signature.match(/../g)!, b => parseInt(b, 16));
    if (!(await crypto.subtle.verify('HMAC', await key(), bytes, encoder.encode(data)))) return null;
    const session = JSON.parse(data) as HouseholdSession;
    if (!session || typeof session.householdId !== 'string' || !uuid.test(session.householdId) ||
        typeof session.authVersion !== 'string' || !uuid.test(session.authVersion) ||
        !Number.isSafeInteger(session.issuedAt) || !Number.isSafeInteger(session.expiresAt) ||
        session.issuedAt > now || session.expiresAt <= now || session.expiresAt <= session.issuedAt ||
        session.expiresAt - session.issuedAt > MAX_AGE * 1000) return null;
    return session;
  } catch { return null; }
}
export async function getSession(): Promise<HouseholdSession | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  return value ? verifyHouseholdSession(value) : null;
}
export async function setSession(identity: Pick<HouseholdSession, 'householdId' | 'authVersion'>): Promise<void> {
  if (!uuid.test(identity.householdId) || !uuid.test(identity.authVersion)) throw new Error('Invalid invitation identity');
  const now = Date.now();
  const value = await signHouseholdSession({ ...identity, issuedAt: now, expiresAt: now + MAX_AGE * 1000 });
  (await cookies()).set(COOKIE, value, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: MAX_AGE, path: '/',
  });
}
export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
