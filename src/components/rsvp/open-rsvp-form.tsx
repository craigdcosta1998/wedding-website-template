// ABOUTME: Open RSVP form — guests enter their info directly without a household code
'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { submitOpenRsvp } from '@/app/actions/rsvp';
import type { OpenRsvpGuest } from '@/lib/rsvp-validation';
import type { DietaryPreference } from '@/types/database';
import { Loader2, Plus, Trash2, CheckCircle, CalendarPlus } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { WEDDING_CONFIG } from '@/config/wedding';
import type { RsvpEvent } from '@/types/rsvp';

interface OpenRsvpFormProps {
  events: RsvpEvent[];
}

const dietaryOptions: DietaryPreference[] = [
  'none',
  'vegetarian',
  'vegan',
  'other',
];

function createEmptyGuest(): OpenRsvpGuest {
  return {
    firstName: '',
    lastName: '',
    selectedEventIds: [],
    dietaryPreference: 'none',
    dietaryOther: '',
  };
}

function formatEventDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return formatted;
}

export function OpenRsvpForm({ events }: OpenRsvpFormProps) {
  const t = useTranslations('rsvp');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'de' | 'en';

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [guests, setGuests] = useState<OpenRsvpGuest[]>([createEmptyGuest()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const addGuest = () => {
    setGuests((prev) => [...prev, createEmptyGuest()]);
  };

  const removeGuest = (index: number) => {
    if (guests.length <= 1) return;
    setGuests((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGuest = (index: number, updates: Partial<OpenRsvpGuest>) => {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, ...updates } : g))
    );
  };

  const toggleEventForGuest = (guestIndex: number, eventId: string, checked: boolean) => {
    setGuests((prev) =>
      prev.map((g, i) => {
        if (i !== guestIndex) return g;
        const selectedEventIds = checked
          ? [...g.selectedEventIds, eventId]
          : g.selectedEventIds.filter((id) => id !== eventId);
        return { ...g, selectedEventIds };
      })
    );
  };

  const canSubmit = () => {
    if (!contactName.trim() || !contactEmail.trim()) return false;
    return guests.every(
      (g) =>
        g.firstName.trim() &&
        g.lastName.trim() &&
        (g.selectedEventIds.length === 0 || (g.dietaryPreference !== 'other' || g.dietaryOther.trim()))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitOpenRsvp(
        { contactName: contactName.trim(), contactEmail: contactEmail.trim(), guests },
        locale
      );

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || t('submitError'));
      }
    } catch {
      setError(t('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateIcsFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Website//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:${WEDDING_CONFIG.weddingDateIcs.start}
DTEND;VALUE=DATE:${WEDDING_CONFIG.weddingDateIcs.end}
SUMMARY:${WEDDING_CONFIG.coupleNames} - Wedding
LOCATION:${WEDDING_CONFIG.location.replaceAll(',', '\\,')}
DESCRIPTION:Wedding celebration of ${WEDDING_CONFIG.coupleFirstNames.partner1} and ${WEDDING_CONFIG.coupleFirstNames.partner2}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (submitted) {
    const attending = guests.filter((g) => g.selectedEventIds.length > 0);
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="pt-8">
            <div className="text-center py-8 space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-medium mb-2">{t('thankYou')}</h2>
                <p className="text-muted-foreground">{t('confirmationMessage')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {attending.length > 0 && (
                  <Button onClick={generateIcsFile} className="min-h-[44px]">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    {t('addToCalendar')}
                  </Button>
                )}
                <Link href="/">
                  <Button variant="outline" className="min-h-[44px]">
                    {tCommon('back')}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="handwritten text-4xl sm:text-5xl text-primary mb-2">{t('title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contactInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">{t('contactName')}</Label>
              <Input
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="min-h-[44px]"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">{t('contactEmail')}</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="min-h-[44px]"
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
        </Card>

        {/* Guests */}
        <Card>
          <CardHeader>
            <CardTitle>{t('guestsTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {guests.map((guest, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-muted-foreground">
                    {t('guestNumber', { number: index + 1 })}
                  </p>
                  {guests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuest(index)}
                      disabled={isSubmitting}
                      className="min-h-[44px] text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`guest-${index}-first`}>{t('firstName')}</Label>
                    <Input
                      id={`guest-${index}-first`}
                      value={guest.firstName}
                      onChange={(e) => updateGuest(index, { firstName: e.target.value })}
                      className="min-h-[44px]"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`guest-${index}-last`}>{t('lastName')}</Label>
                    <Input
                      id={`guest-${index}-last`}
                      value={guest.lastName}
                      onChange={(e) => updateGuest(index, { lastName: e.target.value })}
                      className="min-h-[44px]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Event checkboxes */}
                <div className="space-y-2">
                  <Label>{t('events')}</Label>
                  <div className="space-y-2">
                    {events.map((event) => {
                      const isChecked = guest.selectedEventIds.includes(event.id);
                      return (
                        <label
                          key={event.id}
                          className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors min-h-[44px]"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              toggleEventForGuest(index, event.id, checked === true)
                            }
                            disabled={isSubmitting}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              {event.name_en}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatEventDate(event.event_date, locale)} &middot; {event.location_name}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {guest.selectedEventIds.length > 0 && (
                  <div className="space-y-3">
                    <Label>{t('dietaryPreference')}</Label>
                    <RadioGroup
                      value={guest.dietaryPreference}
                      onValueChange={(value) =>
                        updateGuest(index, {
                          dietaryPreference: value as DietaryPreference,
                          dietaryOther: value !== 'other' ? '' : guest.dietaryOther,
                        })
                      }
                      className="flex flex-col gap-2"
                    >
                      {dietaryOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`guest-${index}-dietary-${option}`}
                            className="min-h-[24px] min-w-[24px]"
                          />
                          <Label
                            htmlFor={`guest-${index}-dietary-${option}`}
                            className="cursor-pointer min-h-[44px] flex items-center px-2"
                          >
                            {t(`dietary_${option}`)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {guest.dietaryPreference === 'other' && (
                      <div className="space-y-2 ml-8">
                        <Textarea
                          id={`guest-${index}-dietary-other`}
                          placeholder={t('dietaryOtherPlaceholder')}
                          value={guest.dietaryOther}
                          onChange={(e) =>
                            updateGuest(index, { dietaryOther: e.target.value })
                          }
                          rows={2}
                          className="min-h-[44px]"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addGuest}
              disabled={isSubmitting}
              className="w-full min-h-[44px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('addGuest')}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button
          type="submit"
          disabled={!canSubmit() || isSubmitting}
          className="w-full min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tCommon('loading')}
            </>
          ) : (
            t('submitRsvp')
          )}
        </Button>
      </form>
    </div>
  );
}
