// ABOUTME: Server actions for household authentication with rate limiting
'use server';

import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/server';
import { setSession, clearSession } from '@/lib/session';
import { checkRateLimit } from '@/lib/rate-limit';

export interface AuthResult {
  success: boolean;
  error?: string;
}

const HOUSEHOLD_CODE_PATTERN = /^[A-Z0-9]{6}$/;
const AUTH_RATE_LIMIT = { maxAttempts: 10, windowMs: 15 * 60 * 1000 }; // 10 attempts per 15 minutes

export async function authenticateWithCode(code: string): Promise<AuthResult> {
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = checkRateLimit(`auth:${ip}`, AUTH_RATE_LIMIT);

  if (!rateCheck.allowed) {
    return { success: false, error: 'Too many attempts. Please try again later.' };
  }

  if (!code || !HOUSEHOLD_CODE_PATTERN.test(code.toUpperCase())) {
    return { success: false, error: 'Invalid code format' };
  }

  try {
    const supabase = await createServiceClient();

    const { data: household, error } = await supabase
      .from('households')
      .select('id, household_code, primary_contact_name')
      .eq('household_code', code.toUpperCase())
      .single();

    if (error || !household) {
      return { success: false, error: 'Invalid code' };
    }

    await setSession({
      householdId: household.id,
      householdCode: household.household_code,
      primaryContactName: household.primary_contact_name,
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Authentication failed' };
  }
}

export async function logout(): Promise<void> {
  await clearSession();
}
