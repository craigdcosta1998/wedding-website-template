// ABOUTME: Animated tile that reveals bank details on click with a smooth expand animation
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Gift, Copy, Check, ChevronDown } from 'lucide-react';
import { WEDDING_CONFIG } from '@/config/wedding';

const { iban: IBAN, bic: BIC, accountHolder: ACCOUNT_HOLDER } = WEDDING_CONFIG.bankDetails;

export function BankDetailsTile() {
  const t = useTranslations('gift');
  const [revealed, setRevealed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel organic-panel overflow-hidden">
        {/* Header — always visible, click to toggle */}
        <button
          type="button"
          onClick={() => setRevealed((prev) => !prev)}
          className="w-full p-6 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground">{t('showDetails')}</p>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                revealed ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Bank details — animated reveal */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            revealed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-6 space-y-3 border-t border-border pt-4">
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
          </div>
        </div>
      </div>
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
