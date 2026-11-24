// ABOUTME: Sessions must reject legacy, forged, expired and misconfigured invitation cookies
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('next/headers', () => ({ cookies: async () => ({ get: vi.fn(), set: vi.fn() }) }));
import { signHouseholdSession, verifyHouseholdSession } from './session';
const now = 1_800_000_000_000;
const session = { householdId: '11111111-1111-4111-8111-111111111111',
  authVersion: '22222222-2222-4222-8222-222222222222', issuedAt: now, expiresAt: now + 60_000 };
beforeEach(() => vi.stubEnv('SESSION_SECRET', 'test-only-secret-32-characters-long-enough'));
afterEach(() => vi.unstubAllEnvs());
describe('household invitation sessions', () => {
  it('verifies signed identity without including the invitation code or personal data', async () => {
    expect(await verifyHouseholdSession(await signHouseholdSession(session), now)).toEqual(session);
  });
  it('rejects unsigned legacy cookies and forged signed content', async () => {
    expect(await verifyHouseholdSession(JSON.stringify({ data: session, sig: 'legacy' }), now)).toBeNull();
    const token = await signHouseholdSession(session);
    expect(await verifyHouseholdSession(token.replace(session.householdId, '33333333-3333-4333-8333-333333333333'), now)).toBeNull();
  });
  it('rejects exact expiry, future issuance and excessive lifetime', async () => {
    expect(await verifyHouseholdSession(await signHouseholdSession(session), session.expiresAt)).toBeNull();
    expect(await verifyHouseholdSession(await signHouseholdSession(session), now - 1)).toBeNull();
    expect(await verifyHouseholdSession(await signHouseholdSession({ ...session, expiresAt: now + 8 * 86400_000 }), now)).toBeNull();
  });
  it('fails closed without a dedicated secret even when the shared password exists', async () => {
    const token = await signHouseholdSession(session);
    vi.stubEnv('SESSION_SECRET', ''); vi.stubEnv('SITE_PASSWORD', 'public-shared-password');
    expect(await verifyHouseholdSession(token, now)).toBeNull();
    await expect(signHouseholdSession(session)).rejects.toThrow();
  });
  it('rejects a token after secret rotation and malformed signed identities', async () => {
    expect(await verifyHouseholdSession(await signHouseholdSession({ ...session, authVersion: 'invalid' }), now)).toBeNull();
    const token = await signHouseholdSession(session);
    vi.stubEnv('SESSION_SECRET', 'different-test-only-secret-32-characters-long');
    expect(await verifyHouseholdSession(token, now)).toBeNull();
  });
});
