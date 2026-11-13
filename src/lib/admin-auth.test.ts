// ABOUTME: Regression tests for admin authorization at every privileged page and seating action
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  createClient: vi.fn(),
  createServiceClient: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: mocks.createClient,
  createServiceClient: mocks.createServiceClient,
}));
vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); },
}));
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));
// Invoke the real page functions, without mounting their interactive children.
vi.mock('@/components/admin/household-list', () => ({ HouseholdList: () => null }));
vi.mock('@/components/admin/logout-button', () => ({ LogoutButton: () => null }));
vi.mock('@/components/admin/seating/seating-board', () => ({ SeatingBoard: () => null }));
vi.mock('@/i18n/routing', () => ({ Link: () => null }));

import { requireAdmin } from './admin-auth';
import AdminPage from '@/app/[locale]/admin/page';
import SeatingPage from '@/app/[locale]/admin/seating/page';
import * as seating from '@/app/actions/seating';

const ADMIN_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_ID = '22222222-2222-4222-8222-222222222222';
const admin = { id: ADMIN_ID };
const forbidden = 'NEXT_HTTP_ERROR_FALLBACK;404';

// The type ensures every exported seating action has an explicit invocation in this suite.
const actionCalls = {
  createTable: () => seating.createTable('Table', 0),
  renameTable: () => seating.renameTable('table-id', 'New name'),
  updateTableNote: () => seating.updateTableNote('table-id', 'Note'),
  deleteTable: () => seating.deleteTable('table-id'),
  addSeat: () => seating.addSeat('table-id'),
  removeSeat: () => seating.removeSeat('table-id'),
  placeGuest: () => seating.placeGuest('guest-id', 'seat-id'),
  placeGuestInTable: () => seating.placeGuestInTable('guest-id', 'table-id'),
  unseatGuest: () => seating.unseatGuest('guest-id'),
  setSeatPreference: () => seating.setSeatPreference('guest-id', 'other-guest-id'),
} satisfies Record<keyof typeof seating, () => Promise<seating.SeatingActionResult>>;

const pages = [
  { name: 'dashboard', render: AdminPage },
  { name: 'seating', render: SeatingPage },
];

const deniedCallers = [
  {
    name: 'unauthenticated caller',
    setup: () => mocks.getUser.mockResolvedValue({ data: { user: null }, error: null }),
  },
  {
    name: 'non-admin with admin-looking user metadata',
    setup: () => mocks.getUser.mockResolvedValue({
      data: { user: { id: OTHER_ID, user_metadata: { role: 'admin', is_admin: true } } },
      error: null,
    }),
  },
  {
    name: 'missing allowlist',
    setup: () => vi.stubEnv('ADMIN_USER_IDS', undefined),
  },
  {
    name: 'empty allowlist',
    setup: () => vi.stubEnv('ADMIN_USER_IDS', ' , , '),
  },
  {
    name: 'partial ID match',
    setup: () => vi.stubEnv('ADMIN_USER_IDS', `${ADMIN_ID}-suffix`),
  },
  {
    name: 'Auth error even if a user is returned',
    setup: () => mocks.getUser.mockResolvedValue({ data: { user: admin }, error: new Error('Invalid session') }),
  },
  {
    name: 'Auth service failure',
    setup: () => mocks.getUser.mockRejectedValue(new Error('Auth unavailable')),
  },
];

function queryReturning(data: unknown) {
  const query = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'table-id' }, error: null }),
    then: <T, U>(
      resolve: (value: { data: unknown; error: null }) => T,
      reject: (reason: unknown) => U,
    ) => Promise.resolve({ data, error: null }).then(resolve, reject),
  };
  return query;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('ADMIN_USER_IDS', ADMIN_ID);
  mocks.getUser.mockResolvedValue({ data: { user: admin }, error: null });
  mocks.createClient.mockResolvedValue({ auth: { getUser: mocks.getUser } });
  mocks.from.mockReturnValue(queryReturning([]));
  mocks.rpc.mockResolvedValue({ data: 'seat-id', error: null });
  mocks.createServiceClient.mockResolvedValue({ from: mocks.from, rpc: mocks.rpc });
});

afterEach(() => vi.unstubAllEnvs());

function expectNoPrivilegedAccess() {
  expect(mocks.createServiceClient).not.toHaveBeenCalled();
  expect(mocks.from).not.toHaveBeenCalled();
  expect(mocks.rpc).not.toHaveBeenCalled();
}

describe('requireAdmin', () => {
  it('accepts a verified user explicitly listed among multiple admin IDs', async () => {
    vi.stubEnv('ADMIN_USER_IDS', ` ${OTHER_ID}, , ${ADMIN_ID} `);
    await expect(requireAdmin()).resolves.toEqual(admin);
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expectNoPrivilegedAccess();
  });

  it.each(deniedCallers)('rejects $name', async ({ setup }) => {
    setup();
    await expect(requireAdmin()).rejects.toThrow();
    expectNoPrivilegedAccess();
  });
});

describe.each(pages)('$name admin data page', ({ render }) => {
  it.each(deniedCallers)('blocks $name before privileged access', async ({ setup }) => {
    setup();
    await expect(render({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow();
    expectNoPrivilegedAccess();
  });

  it('returns 404 for an authenticated non-admin', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: OTHER_ID } }, error: null });
    await expect(render({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow(forbidden);
    expectNoPrivilegedAccess();
  });

  it('allows an explicitly authorized admin to load page data', async () => {
    const result = await render({ params: Promise.resolve({ locale: 'en' }) });
    expect(result).toBeTruthy();
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.createServiceClient).toHaveBeenCalledOnce();
    expect(mocks.from).toHaveBeenCalledTimes(3);
    expect(mocks.getUser.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.createServiceClient.mock.invocationCallOrder[0]!,
    );
  });
});

describe.each(Object.entries(actionCalls))('seating action %s', (_name, invoke) => {
  it.each(deniedCallers)('blocks $name before privileged access', async ({ setup }) => {
    setup();
    await expect(invoke()).resolves.toMatchObject({ success: false, error: expect.any(String) });
    expectNoPrivilegedAccess();
  });

  it('preserves the successful action for an explicitly authorized admin', async () => {
    mocks.from.mockReturnValue(queryReturning([{ id: 'seat-id', seat_index: 0 }]));
    await expect(invoke()).resolves.toMatchObject({ success: true });
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.createServiceClient).toHaveBeenCalledOnce();
    expect(mocks.from.mock.calls.length + mocks.rpc.mock.calls.length).toBeGreaterThan(0);
    expect(mocks.getUser.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.createServiceClient.mock.invocationCallOrder[0]!,
    );
  });
});
