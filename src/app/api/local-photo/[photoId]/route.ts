// ABOUTME: Serve allowlisted personal photos only to a local development session
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getLocalPhotoFilename, isLoopbackHost } from '@/config/local-photo-preview';
import { hasSiteAccess } from '@/lib/household-access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function notFound() {
  return new NextResponse(null, {
    status: 404,
    headers: { 'Cache-Control': 'private, no-store, max-age=0' },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ photoId: string }> },
) {
  // Keep personal photos out of production and reject non-local hosts before file access.
  if (process.env.NODE_ENV !== 'development' || !isLoopbackHost(request.headers.get('host'))) return notFound();
  if (request.headers.get('sec-fetch-site') !== 'same-origin' || !await hasSiteAccess()) return notFound();

  const { photoId } = await params;
  const filename = getLocalPhotoFilename(photoId);
  if (!filename) return notFound();

  try {
    const file = await readFile(path.join(process.cwd(), 'pictures_to_use', filename));
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(file.byteLength),
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        Vary: 'Cookie, Sec-Fetch-Site',
      },
    });
  } catch {
    return notFound();
  }
}
