'use client';

import React from 'react';
import { ArrowLeftRight, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketComparisonItem, Language } from '../types/market';
import {
  TRANSLATIONS,
  translateCommodity,
  translateMarket,
} from '../utils/translations';

interface MarketComparisonProps {
  comparison: MarketComparisonItem[];
  selectedMarketName: string;
  commodityName: string;
  lang: Language;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({
  comparison,
  selectedMarketName,
  commodityName,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  if (!comparison || comparison.length === 0) {
    return null;
  }

  const localizedCrop = translateCommodity(commodityName, lang);
  const localizedSelectedMarket = translateMarket(selectedMarketName, lang);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-6 mb-8 transition-shadow hover:shadow-md">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.marketComparison}
            </h2>
            <p className="text-xs text-slate-500">
              {t.marketComparisonSubtitle(localizedCrop, localizedSelectedMarket)}
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 self-start sm:self-auto bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
          {t.marketsTracked(comparison.length)}
        </span>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {comparison.map((item) => {
          const isSelected = item.isSelected;
          const diff = item.diffFromSelected;
          const localizedName = translateMarket(item.marketName, lang);

          return (
            <div
              key={item.marketName}
              className={`rounded-xl p-4.5 border transition-all duration-200 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-600/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Market Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-bold text-slate-900 text-sm truncate">
                  {localizedName}
                </span>
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-700 text-white">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.selectedMarket}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {t.apmcBadge}
                  </span>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs text-slate-500 font-medium">
                    {t.latestPrice}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">
                    ₹{item.latestPrice}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      {t.kgUnit}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {t.averagePrice}
                  </span>
                  <span className="font-bold text-slate-700">
                    ₹{item.avgPrice} {t.kgUnit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">
                    {t.diffFromSelected}
                  </span>
                  {isSelected ? (
                    <span className="font-semibold text-emerald-800 text-[11px] bg-emerald-100/60 px-2 py-0.5 rounded">
                      0.0 ({t.baseMarket})
                    </span>
                  ) : diff > 0 ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <TrendingUp className="w-3 h-3" />
                      +₹{Math.abs(diff)} {t.kgUnit}
                    </span>
                  ) : diff < 0 ? (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <TrendingDown className="w-3 h-3" />
                      -₹{Math.abs(diff)} {t.kgUnit}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                      <Minus className="w-3 h-3" />
                      {t.samePrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Neutral summary context footer */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
        <p>
          {t.marketComparisonFooter}
        </p>
        <span className="text-[11px] font-semibold text-slate-500">
          {t.marketComparisonSource}
        </span>
      </div>
    </div>
  );
};
