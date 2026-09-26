'use client';

import React, { useState } from 'react';
import { Truck, Calculator, HelpCircle, ArrowRight } from 'lucide-react';
import { Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';

interface TransportCalculatorProps {
  baseMarketPrice?: number;
  unit?: string;
  lang: Language;
}

export const TransportCalculator: React.FC<TransportCalculatorProps> = ({
  baseMarketPrice = 32,
  unit = '₹/kg',
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const [marketPrice, setMarketPrice] = useState<number>(baseMarketPrice);
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [ratePerKm, setRatePerKm] = useState<number>(12);
  const [quantityKg, setQuantityKg] = useState<number>(1000);

  // Calculations
  const totalTransportCost = Math.round(distanceKm * ratePerKm);
  const grossMarketValue = Math.round(marketPrice * quantityKg);
  const netRealization = Math.max(0, grossMarketValue - totalTransportCost);
  const transportCostPerKg = quantityKg > 0 ? (totalTransportCost / quantityKg).toFixed(2) : '0';
  const netRealizationPerKg = quantityKg > 0 ? (netRealization / quantityKg).toFixed(2) : '0';
  const transportPercent = grossMarketValue > 0 ? ((totalTransportCost / grossMarketValue) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-6 mb-8 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Truck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.transportCalculator}
            </h2>
            <p className="text-xs text-slate-500">
              {t.transportCalcDesc}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
          Net Realization = Market Price - Transport Cost
        </span>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 1. Market Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Market Price ({unit})
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="0.5"
              value={marketPrice}
              onChange={(e) => setMarketPrice(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>
          <span className="text-[10px] text-slate-400">Current mandi modal price</span>
        </div>

        {/* 2. Distance */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            {t.distanceKm}
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="1500"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>
          <span className="text-[10px] text-slate-400">Farm to APMC yard distance</span>
        </div>

        {/* 3. Transport Rate */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            {t.transportRate}
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="0.5"
              value={ratePerKm}
              onChange={(e) => setRatePerKm(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>
          <span className="text-[10px] text-slate-400">Vehicle rate (mini-truck/tempo)</span>
        </div>

        {/* 4. Quantity */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            {t.quantityKg}
          </label>
          <div className="relative">
            <input
              type="number"
              min="50"
              step="50"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>
          <span className="text-[10px] text-slate-400">Total batch produce weight</span>
        </div>
      </div>

      {/* Results Breakdown Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white shadow-md mb-4">
        {/* Gross Value */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {t.grossMarketValue}
          </span>
          <p className="text-2xl font-black text-slate-100">
            ₹{grossMarketValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            {quantityKg} kg @ ₹{marketPrice}/kg
          </p>
        </div>

        {/* Transport Cost */}
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5">
          <span className="text-xs font-medium text-amber-300 uppercase tracking-wider">
            {t.estimatedTransportCost}
          </span>
          <p className="text-2xl font-black text-amber-400">
            -₹{totalTransportCost.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            ₹{transportCostPerKg}/kg ({transportPercent}% of gross)
          </p>
        </div>

        {/* Net Realization */}
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5 bg-emerald-900/30 -m-2 p-4 rounded-xl border-emerald-500/30">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {t.netRealization}
          </span>
          <p className="text-3xl font-black text-emerald-300">
            ₹{netRealization.toLocaleString()}
          </p>
          <p className="text-xs font-bold text-emerald-200">
            ≈ ₹{netRealizationPerKg}/kg net realization
          </p>
        </div>
      </div>

      {/* Transparent Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <HelpCircle className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {t.transportDisclaimer}
        </p>
      </div>
    </div>
  );
};
