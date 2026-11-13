// ABOUTME: Admin dashboard with RSVP statistics and household management
export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';
import type { AgeCategory } from '@/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HouseholdList } from '@/components/admin/household-list';
import { LogoutButton } from '@/components/admin/logout-button';
import { Link } from '@/i18n/routing';
import { Users, UserCheck, UserX, Clock, LayoutGrid } from 'lucide-react';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  await requireAdmin();
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('admin');
  const supabase = await createServiceClient();

  const { data: households } = await supabase
    .from('households')
    .select('*, guests(*)');

  const { data: events } = await supabase
    .from('events')
    .select('id, name_de, name_en')
    .order('sort_order', { ascending: true });

  const { data: guestEvents } = await supabase
    .from('guest_events')
    .select('guest_id, event_id, status');

  const allGuests = (households || []).flatMap((h) => h.guests || []);

  // Map each guest to its age category to break per-event counts into adults/children/toddlers
  const guestCategory = new Map<string, AgeCategory>(
    allGuests.map((g) => [g.id, g.age_category ?? 'adult'])
  );

  const eventCounts = (events || []).map((event) => {
    const attending = (guestEvents || []).filter(
      (ge) => ge.event_id === event.id && ge.status === 'accepted'
    );
    const countOf = (category: AgeCategory) =>
      attending.filter(
        (ge) => (guestCategory.get(ge.guest_id) ?? 'adult') === category
      ).length;
    return {
      name: locale === 'de' ? event.name_de : event.name_en,
      total: attending.length,
      adults: countOf('adult'),
      children: countOf('child'),
      toddlers: countOf('toddler'),
    };
  });

  const stats = {
    totalHouseholds: households?.length || 0,
    totalGuests: allGuests.length,
    confirmed: allGuests.filter((g) => g.rsvp_status === 'accepted').length,
    declined: allGuests.filter((g) => g.rsvp_status === 'declined').length,
    pending: allGuests.filter((g) => g.rsvp_status === 'pending').length,
  };

  const dietaryRestrictions = allGuests
    .filter((g) => g.dietary_restrictions)
    .map((g) => ({
      name: `${g.first_name} ${g.last_name}`,
      restrictions: g.dietary_restrictions,
    }));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-medium">{t('title')}</h1>
        <LogoutButton locale={locale} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.totalGuests}</p>
                <p className="text-sm text-muted-foreground">{t('stats.totalGuests')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                <p className="text-sm text-muted-foreground">{t('stats.confirmed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
                <p className="text-sm text-muted-foreground">{t('stats.declined')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">{t('stats.pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.totalHouseholds}</p>
                <p className="text-sm text-muted-foreground">{t('stats.totalHouseholds')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-Event Attendance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('stats.perEvent')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {eventCounts.map((ec) => (
              <div key={ec.name} className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{ec.name}</span>
                  <span className="text-2xl font-bold text-primary">{ec.total}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    {t('stats.adults')}:{' '}
                    <span className="font-semibold text-foreground">{ec.adults}</span>
                  </span>
                  <span>
                    {t('stats.children')}:{' '}
                    <span className="font-semibold text-foreground">{ec.children}</span>
                  </span>
                  <span>
                    {t('stats.toddlers')}:{' '}
                    <span className="font-semibold text-foreground">{ec.toddlers}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-1 gap-8 mb-8">
        {/* Dietary Restrictions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dietary.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {dietaryRestrictions.length === 0 ? (
              <p className="text-muted-foreground">
                {locale === 'de' ? 'Keine Einschränkungen gemeldet' : 'No restrictions reported'}
              </p>
            ) : (
              <div className="space-y-3">
                {dietaryRestrictions.map((item, index) => (
                  <div key={index} className="border-b pb-2 last:border-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.restrictions}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seating Planner */}
      <Card className="mb-8">
        <CardContent className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{t('seating.cardTitle')}</p>
              <p className="text-sm text-muted-foreground">{t('seating.cardDescription')}</p>
            </div>
          </div>
          <Link href="/admin/seating">
            <Button className="min-h-[44px]">{t('seating.title')}</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Household List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('households.title')}</CardTitle>
          <CardDescription>
            {locale === 'de'
              ? 'Alle Haushalte und deren RSVP-Status'
              : 'All households and their RSVP status'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HouseholdList
            households={(households || []).map((h) => ({
              ...h,
              guests: h.guests || [],
            }))}
            locale={locale}
            events={events || []}
            guestEvents={guestEvents || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
