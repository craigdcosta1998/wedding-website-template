// ABOUTME: Single source of truth for couple names, wedding date, and contact/payment details
//
// Start here. Every value below is a placeholder — replace them with your own and most of the
// site (page titles, the RSVP calendar download, confirmation emails, the gift page) updates
// automatically. See README.md's "Make it yours" section for what else to touch.
export const WEDDING_CONFIG = {
  coupleNames: 'Partner One & Partner Two',
  coupleFirstNames: {
    partner1: 'Partner One',
    partner2: 'Partner Two',
  },
  weddingMonthYear: 'Month Year',
  weddingDateDisplay: {
    de: 'TT. Monat JJJJ',
    en: 'Month Day, Year',
  },
  // Floating local-time values (no timezone suffix) for the .ics calendar download
  weddingDateIcs: {
    start: '20260101T190000',
    end: '20260102T050000',
  },
  location: 'City, Country',
  contactEmail: 'your-email@example.com',
  fromEmail: 'wedding@example.com',
  bankDetails: {
    iban: 'DE00 0000 0000 0000 0000 00',
    bic: 'XXXXXXXXXXX',
    accountHolder: 'Your Name',
  },
} as const;
