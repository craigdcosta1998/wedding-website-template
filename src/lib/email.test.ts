// ABOUTME: Optional confirmation email must remain importable and safe without provider credentials
import { afterEach, expect, it, vi } from 'vitest';

// The email template is unrelated to the provider configuration guard.
vi.mock('@/emails/rsvp-confirmation', () => ({ RsvpConfirmationEmail: () => null }));

const send = vi.fn();
vi.mock('resend', () => ({ Resend: vi.fn(function () { return { emails: { send } }; }) }));

afterEach(() => {
  vi.unstubAllEnvs();
  send.mockReset();
});

it('imports and skips email delivery when no Resend key is configured', async () => {
  vi.stubEnv('RESEND_API_KEY', '');
  const { sendRsvpConfirmation } = await import('./email');
  expect(await sendRsvpConfirmation({
    to: 'test@example.com', householdName: 'Test guest', guests: [], locale: 'en',
  })).toEqual({ success: true, data: null });
});

it('does not call the email provider when the sender address is missing', async () => {
  vi.stubEnv('RESEND_API_KEY', 'test-key');
  vi.stubEnv('RESEND_FROM_EMAIL', '');
  const { sendRsvpConfirmation } = await import('./email');
  const result = await sendRsvpConfirmation({
    to: 'test@example.com', householdName: 'Test guest', guests: [], locale: 'en',
  });
  expect(result.success).toBe(false);
  expect(send).not.toHaveBeenCalled();
});
