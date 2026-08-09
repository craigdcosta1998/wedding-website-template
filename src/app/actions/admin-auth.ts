// ABOUTME: Server action for admin logout via Supabase Auth
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/routing';

export async function adminLogout(locale: string): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: '/admin/login', locale });
}
