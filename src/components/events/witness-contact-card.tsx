// ABOUTME: Collapsible contact card for wedding witnesses with phone numbers
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle, Phone, ChevronDown } from 'lucide-react';

// Add your witnesses/wedding party contacts here — shown to guests on the events page.
const witnesses = [
  { name: 'Example Witness', phone: '+1 555 000 0000' },
];

export function WitnessContactCard() {
  const t = useTranslations('events');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-panel organic-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full p-5 cursor-pointer hover:bg-muted/30 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3">
          <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 text-left">
            <h3 className="font-medium text-foreground">{t('furtherInfo')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('witnessesInfo')}</p>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-2 ml-8 border-t border-border pt-4">
            {witnesses.map((witness) => (
              <a
                key={witness.name}
                href={`tel:${witness.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors min-h-[44px]"
              >
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">{witness.name}</p>
                  <p className="text-xs text-muted-foreground">{witness.phone}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
