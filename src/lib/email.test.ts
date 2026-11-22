// ABOUTME: Optional confirmation email must remain importable and safe without provider credentials
import { afterEach, expect, it, vi } from 'vitest';

// Keep the real provider constructor; the template renderer is unrelated to optional-key handling.
vi.mock('@/emails/rsvp-confirmation', () => ({ RsvpConfirmationEmail: () => null }));

afterEach(() => vi.unstubAllEnvs());

it('imports and skips email delivery when no Resend key is configured', async () => {
  vi.stubEnv('RESEND_API_KEY', '');
  const { sendRsvpConfirmation } = await import('./email');
  expect(await sendRsvpConfirmation({
    to: 'test@example.com', householdName: 'Test guest', guests: [], locale: 'en',
  })).toEqual({ success: true, data: null });
});
