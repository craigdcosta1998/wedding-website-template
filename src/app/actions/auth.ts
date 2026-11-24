// ABOUTME: Server actions for household authentication with rate limiting
'use server';

import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/server';
import { setSession, clearSession } from '@/lib/session';
import { checkRateLimit } from '@/lib/rate-limit';
import { hasHouseholdAccessConfig, hasSiteAccess } from '@/lib/household-access';

export interface AuthResult {
  success: boolean;
  error?: string;
}

const HOUSEHOLD_CODE_PATTERN = /^[A-Z0-9]{6}$/;
const AUTH_RATE_LIMIT = { maxAttempts: 10, windowMs: 15 * 60 * 1000 }; // 10 attempts per 15 minutes

export async function authenticateWithCode(code: string): Promise<AuthResult> {
  if (!hasHouseholdAccessConfig() || !await hasSiteAccess()) {
    return { success: false, error: 'Invitations are not available yet. Please check back soon.' };
  }
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(`auth:${ip}`, AUTH_RATE_LIMIT);

  if (!rateCheck.allowed) {
    return { success: false, error: 'Too many attempts. Please try again later.' };
  }

  if (typeof code !== 'string' || !HOUSEHOLD_CODE_PATTERN.test(code.trim().toUpperCase())) {
    return { success: false, error: 'Invalid code format' };
  }

  try {
    const supabase = await createServiceClient();

    const { data: household, error } = await supabase
      .from('households')
      .select('id, auth_version')
      .eq('household_code', code.trim().toUpperCase())
      .maybeSingle();

    if (error) {
      return { success: false, error: 'Invitations are not available yet. Please check back soon.' };
    }
    if (!household) {
      return { success: false, error: 'Invalid code' };
    }

    await setSession({
      householdId: household.id,
      authVersion: household.auth_version,
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Authentication failed' };
  }
}

export async function logout(): Promise<void> {
  await clearSession();
}
