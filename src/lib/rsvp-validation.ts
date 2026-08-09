// ABOUTME: Validation logic for open RSVP form submissions
import type { DietaryPreference } from '@/types/database';

export interface OpenRsvpGuest {
  firstName: string;
  lastName: string;
  selectedEventIds: string[];
  dietaryPreference: DietaryPreference;
  dietaryOther: string;
}

export interface OpenRsvpData {
  contactName: string;
  contactEmail: string;
  guests: OpenRsvpGuest[];
}

const MAX_CONTACT_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 100;
const MAX_DIETARY_LENGTH = 500;
const MAX_GUESTS = 20;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRsvpSubmission(data: OpenRsvpData): { valid: boolean; error?: string } {
  if (!data.contactName.trim()) return { valid: false, error: 'Contact name is required' };
  if (data.contactName.trim().length > MAX_CONTACT_NAME_LENGTH) return { valid: false, error: 'Contact name is too long' };
  if (!data.contactEmail.trim()) return { valid: false, error: 'Contact email is required' };
  if (data.contactEmail.trim().length > MAX_EMAIL_LENGTH) return { valid: false, error: 'Email address is too long' };
  if (!EMAIL_REGEX.test(data.contactEmail.trim())) return { valid: false, error: 'Invalid email address' };
  if (data.guests.length === 0) return { valid: false, error: 'At least one guest is required' };
  if (data.guests.length > MAX_GUESTS) return { valid: false, error: `Maximum ${MAX_GUESTS} guests per submission` };

  for (const guest of data.guests) {
    if (!guest.firstName.trim()) return { valid: false, error: 'Guest first name is required' };
    if (guest.firstName.trim().length > MAX_NAME_LENGTH) return { valid: false, error: 'Guest first name is too long' };
    if (!guest.lastName.trim()) return { valid: false, error: 'Guest last name is required' };
    if (guest.lastName.trim().length > MAX_NAME_LENGTH) return { valid: false, error: 'Guest last name is too long' };
    if (guest.selectedEventIds.length > 0 && guest.dietaryPreference === 'other' && !guest.dietaryOther.trim()) {
      return { valid: false, error: 'Please specify your dietary requirements' };
    }
    if (guest.dietaryOther && guest.dietaryOther.trim().length > MAX_DIETARY_LENGTH) {
      return { valid: false, error: 'Dietary requirements text is too long' };
    }
  }

  return { valid: true };
}
