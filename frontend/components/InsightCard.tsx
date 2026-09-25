'use client';

import React from 'react';
import { Lightbulb, CheckCircle, BarChart, Calendar, Scale } from 'lucide-react';
import { MarketInsight, Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';

interface InsightCardProps {
  insight: MarketInsight;
  lang: Language;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-6 mb-8 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Lightbulb className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.marketInsight}
            </h2>
            <p className="text-xs text-slate-500">
              {t.marketInsightDesc}
            </p>
          </div>
        </div>

        {/* Data-based insight Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t.dataBasedInsight}</span>
        </span>
      </div>

      {/* Main Headline */}
      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 mb-5">
        <p className="text-sm sm:text-base font-bold text-emerald-950">
          {insight.headline}
        </p>
      </div>

      {/* Rule-Based Insight Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Point 1: Trend Insight */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700 shrink-0 mt-0.5">
            <BarChart className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              {t.insightTrajectoryLabel}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {insight.trendInsight}
            </p>
          </div>
        </div>

        {/* Point 2: Peak & Low Insight */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700 shrink-0 mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              {t.insightHighLowLabel}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {insight.peakInsight}
            </p>
          </div>
        </div>

        {/* Point 3: Comparison Insight */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700 shrink-0 mt-0.5">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              {t.insightPositioningLabel}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {insight.comparisonInsight}
            </p>
          </div>
        </div>

        {/* Point 4: Spread & Historical Position */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700 shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              {t.insightSpreadLabel}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {insight.spreadInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Note footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>{t.insightFooterRule}</span>
        <span>{t.insightFooterNoAi}</span>
      </div>
    </div>
  );
};
