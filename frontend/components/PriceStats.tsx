'use client';

import React from 'react';
import { Tag, TrendingDown, TrendingUp, Calculator } from 'lucide-react';
import { PriceStatistics, Language } from '../types/market';
import { TRANSLATIONS, formatLocalizedShortDate } from '../utils/translations';

interface PriceStatsProps {
  stats: PriceStatistics;
  lang: Language;
}

export const PriceStats: React.FC<PriceStatsProps> = ({ stats, lang }) => {
  const t = TRANSLATIONS[lang];

  const cards = [
    {
      id: 'latest',
      title: t.latestPrice,
      value: `₹${stats.latestPrice}`,
      unit: t.kgUnit,
      subtitle: t.statsRecordedDays(stats.recordCount),
      icon: Tag,
      iconBg: 'bg-emerald-700 text-white',
      cardBg: 'bg-emerald-800 text-white border-emerald-900 shadow-md',
      titleColor: 'text-emerald-100',
      valueColor: 'text-white',
      unitColor: 'text-emerald-200',
      subColor: 'text-emerald-200/90',
      badge: t.badgeCurrentModal,
      badgeClass: 'bg-emerald-700/80 text-white border border-emerald-600',
    },
    {
      id: 'min',
      title: t.minimumPrice,
      value: `₹${stats.minPrice}`,
      unit: t.kgUnit,
      subtitle: t.statsRecordedOn(formatLocalizedShortDate(stats.lowestDate, lang)),
      icon: TrendingDown,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      cardBg: 'bg-white border-slate-200 shadow-xs hover:border-emerald-300',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900',
      unitColor: 'text-slate-400',
      subColor: 'text-slate-500',
      badge: t.badgeLowest,
      badgeClass: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'max',
      title: t.maximumPrice,
      value: `₹${stats.maxPrice}`,
      unit: t.kgUnit,
      subtitle: t.statsPeakOn(formatLocalizedShortDate(stats.peakDate, lang)),
      icon: TrendingUp,
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      cardBg: 'bg-white border-slate-200 shadow-xs hover:border-emerald-300',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900',
      unitColor: 'text-slate-400',
      subColor: 'text-slate-500',
      badge: t.badgePeak,
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'avg',
      title: t.averagePrice,
      value: `₹${stats.avgPrice}`,
      unit: t.kgUnit,
      subtitle: t.statsMeanAcross,
      icon: Calculator,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      cardBg: 'bg-white border-slate-200 shadow-xs hover:border-emerald-300',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900',
      unitColor: 'text-slate-400',
      subColor: 'text-slate-500',
      badge: t.badgeAverage,
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${card.cardBg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${card.titleColor}`}>
                {card.title}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${card.valueColor}`}>
                {card.value}
              </span>
              <span className={`text-sm font-medium ${card.unitColor}`}>
                {card.unit}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100/15">
              <div className={`p-1 rounded-md shrink-0 ${card.iconBg}`}>
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <p className={`text-xs truncate font-medium ${card.subColor}`}>
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
