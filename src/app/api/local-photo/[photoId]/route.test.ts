// ABOUTME: Prove the local photo route refuses production, remote, and unauthenticated requests
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ readFile: vi.fn(), hasSiteAccess: vi.fn() }));
vi.mock('node:fs/promises', () => ({ default: { readFile: mocks.readFile }, readFile: mocks.readFile }));
vi.mock('@/lib/household-access', () => ({ hasSiteAccess: mocks.hasSiteAccess }));

import { GET } from './route';

const params = { params: Promise.resolve({ photoId: 'portrait-01' }) };
const request = (host = 'localhost:3000', fetchSite = 'same-origin') => new Request('http://localhost:3000/api/local-photo/portrait-01', {
  headers: { host, 'sec-fetch-site': fetchSite },
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('local photo route', () => {
  it('returns 404 in production before reading any file', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const response = await GET(request(), params);
    expect(response.status).toBe(404);
    expect(mocks.readFile).not.toHaveBeenCalled();
  });

  it('rejects non-loopback hosts and cross-origin image requests before file access', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect((await GET(request('192.168.1.20:3000'), params)).status).toBe(404);
    expect((await GET(request('localhost:3000', 'cross-site'), params)).status).toBe(404);
    expect(mocks.hasSiteAccess).not.toHaveBeenCalled();
    expect(mocks.readFile).not.toHaveBeenCalled();
  });

  it('requires configured site access and reads only the mapped image', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    mocks.hasSiteAccess.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    mocks.readFile.mockResolvedValue(Buffer.from('jpeg bytes'));
    expect((await GET(request(), params)).status).toBe(404);
    const response = await GET(request(), params);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(mocks.readFile).toHaveBeenCalledWith(expect.stringMatching(/pictures_to_use[\\/]20260521_0062_phosart\.photography\.jpg$/));
  });

  it('does not read files for unknown identifiers', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    mocks.hasSiteAccess.mockResolvedValue(true);
    const response = await GET(request(), { params: Promise.resolve({ photoId: '../.env.local' }) });
    expect(response.status).toBe(404);
    expect(mocks.readFile).not.toHaveBeenCalled();
  });
});
