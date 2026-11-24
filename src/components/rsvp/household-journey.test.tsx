// ABOUTME: Exercise two independent member replies, explicit validation, preview isolation and failure recovery
import { fireEvent, render, screen, within, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { HouseholdRsvpData } from '@/types/household-rsvp';
const mocks = vi.hoisted(() => ({ submit: vi.fn(), auth: vi.fn(), logout: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: mocks.refresh }) }));
vi.mock('@/app/actions/household-rsvp', () => ({ submitHouseholdRsvp: mocks.submit }));
vi.mock('@/app/actions/auth', () => ({ authenticateWithCode: mocks.auth, logout: mocks.logout }));
vi.mock('@/i18n/routing', () => ({ Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));
import { HouseholdJourney, HouseholdReplyForm } from './household-journey';
const data: HouseholdRsvpData = { id: 'demo-household', name: 'Example household',
  members: [{ id: 'a', name: 'Alex Example' }, { id: 's', name: 'Sam Example' }],
  events: [{ id: 'w', name_en: 'The wedding', event_date: '2027-09-14', location_name: 'Approved venue' }],
  reply: { guests: [{ id: 'a', dietaryRequirements: '', answers: [{ eventId: 'w', status: null }] },
    { id: 's', dietaryRequirements: '', answers: [{ eventId: 'w', status: null }] }] } };
beforeEach(() => { vi.clearAllMocks(); mocks.submit.mockResolvedValue({ success: true }); });
afterEach(cleanup);
it('does not silently decline unanswered choices and focuses a clear error', async () => {
  render(<HouseholdReplyForm data={data} preview={false} />);
  fireEvent.submit(screen.getByRole('button', { name: 'Save household responses' }).closest('form')!);
  expect(await screen.findByRole('alert')).toHaveTextContent('Please answer every celebration');
  expect(mocks.submit).not.toHaveBeenCalled();
});
it('keeps two people independent and simulates preview without any real action or email claim', async () => {
  const user = userEvent.setup(); render(<HouseholdJourney initialData={null} previewData={data} ready />);
  await user.type(screen.getByLabelText('Household invitation code'), 'DEMO01');
  await user.click(screen.getByRole('button', { name: 'Open invitation' }));
  const alex = screen.getByRole('region', { name: 'Alex Example' });
  const sam = screen.getByRole('region', { name: 'Sam Example' });
  await user.click(within(alex).getByLabelText('Attending'));
  expect(within(sam).getByLabelText('Attending')).not.toBeChecked();
  await user.click(within(sam).getByLabelText('Unable to attend'));
  await user.type(within(alex).getByRole('textbox'), 'Peanut allergy');
  await user.click(screen.getByRole('button', { name: 'Preview household reply' }));
  expect(await screen.findByText('Preview complete.')).toBeVisible();
  expect(screen.getByText('Nothing was submitted or emailed. These are fictional responses.')).toBeVisible();
  expect(mocks.auth).not.toHaveBeenCalled(); expect(mocks.submit).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Change invitation' }));
  expect(screen.getByLabelText('Household invitation code')).toBeVisible();
  expect(mocks.logout).not.toHaveBeenCalled();
});
it('preserves choices after a real action fails and can retry successfully', async () => {
  const saved = structuredClone(data); saved.reply.guests[0]!.answers[0]!.status = 'accepted'; saved.reply.guests[1]!.answers[0]!.status = 'declined';
  mocks.submit.mockResolvedValueOnce({ success: false, error: 'Try again' });
  const user = userEvent.setup(); render(<HouseholdReplyForm data={saved} preview={false} />);
  await user.click(screen.getByRole('button', { name: 'Save household responses' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Try again');
  expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(2);
  await user.click(screen.getByRole('button', { name: 'Save household responses' }));
  expect(await screen.findByText('Thank you for replying.')).toBeVisible();
  expect(mocks.submit).toHaveBeenCalledTimes(2);
});
it('invalid code errors do not disclose members or remove the code field', async () => {
  mocks.auth.mockResolvedValue({ success: false, error: 'Invalid code' });
  const user = userEvent.setup(); render(<HouseholdJourney initialData={null} previewData={null} ready />);
  await user.type(screen.getByLabelText('Household invitation code'), 'BAD123');
  await user.click(screen.getByRole('button', { name: 'Open invitation' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid code');
  expect(screen.queryByText('Alex Example')).not.toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Open invitation' })).toBeEnabled());
});
