// ABOUTME: Admin login page for Supabase email/password authentication
import { setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/admin/login-form';

interface AdminLoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminLoginPage({ params }: AdminLoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
