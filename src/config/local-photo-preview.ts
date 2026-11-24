// ABOUTME: Fixed local-only photo identifiers; source files never enter public assets

export const LOCAL_PHOTO_PREVIEW = [
  { id: 'portrait-01', file: '20260521_0062_phosart.photography.jpg' },
  { id: 'portrait-02', file: 'IMG_2124.JPG' },
  { id: 'portrait-03', file: 'IMG_2125.JPG' },
  { id: 'portrait-04', file: 'IMG_2126.JPG' },
  { id: 'portrait-05', file: 'IMG_2130.JPG' },
] as const;

const photoById = new Map<string, string>(LOCAL_PHOTO_PREVIEW.map((photo) => [photo.id, photo.file]));

export function getLocalPhotoFilename(id: string) {
  return photoById.get(id) ?? null;
}

export function isLoopbackHost(host: string | null) {
  return Boolean(host && /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(host));
}
