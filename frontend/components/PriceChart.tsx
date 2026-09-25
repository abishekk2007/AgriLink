'use client';

import React, { useSyncExternalStore } from 'react';
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart2 } from 'lucide-react';
import { MarketRecord, PriceStatistics, Language } from '../types/market';
import {
  TRANSLATIONS,
  translateCommodity,
  translateMarket,
  formatLocalizedShortDate,
  formatLocalizedDisplayDate,
} from '../utils/translations';

interface TooltipPayloadItem {
  payload: {
    date: string;
    displayDate: string;
    fullDate: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  typicalPriceLabel?: string;
  recordedRangeLabel?: string;
  unit?: string;
}

// Standalone tooltip component declared outside render
const CustomChartTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  typicalPriceLabel,
  recordedRangeLabel,
  unit = '₹/kg',
}) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-semibold text-slate-300 pb-1.5 border-b border-slate-800 flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-emerald-400" />
          <span>{data.fullDate}</span>
        </p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-300 font-medium">
              {typicalPriceLabel || 'Typical Market Price'}:
            </span>
            <span className="font-bold text-emerald-400 text-sm">
              ₹{data.modalPrice} {unit}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>{recordedRangeLabel || 'Recorded Range:'}</span>
            <span>
              ₹{data.minPrice} - ₹{data.maxPrice} {unit}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface PriceChartProps {
  records: MarketRecord[];
  stats: PriceStatistics;
  marketName: string;
  commodityName: string;
  lang: Language;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  records,
  stats,
  marketName,
  commodityName,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Standard safe hydration check without cascading setState in useEffect
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Format chart data with localized dates
  const chartData = records.map((record) => ({
    date: record.date,
    displayDate: formatLocalizedShortDate(record.date, lang),
    fullDate: formatLocalizedDisplayDate(record.date, lang),
    modalPrice: record.modalPrice,
    minPrice: record.minPrice,
    maxPrice: record.maxPrice,
  }));

  // Min and max for Y-Axis bounds with breathing room
  const yMin = Math.max(0, Math.floor(stats.minPrice * 0.85));
  const yMax = Math.ceil(stats.maxPrice * 1.15);

  const localizedCrop = translateCommodity(commodityName, lang);
  const localizedMarket = translateMarket(marketName, lang);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-6 mb-8 transition-shadow hover:shadow-md">
      {/* Title & Market Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.priceHistory}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.priceHistorySubtitle(localizedCrop, localizedMarket)}
          </p>
        </div>

        {/* Historical Price Trend Box */}
        <div className="self-start sm:self-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t.historicalTrend}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {stats.trendDirection === 'up' && (
                <>
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800">
                    {t.upwardTrendText(stats.priceChangePercent)}
                  </span>
                </>
              )}
              {stats.trendDirection === 'down' && (
                <>
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-amber-800">
                    {t.downwardTrendText(stats.priceChangePercent)}
                  </span>
                </>
              )}
              {stats.trendDirection === 'stable' && (
                <>
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Minus className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {t.stableTrendText(stats.priceChangePercent)}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block pl-3 border-l border-slate-200 text-[11px] text-slate-500 font-medium">
            ₹{stats.firstPrice} → ₹{stats.latestPrice} {t.kgUnit}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80 lg:h-96">
        {!isMounted ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
            <span className="text-xs text-slate-400">{t.fetchingData}</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[yMin, yMax]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                content={
                  <CustomChartTooltip
                    typicalPriceLabel={t.typicalMarketPrice}
                    recordedRangeLabel={t.recordedRange}
                    unit={t.kgUnit}
                  />
                }
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                formatter={(value) => (
                  <span className="text-slate-700 font-medium text-xs">
                    {value === 'modalPrice' ? t.typicalMarketPrice : value}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="modalPrice"
                fill="url(#modalGradient)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="modalPrice"
                name="modalPrice"
                stroke="#047857"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#047857', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#065f46', strokeWidth: 2, stroke: '#ffffff' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Transparent Trend Explanation Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <p className="font-medium">
          {t.chartCalculationNote(stats.firstPrice, stats.latestPrice)}
        </p>
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium self-start sm:self-auto">
          {t.chartModalDefinition}
        </span>
      </div>
    </div>
  );
};
