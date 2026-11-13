// ABOUTME: Admin seating planner page — fetches guests and seating state, renders the board
export const dynamic = 'force-dynamic';

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';
import { LogoutButton } from '@/components/admin/logout-button';
import { SeatingBoard } from '@/components/admin/seating/seating-board';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

interface SeatingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SeatingPage({ params }: SeatingPageProps) {
  await requireAdmin();
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('admin.seating');
  const supabase = await createServiceClient();

  const { data: guests } = await supabase
    .from('guests')
    .select('id, first_name, last_name, household_id, age_category, seat_with_guest_id')
    .eq('rsvp_status', 'accepted')
    .order('last_name', { ascending: true });

  const { data: tables } = await supabase
    .from('seating_tables')
    .select('*')
    .order('sort_order', { ascending: true });

  const { data: seats } = await supabase
    .from('seating_seats')
    .select('*')
    .order('seat_index', { ascending: true });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToAdmin')}
          </Link>
          <h1 className="text-3xl font-serif font-medium">{t('title')}</h1>
        </div>
        <LogoutButton locale={locale} />
      </div>

      <SeatingBoard
        guests={guests || []}
        tables={tables || []}
        seats={seats || []}
      />
    </div>
  );
}
