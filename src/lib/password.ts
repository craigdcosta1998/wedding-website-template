// ABOUTME: Password verification and HMAC cookie utilities for site-wide password protection

const encoder = new TextEncoder();

async function hmacSha256(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function generatePasswordToken(password: string): Promise<string> {
  return hmacSha256(password, 'site_access');
}

export async function verifyPasswordToken(token: string, password: string): Promise<boolean> {
  const expected = await generatePasswordToken(password);
  if (token.length !== expected.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
