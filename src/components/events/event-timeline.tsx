// ABOUTME: Collapsible event timeline component where guests can expand events to see details
// ABOUTME: Shows a compact overview by default with expand/collapse for dresscode, directions, parking, map
'use client';

import { useState } from 'react';
import { MapPin, Clock, Shirt, CarFront, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Event } from '@/types/database';

interface EventTimelineProps {
  events: Event[];
  locale: string;
}

function formatTime(dateString: string, locale: string) {
  return new Date(dateString).toLocaleTimeString(locale === 'de' ? 'de-DE' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
  });
}

function formatDate(dateString: string, locale: string) {
  return new Date(dateString).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  });
}

export function EventTimeline({ events, locale }: EventTimelineProps) {
  const t = useTranslations('events');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  if (events.length === 0) {
    return (
      <div className="glass-panel organic-panel p-12 text-center text-muted-foreground">
        {locale === 'de' ? 'Keine Veranstaltungen verfügbar.' : 'No events available.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const isExpanded = expandedId === event.id;
        const description = locale === 'de' ? event.description_de : event.description_en;
        const dresscode = locale === 'de' ? event.dresscode_de : event.dresscode_en;
        const parking = locale === 'de' ? event.parking_de : event.parking_en;
        const hasDetails = description || dresscode || parking || event.location_address;

        return (
          <div key={event.id} className="relative">
            {/* Connecting line between events */}
            {index < events.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-primary/10" />
            )}

            <div className="glass-panel organic-panel overflow-hidden">
              {/* Collapsed summary — always visible */}
              <button
                type="button"
                onClick={() => hasDetails && toggle(event.id)}
                className={`w-full text-left p-5 flex items-center gap-4 ${hasDetails ? 'cursor-pointer hover:bg-muted/30 transition-colors' : ''}`}
                aria-expanded={isExpanded}
              >
                {/* Time badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0 shadow-md">
                  <Clock className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="handwritten text-2xl sm:text-3xl text-foreground leading-tight">
                    {locale === 'de' ? event.name_de : event.name_en}
                  </h2>
                  <p className="text-primary font-medium text-sm mt-0.5">
                    {formatTime(event.event_date, locale)}
                    {event.event_end_date && ` – ${formatTime(event.event_end_date, locale)}`}
                    <span className="text-muted-foreground font-normal ml-2">
                      · {formatDate(event.event_date, locale)}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {event.location_name}
                  </p>
                </div>

                {hasDetails && (
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {/* Expanded details */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 ml-16 space-y-4 border-t border-border pt-4">
                    {description && (
                      <p className="text-muted-foreground text-sm">{description}</p>
                    )}

                    {dresscode && (
                      <div className="flex items-start gap-2 text-sm">
                        <Shirt className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium">{t('dresscode')}: {dresscode}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="font-medium">{event.location_name}</p>
                        <p className="text-muted-foreground">{event.location_address}</p>
                      </div>
                    </div>

                    {event.location_address && (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <iframe
                          title={event.location_name}
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(event.location_name + ', ' + event.location_address)}&output=embed`}
                        />
                      </div>
                    )}

                    {parking && (
                      <div className="flex items-start gap-2 text-sm">
                        <CarFront className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <div>
                          <p className="font-medium">{t('parking')}</p>
                          <p className="text-muted-foreground">{parking}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
