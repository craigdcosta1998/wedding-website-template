// ABOUTME: Password entry page for site-wide access protection
import { setRequestLocale } from 'next-intl/server';
import { PasswordForm } from '@/components/password/password-form';

interface PasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PasswordPage({ params }: PasswordPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <PasswordForm />
    </div>
  );
}
