// ABOUTME: Tests for password verification and HMAC token utilities
import { describe, it, expect } from 'vitest';
import { generatePasswordToken, verifyPasswordToken } from './password';

describe('generatePasswordToken', () => {
  it('produces a consistent hex string for a given password', async () => {
    const token = await generatePasswordToken('my-secret');
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(await generatePasswordToken('my-secret')).toBe(token);
  });

  it('produces different tokens for different passwords', async () => {
    const a = await generatePasswordToken('password-a');
    const b = await generatePasswordToken('password-b');
    expect(a).not.toBe(b);
  });
});

describe('verifyPasswordToken', () => {
  it('returns true for a valid token', async () => {
    const token = await generatePasswordToken('wedding2026');
    expect(await verifyPasswordToken(token, 'wedding2026')).toBe(true);
  });

  it('returns false for an invalid token', async () => {
    expect(await verifyPasswordToken('invalid', 'wedding2026')).toBe(false);
  });

  it('returns false when password changes', async () => {
    const token = await generatePasswordToken('old-password');
    expect(await verifyPasswordToken(token, 'new-password')).toBe(false);
  });

  it('returns false for empty token', async () => {
    expect(await verifyPasswordToken('', 'wedding2026')).toBe(false);
  });
});
