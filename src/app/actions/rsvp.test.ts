// ABOUTME: Tests for open RSVP submission data validation
import { describe, it, expect } from 'vitest';
import { validateRsvpSubmission, type OpenRsvpData } from '@/lib/rsvp-validation';

describe('validateRsvpSubmission', () => {
  const validData: OpenRsvpData = {
    contactName: 'Anna Schmidt',
    contactEmail: 'anna@example.com',
    guests: [
      {
        firstName: 'Anna',
        lastName: 'Schmidt',
        selectedEventIds: ['event-1'],
        dietaryPreference: 'none',
        dietaryOther: '',
      },
    ],
  };

  it('passes for valid data', () => {
    expect(validateRsvpSubmission(validData)).toEqual({ valid: true });
  });

  it('fails when contact name is empty', () => {
    const data = { ...validData, contactName: '' };
    expect(validateRsvpSubmission(data).valid).toBe(false);
  });

  it('fails when contact email is empty', () => {
    const data = { ...validData, contactEmail: '' };
    expect(validateRsvpSubmission(data).valid).toBe(false);
  });

  it('fails when there are no guests', () => {
    const data = { ...validData, guests: [] };
    expect(validateRsvpSubmission(data).valid).toBe(false);
  });

  it('fails when a guest has no first name', () => {
    const data = {
      ...validData,
      guests: [{ ...validData.guests[0]!, firstName: '' }],
    };
    expect(validateRsvpSubmission(data).valid).toBe(false);
  });

  it('fails when a guest has no last name', () => {
    const data = {
      ...validData,
      guests: [{ ...validData.guests[0]!, lastName: '' }],
    };
    expect(validateRsvpSubmission(data).valid).toBe(false);
  });

  it('fails when attending guest selects other dietary but leaves it empty', () => {
    const data = {
      ...validData,
      guests: [{ ...validData.guests[0]!, dietaryPreference: 'other' as const, dietaryOther: '' }],
    };
    expect(validateRsvpSubmission(data).valid).toBe(false);
  });

  it('passes when declined guest has no events selected', () => {
    const data = {
      ...validData,
      guests: [{ ...validData.guests[0]!, selectedEventIds: [] }],
    };
    expect(validateRsvpSubmission(data).valid).toBe(true);
  });

  it.each([null, undefined, [], {}, { contactName: 1, contactEmail: false, guests: [] }])('rejects malformed payloads safely: %s', data => {
    expect(validateRsvpSubmission(data).valid).toBe(false);
  });

  it.each([
    { selectedEventIds: ['event-1', 'event-1'] },
    { selectedEventIds: [null] },
    { selectedEventIds: [''] },
    { selectedEventIds: ['1', '2', '3', '4', '5'] },
    { dietaryPreference: 'unsupported' },
    { firstName: null },
    { dietaryOther: null },
  ])('rejects invalid guest fields: %s', fields => {
    expect(validateRsvpSubmission({ ...validData, guests: [{ ...validData.guests[0], ...fields }] }).valid).toBe(false);
  });
});
