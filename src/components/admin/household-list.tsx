// ABOUTME: Admin component for displaying and filtering household RSVP data
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Search } from 'lucide-react';

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  rsvp_status: string;
  meal_choice: string | null;
  dietary_restrictions: string | null;
}

interface Household {
  id: string;
  household_code: string;
  primary_contact_name: string;
  primary_contact_email: string | null;
  invitation_type: string;
  guests: Guest[];
}

interface EventInfo {
  id: string;
  name_de: string;
  name_en: string;
}

interface GuestEventInfo {
  guest_id: string;
  event_id: string;
  status: string;
}

interface HouseholdListProps {
  households: Household[];
  locale: string;
  events: EventInfo[];
  guestEvents: GuestEventInfo[];
}

export function HouseholdList({ households, locale, events, guestEvents }: HouseholdListProps) {
  const t = useTranslations('admin');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredHouseholds = households.filter((household) => {
    const matchesSearch =
      household.primary_contact_name.toLowerCase().includes(search.toLowerCase()) ||
      household.household_code.toLowerCase().includes(search.toLowerCase()) ||
      household.guests.some((g) =>
        `${g.first_name} ${g.last_name}`.toLowerCase().includes(search.toLowerCase())
      );

    const matchesStatus =
      statusFilter === 'all' ||
      household.guests.some((g) => g.rsvp_status === statusFilter);

    const matchesType =
      typeFilter === 'all' || household.invitation_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const exportToCsv = () => {
    const headers = [
      'Household Code',
      'Contact Name',
      'Contact Email',
      'Invitation Type',
      'Guest Name',
      'RSVP Status',
      'Dietary Restrictions',
      ...events.map((e) => e.name_en),
    ];

    const rows = households.flatMap((h) =>
      h.guests.map((g) => [
        h.household_code,
        h.primary_contact_name,
        h.primary_contact_email || '',
        h.invitation_type,
        `${g.first_name} ${g.last_name}`,
        g.rsvp_status,
        g.dietary_restrictions || '',
        ...events.map((e) =>
          guestEvents.some(
            (ge) => ge.guest_id === g.id && ge.event_id === e.id && ge.status === 'accepted'
          ) ? 'Yes' : 'No'
        ),
      ])
    );

    const sanitizeCell = (value: string): string => {
      // Escape double quotes by doubling them
      let escaped = value.replace(/"/g, '""');
      // Prevent CSV injection: prefix formula-triggering characters with a single quote
      if (/^[=+\-@\t\r]/.test(escaped)) {
        escaped = "'" + escaped;
      }
      return escaped;
    };

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${sanitizeCell(cell)}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-rsvp-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          {locale === 'de' ? 'Zugesagt' : 'Accepted'}
        </Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          {locale === 'de' ? 'Abgesagt' : 'Declined'}
        </Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          {locale === 'de' ? 'Ausstehend' : 'Pending'}
        </Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('households.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 min-h-[44px]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
            <SelectValue placeholder={t('households.filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('households.all')}</SelectItem>
            <SelectItem value="accepted">{locale === 'de' ? 'Zugesagt' : 'Accepted'}</SelectItem>
            <SelectItem value="declined">{locale === 'de' ? 'Abgesagt' : 'Declined'}</SelectItem>
            <SelectItem value="pending">{locale === 'de' ? 'Ausstehend' : 'Pending'}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
            <SelectValue placeholder={t('households.filterByType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('households.all')}</SelectItem>
            <SelectItem value="all_events">All Events</SelectItem>
            <SelectItem value="ceremony_reception">Ceremony & Reception</SelectItem>
            <SelectItem value="reception_only">Reception Only</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={exportToCsv} variant="outline" className="min-h-[44px]">
          <Download className="mr-2 h-4 w-4" />
          {t('export.csv')}
        </Button>
      </div>

      {/* Household Cards */}
      <div className="space-y-4">
        {filteredHouseholds.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {locale === 'de' ? 'Keine Haushalte gefunden' : 'No households found'}
          </p>
        ) : (
          filteredHouseholds.map((household) => (
            <div key={household.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-medium">{household.primary_contact_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Code: <span className="font-mono">{household.household_code}</span>
                    {household.primary_contact_email && (
                      <> · {household.primary_contact_email}</>
                    )}
                  </p>
                </div>
                <Badge variant="outline">{household.invitation_type.replace('_', ' ')}</Badge>
              </div>

              <div className="space-y-2">
                {household.guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-t first:border-0"
                  >
                    <span>
                      {guest.first_name} {guest.last_name}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(guest.rsvp_status)}
                      {guest.dietary_restrictions && (
                        <Badge variant="secondary">
                          {guest.dietary_restrictions}
                        </Badge>
                      )}
                      {events
                        .filter((event) =>
                          guestEvents.some(
                            (ge) => ge.guest_id === guest.id && ge.event_id === event.id && ge.status === 'accepted'
                          )
                        )
                        .map((event) => (
                          <Badge key={event.id} variant="outline" className="text-xs">
                            {locale === 'de' ? event.name_de : event.name_en}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
