'use client';

import React from 'react';
import { Sprout, User, BarChart3 } from 'lucide-react';
import { Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm ring-4 ring-emerald-50">
              <Sprout className="w-6 h-6 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-emerald-950 font-sans">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {t.apmcPortalBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dashboard Link / Active Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-200">
              <BarChart3 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>{t.dashboard}</span>
            </div>

            {/* Language Selector Toggle */}
            <div
              className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold"
              role="group"
              aria-label="Language Selector"
            >
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={currentLanguage === 'en'}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ta')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentLanguage === 'ta'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={currentLanguage === 'ta'}
              >
                தமிழ்
              </button>
            </div>

            {/* Profile / User Icon (Visual Only) */}
            <button
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="User Profile"
              title="Farmer Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tagline sub-bar */}
        <div className="md:hidden pb-2.5 pt-0.5 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium truncate">
            {t.tagline}
          </p>
        </div>
      </div>
    </header>
  );
};
