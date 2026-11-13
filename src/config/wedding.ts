// ABOUTME: Single source of truth for couple names, wedding date, and contact/payment details
//
// Names, date, and city are approved in PROJECT_BRIEF.md.
// Event times, contact/payment details, and sender address remain unconfirmed.
// See DESIGN_DECISIONS.md before treating any remaining logistics as final.
const weddingDate = '2027-09-14';
const weddingDay = new Date(`${weddingDate}T00:00:00Z`);
const nextDay = new Date(weddingDay.getTime() + 24 * 60 * 60 * 1000);
const weddingLocation = { city: 'Florence', country: 'Italy' } as const;

export const WEDDING_CONFIG = {
  coupleNames: 'Talia & Craig',
  coupleFirstNames: {
    partner1: 'Talia',
    partner2: 'Craig',
  },
  weddingDate,
  weddingDateParts: {
    day: weddingDay.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' }),
    monthNumber: weddingDay.toLocaleDateString('en-US', { month: '2-digit', timeZone: 'UTC' }),
    month: weddingDay.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }),
    year: weddingDay.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' }),
  },
  weddingMonthYear: weddingDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
  weddingDateDisplay: {
    de: weddingDay.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
    en: weddingDay.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
  },
  // Date-only calendar hold. DTEND is exclusive; no event time has been approved.
  weddingDateIcs: {
    start: weddingDate.replaceAll('-', ''),
    end: nextDay.toISOString().slice(0, 10).replaceAll('-', ''),
  },
  location: `${weddingLocation.city}, ${weddingLocation.country}`,
  locationDetails: weddingLocation,
  contactEmail: 'your-email@example.com',
  fromEmail: 'wedding@example.com',
  bankDetails: {
    iban: 'DE00 0000 0000 0000 0000 00',
    bic: 'XXXXXXXXXXX',
    accountHolder: 'Your Name',
  },
} as const;
