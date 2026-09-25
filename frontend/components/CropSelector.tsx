'use client';

import React from 'react';
import { Language } from '../types/market';
import { translateCommodity } from '../utils/translations';

interface CropSelectorProps {
  label: string;
  selectedCrop: string;
  commodities: string[];
  onChange: (crop: string) => void;
  disabled?: boolean;
  lang?: Language;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  label,
  selectedCrop,
  commodities,
  onChange,
  disabled = false,
  lang = 'en',
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="crop-selector"
        className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id="crop-selector"
          value={selectedCrop}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs hover:border-emerald-500 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 transition-all"
        >
          {commodities.map((item) => {
            const translatedName = translateCommodity(item, lang);
            const labelText =
              lang === 'ta' && translatedName !== item
                ? `${translatedName} (${item})`
                : item;

            return (
              <option key={item} value={item}>
                {labelText}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
