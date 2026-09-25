'use client';

import React from 'react';
import { Compass, Info } from 'lucide-react';
import { PriceStatistics, Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';

interface PricePositionProps {
  stats: PriceStatistics;
  lang: Language;
}

export const PricePosition: React.FC<PricePositionProps> = ({ stats, lang }) => {
  const t = TRANSLATIONS[lang];
  const percent = stats.pricePositionPercent;

  let positionText = '';
  let badgeColor = '';

  if (percent >= 70) {
    positionText =
      lang === 'ta'
        ? 'தற்போதைய விலை தேர்ந்தெடுக்கப்பட்ட வரலாற்று காலகட்டத்தில் ஒப்பீட்டளவில் அதிகமாக உள்ளது.'
        : 'Current price is relatively high within the selected historical period.';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (percent <= 30) {
    positionText =
      lang === 'ta'
        ? 'தற்போதைய விலை தேர்ந்தெடுக்கப்பட்ட வரலாற்று காலகட்டத்தில் ஒப்பீட்டளவில் குறைவாக உள்ளது.'
        : 'Current price is relatively low within the selected historical period.';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
  } else {
    positionText =
      lang === 'ta'
        ? 'தற்போதைய விலை தேர்ந்தெடுக்கப்பட்ட வரலாற்று காலகட்டத்தில் நடுத்தர வரம்பில் உள்ளது.'
        : 'Current price is in the moderate / average range for the selected historical period.';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Compass className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.currentPricePosition}
            </h3>
            <p className="text-xs text-slate-500">
              {t.priceContextLabel}: {t.priceContextRange(stats.minPrice, stats.maxPrice)}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border self-start sm:self-auto ${badgeColor}`}
        >
          {t.percentOfRange(percent)}
        </span>
      </div>

      {/* Visual Slider Bar: LOW ─────────●──────── HIGH */}
      <div className="px-2 py-3">
        <div className="relative flex items-center">
          {/* Background bar */}
          <div className="w-full h-2.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-amber-200 rounded-full"></div>

          {/* Position Indicator Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
            style={{ left: `${percent}%` }}
          >
            <div className="relative group">
              <div className="w-5 h-5 rounded-full bg-emerald-800 border-2 border-white shadow-md ring-2 ring-emerald-600/30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap opacity-90 shadow-sm pointer-events-none">
                ₹{stats.latestPrice} {t.kgUnit}
              </div>
            </div>
          </div>
        </div>

        {/* Labels below bar */}
        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mt-2 px-0.5">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-bold">{t.low}</span>
            <span className="text-slate-700 font-medium">₹{stats.minPrice}</span>
          </div>
          <div className="hidden sm:block text-slate-400 font-medium text-[10px]">
            {t.moderate}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-bold">{t.high}</span>
            <span className="text-slate-700 font-medium">₹{stats.maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Contextual explanatory text */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
        <Info className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed font-medium">{positionText}</p>
      </div>
    </div>
  );
};
