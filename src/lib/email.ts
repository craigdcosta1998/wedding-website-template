// ABOUTME: Email utility for sending RSVP confirmations via Resend
import { Resend } from 'resend';
import { RsvpConfirmationEmail } from '@/emails/rsvp-confirmation';
import { WEDDING_CONFIG } from '@/config/wedding';

interface SendRsvpConfirmationParams {
  to: string;
  householdName: string;
  guests: Array<{
    name: string;
    status: 'accepted' | 'declined';
    mealChoice?: string | null;
    dietaryRestrictions?: string | null;
    eventNames?: string[];
  }>;
  locale: 'de' | 'en';
}

export async function sendRsvpConfirmation({
  to,
  householdName,
  guests,
  locale,
}: SendRsvpConfirmationParams) {
  if (!process.env.RESEND_API_KEY) {
    return { success: true, data: null };
  }

  const subject = locale === 'de'
    ? `RSVP Bestätigung - Hochzeit ${WEDDING_CONFIG.coupleNames}`
    : `RSVP Confirmation - ${WEDDING_CONFIG.coupleNames} Wedding`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `${WEDDING_CONFIG.coupleNames} <${WEDDING_CONFIG.fromEmail}>`,
      to: [to],
      subject,
      react: RsvpConfirmationEmail({ householdName, guests, locale }),
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
