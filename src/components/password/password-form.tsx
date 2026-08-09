// ABOUTME: Client component for site password entry, following code-entry-form pattern
'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function PasswordForm() {
  const t = useTranslations('password');
  const locale = useLocale();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError(t('required'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (res.ok) {
        window.location.href = `/${locale}`;
      } else {
        setError(t('incorrect'));
        setIsLoading(false);
      }
    } catch {
      setError(t('incorrect'));
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              {t('placeholder')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t('placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-lg min-h-[44px]"
              autoComplete="off"
              autoFocus
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full min-h-[44px]"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
