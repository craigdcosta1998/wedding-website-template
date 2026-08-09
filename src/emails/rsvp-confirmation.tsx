// ABOUTME: Bilingual RSVP confirmation email template using React Email
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { WEDDING_CONFIG } from '@/config/wedding';

interface Guest {
  name: string;
  status: 'accepted' | 'declined';
  mealChoice?: string | null;
  dietaryRestrictions?: string | null;
  eventNames?: string[];
}

interface RsvpConfirmationEmailProps {
  householdName: string;
  guests: Guest[];
  locale: 'de' | 'en';
}

export function RsvpConfirmationEmail({
  householdName,
  guests,
  locale,
}: RsvpConfirmationEmailProps) {
  const t = translations[locale];
  const acceptedGuests = guests.filter((g) => g.status === 'accepted');
  const declinedGuests = guests.filter((g) => g.status === 'declined');

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{WEDDING_CONFIG.coupleNames}</Heading>
          <Text style={subheading}>{t.date}</Text>

          <Hr style={hr} />

          <Text style={text}>
            {t.greeting} {householdName},
          </Text>

          <Text style={text}>{t.thankYou}</Text>

          {acceptedGuests.length > 0 && (
            <Section>
              <Text style={sectionTitle}>{t.attending} ({acceptedGuests.length})</Text>
              {acceptedGuests.map((guest, index) => (
                <Section key={index} style={guestCard}>
                  <Text style={guestName}>{guest.name}</Text>
                  {guest.eventNames && guest.eventNames.length > 0 && (
                    <Text style={guestDetail}>
                      {guest.eventNames.join(', ')}
                    </Text>
                  )}
                  {guest.dietaryRestrictions && (
                    <Text style={guestDetail}>
                      {t.dietary}: {guest.dietaryRestrictions}
                    </Text>
                  )}
                </Section>
              ))}
            </Section>
          )}

          {declinedGuests.length > 0 && (
            <Section>
              <Text style={sectionTitle}>{t.notAttending} ({declinedGuests.length})</Text>
              {declinedGuests.map((guest, index) => (
                <Text key={index} style={declinedText}>
                  {guest.name}
                </Text>
              ))}
            </Section>
          )}

          <Hr style={hr} />

          <Text style={text}>{t.eventDetails}</Text>
          <Text style={eventInfo}>
            <strong>{t.date}</strong>
            <br />
            {WEDDING_CONFIG.location}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            {t.questions}
            <br />
            {WEDDING_CONFIG.contactEmail}
          </Text>

          <Text style={footer}>{t.seeYou}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const translations = {
  de: {
    preview: `Deine RSVP-Bestätigung für die Hochzeit von ${WEDDING_CONFIG.coupleNames}`,
    greeting: 'Liebe/r',
    thankYou: 'Vielen Dank für deine Rückmeldung! Hier ist eine Zusammenfassung:',
    attending: 'Teilnehmend',
    notAttending: 'Nicht teilnehmend',
    dietary: 'Besonderheiten',
    eventDetails: 'Veranstaltungsdetails:',
    date: WEDDING_CONFIG.weddingDateDisplay.de,
    questions: 'Bei Fragen erreichst du uns unter:',
    seeYou: 'Wir freuen uns auf dich!',
  },
  en: {
    preview: `Your RSVP confirmation for ${WEDDING_CONFIG.coupleNames}'s wedding`,
    greeting: 'Dear',
    thankYou: 'Thank you for your response! Here is a summary:',
    attending: 'Attending',
    notAttending: 'Not attending',
    dietary: 'Restrictions',
    eventDetails: 'Event details:',
    date: WEDDING_CONFIG.weddingDateDisplay.en,
    questions: 'If you have any questions, contact us at:',
    seeYou: 'We look forward to seeing you!',
  },
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const heading = {
  fontSize: '28px',
  fontWeight: '400',
  textAlign: 'center' as const,
  margin: '0 0 8px',
  fontFamily: 'Georgia, serif',
};

const subheading = {
  fontSize: '14px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#333333',
  margin: '0 0 16px',
};

const sectionTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#333333',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '24px 0 12px',
};

const guestCard = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '8px',
};

const guestName = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#333333',
  margin: '0 0 4px',
};

const guestDetail = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const declinedText = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 4px',
};

const eventInfo = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#333333',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '16px',
  margin: '0',
};

const footer = {
  fontSize: '14px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0 0 16px',
};

export default RsvpConfirmationEmail;
