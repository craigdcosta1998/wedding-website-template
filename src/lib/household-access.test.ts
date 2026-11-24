// ABOUTME: Verify fresh household membership, session revocation and independent invitations
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ session: vi.fn(), config: vi.fn(), from: vi.fn(), create: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock('@/lib/session', () => ({ getSession: mocks.session, hasHouseholdSessionConfig: () => true }));
vi.mock('@/lib/supabase/server', () => ({ hasSupabaseServiceConfig: mocks.config, createServiceClient: mocks.create }));
import { getVerifiedHousehold } from './household-access';
let versionMatches = true;
let granted: string[] = [];
let brokenTable = '';
beforeEach(() => {
  vi.clearAllMocks(); vi.stubEnv('SITE_PASSWORD', '');
  versionMatches = true; granted = []; brokenTable = '';
  mocks.config.mockReturnValue(true);
  mocks.session.mockResolvedValue({ householdId: 'h1', authVersion: 'version1' });
  mocks.create.mockResolvedValue({ from: mocks.from });
  mocks.from.mockImplementation((table: string) => {
    let currentVersion = '';
    const data = () => {
      if (table === 'households') return versionMatches && currentVersion === 'version1' ? { id: 'h1', auth_version: 'version1', primary_contact_name: 'Fictional household' } : null;
      if (table === 'guests') return [{ id: 'g1', first_name: 'Example', last_name: 'Guest' }];
      if (table === 'household_event_invitations') return granted.map(event_id => ({ event_id }));
      return ['welcome-party', 'wedding', 'roce', 'pool-party'].map(key => ({ celebration_key: key, event_id: key + '-id' }));
    };
    const result = () => ({ data: table === brokenTable ? null : data(), error: table === brokenTable ? new Error('Missing migration') : null });
    const query = { select: () => query, eq: (key: string, value: string) => { if (key === 'auth_version') currentVersion = value; return query; },
      order: () => query, maybeSingle: async () => result(), then: (resolve: (value: unknown) => unknown) => Promise.resolve(result()).then(resolve) };
    return query;
  });
});
describe('verified household access', () => {
  it('does not query without a session or service configuration', async () => {
    mocks.session.mockResolvedValue(null);
    expect(await getVerifiedHousehold()).toBeNull();
    expect(mocks.create).not.toHaveBeenCalled();
    mocks.config.mockReturnValue(false);
    expect(await getVerifiedHousehold()).toBeNull();
  });
  it('rejects a rotated or removed household before loading any member data', async () => {
    versionMatches = false;
    expect(await getVerifiedHousehold()).toBeNull();
    expect(mocks.from).toHaveBeenCalledTimes(1);
  });
  it('loads private grants independently, and removes them on the very next request after revocation', async () => {
    granted = ['roce-id'];
    expect((await getVerifiedHousehold())?.celebrations.map(e => e.key)).toEqual(['roce', 'welcome-party', 'wedding']);
    granted = ['pool-party-id'];
    expect((await getVerifiedHousehold())?.celebrations.map(e => e.key)).toEqual(['welcome-party', 'wedding', 'pool-party']);
    granted = [];
    expect((await getVerifiedHousehold())?.celebrations.map(e => e.key)).toEqual(['welcome-party', 'wedding']);
  });
  it.each(['household_event_invitations', 'celebration_event_links', 'guests'])('fails closed if %s is unavailable', async table => {
    brokenTable = table;
    expect(await getVerifiedHousehold()).toBeNull();
  });
});
