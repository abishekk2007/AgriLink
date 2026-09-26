'use client';

import React from 'react';
import { Landmark, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';

interface MspCardProps {
  commodityName: string;
  currentPrice: number;
  mspData: {
    price: number;
    unit: string;
    season: string;
    year: number;
    source: string;
  };
  lang: Language;
}

export const MspCard: React.FC<MspCardProps> = ({
  commodityName,
  currentPrice,
  mspData,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // If unit is quintal, convert current price if current price is per kg (e.g. price * 100) or keep same
  const isQuintal = mspData.unit.includes('quintal');
  const normalizedCurrentPrice = isQuintal && currentPrice < 200 ? currentPrice * 100 : currentPrice;
  const difference = Math.round((normalizedCurrentPrice - mspData.price) * 10) / 10;
  const diffPercent = Math.round(((normalizedCurrentPrice - mspData.price) / mspData.price) * 1000) / 10;

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-6 mb-8 transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Landmark className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {t.mspTitle}
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                {mspData.season} {mspData.year}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Official Government Benchmark: {mspData.source}
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 font-semibold self-start sm:self-auto">
          {commodityName} MSP
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* MSP Rate */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">
            {t.mspPrice}
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            ₹{mspData.price.toLocaleString()}
            <span className="text-xs font-medium text-slate-500 ml-1">
              /{mspData.unit.replace('₹/', '')}
            </span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            CACP Statutory Benchmark
          </p>
        </div>

        {/* Current Market Price */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">
            Current Mandi Rate
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            ₹{normalizedCurrentPrice.toLocaleString()}
            <span className="text-xs font-medium text-slate-500 ml-1">
              /{mspData.unit.replace('₹/', '')}
            </span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            APMC Modal Price
          </p>
        </div>

        {/* Spread / Difference */}
        <div className={`p-4 rounded-xl border ${
          difference >= 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
        }`}>
          <span className="text-xs font-bold text-slate-700 block">
            {t.mspDifference}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {difference >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-700" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-amber-700" />
            )}
            <p className={`text-2xl font-black ${
              difference >= 0 ? 'text-emerald-800' : 'text-amber-800'
            }`}>
              {difference >= 0 ? `+₹${difference}` : `-₹${Math.abs(difference)}`}
            </p>
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-1">
            {difference >= 0
              ? `${diffPercent}% above official MSP`
              : `${Math.abs(diffPercent)}% below official MSP`}
          </p>
        </div>
      </div>

      {/* Transparent Disclaimer */}
      <div className="flex items-start gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {t.mspDisclaimer}
        </p>
      </div>
    </div>
  );
};
