// ABOUTME: Floating gift button that opens bank details in a popup overlay
// ABOUTME: Fixed to bottom-right corner, only shown on the gift page
'use client';

import { useState } from 'react';
import { Gift, X, Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { WEDDING_CONFIG } from '@/config/wedding';

const { iban: IBAN, bic: BIC, accountHolder: ACCOUNT_HOLDER } = WEDDING_CONFIG.bankDetails;

export function FloatingBankDetails() {
  const t = useTranslations('gift');
  const [open, setOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popup with bank details */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-16 right-0 w-80 glass-panel organic-panel p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">{t('bankDetails')}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <DetailRow
              label={t('accountHolder')}
              value={ACCOUNT_HOLDER}
              onCopy={() => copyToClipboard(ACCOUNT_HOLDER, 'holder')}
              copied={copiedField === 'holder'}
            />
            <DetailRow
              label={t('iban')}
              value={IBAN}
              onCopy={() => copyToClipboard(IBAN, 'iban')}
              copied={copiedField === 'iban'}
              mono
            />
            <DetailRow
              label={t('bic')}
              value={BIC}
              onCopy={() => copyToClipboard(BIC, 'bic')}
              copied={copiedField === 'bic'}
              mono
            />
          </div>
        </>
      )}

      {/* Floating button with label */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all px-8 py-5 text-lg"
        aria-label={t('showDetails')}
      >
        {open ? <X className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
        <span className="text-sm font-medium">{t('bankDetails')}</span>
      </button>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
}

function DetailRow({ label, value, onCopy, copied, mono }: DetailRowProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="relative w-full p-3 rounded-lg bg-muted/30 text-center cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${mono ? 'font-mono tracking-wide' : ''}`}>
        {value}
      </p>
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-600" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
    </button>
  );
}
