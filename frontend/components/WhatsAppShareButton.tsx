'use client';

import React, { useState } from 'react';
import { Share2, Check, ExternalLink } from 'lucide-react';
import { Language } from '../types/market';
import { TRANSLATIONS, generateWhatsAppShareMessage } from '../utils/translations';

interface WhatsAppShareButtonProps {
  crop: string;
  market: string;
  latestPrice: number;
  avgPrice: number;
  percentageChange: number;
  unit?: string;
  lang: Language;
}

export const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({
  crop,
  market,
  latestPrice,
  avgPrice,
  percentageChange,
  unit = '₹/kg',
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [copied, setCopied] = useState(false);

  const message = generateWhatsAppShareMessage({
    crop,
    market,
    latestPrice,
    avgPrice,
    percentageChange,
    unit,
    lang,
  });

  const handleShare = () => {
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        title="Share verified market card on WhatsApp"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>{t.shareWhatsApp}</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        title="Copy text preview"
      >
        {copied ? (
          <span className="flex items-center gap-1 text-emerald-700">
            <Check className="w-3 h-3" /> Copied
          </span>
        ) : (
          'Copy Text'
        )}
      </button>
    </div>
  );
};
