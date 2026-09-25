'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';

interface EmptyStateProps {
  onReset: () => void;
  lang: Language;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div
      role="status"
      className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs my-8 max-w-xl mx-auto"
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-200">
        <SearchX className="w-8 h-8 stroke-[1.5]" aria-hidden="true" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
        {t.noDataTitle}
      </h3>

      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
        {t.noDataDesc}
      </p>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-xs transition-all focus:outline-hidden focus:ring-3 focus:ring-emerald-700/20"
      >
        <RotateCcw className="w-4 h-4" />
        <span>{t.resetFilters}</span>
      </button>
    </div>
  );
};
