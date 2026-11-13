// ABOUTME: Server-side admin authorization using verified Supabase user IDs and an explicit allowlist
import 'server-only';

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createClient();
  // getUser verifies the caller with Supabase Auth; cookie contents alone are not trusted.
  const { data: { user }, error } = await supabase.auth.getUser();
  const adminIds = (process.env.ADMIN_USER_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (error || !user || !adminIds.includes(user.id)) {
    notFound();
  }

  return user;
}
