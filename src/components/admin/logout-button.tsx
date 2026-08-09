// ABOUTME: Client component logout button for admin dashboard
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { adminLogout } from '@/app/actions/admin-auth';
import { Loader2, LogOut } from 'lucide-react';

interface LogoutButtonProps {
  locale: string;
}

export function LogoutButton({ locale }: LogoutButtonProps) {
  const t = useTranslations('admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await adminLogout(locale);
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="min-h-[44px]"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      {t('logout')}
    </Button>
  );
}
