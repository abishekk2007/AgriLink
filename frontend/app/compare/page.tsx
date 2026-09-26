'use client';

import React, { useState, useEffect } from 'react';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Building2,
  Truck,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { Header } from '../../components/Header';
import { Language } from '../../types/market';
import { TRANSLATIONS, translateCommodity, translateMarket } from '../../utils/translations';
import { compareMarkets, ComparisonItem } from '../../lib/api/marketApi';
import { getMockComparison } from '../../lib/mock/marketData';

export default function CompareMarketsPage() {
  const [lang, setLang] = useState<Language>('en');
  const [commodity, setCommodity] = useState<string>('Tomato');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([
    'Koyambedu',
    'Coimbatore',
    'Madurai',
    'Salem',
  ]);
  const [distanceKm, setDistanceKm] = useState<number>(50);
  const [transportRate, setTransportRate] = useState<number>(12);
  const [quantityKg, setQuantityKg] = useState<number>(1000);

  const [comparisonData, setComparisonData] = useState<ComparisonItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  const availableMarketsList = [
    { name: 'Koyambedu', district: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
    { name: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
    { name: 'Salem', district: 'Salem', state: 'Tamil Nadu' },
    { name: 'Ottanchatram (Dindigul)', district: 'Dindigul', state: 'Tamil Nadu' },
    { name: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { name: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu' },
    { name: 'Kolar', district: 'Kolar', state: 'Karnataka' },
    { name: 'Yeshwanthpur', district: 'Bengaluru Urban', state: 'Karnataka' },
    { name: 'Lasalgaon', district: 'Nashik', state: 'Maharashtra' },
    { name: 'Pune (Gultekdi)', district: 'Pune', state: 'Maharashtra' },
  ];

  const fetchComparison = async () => {
    setIsLoading(true);
    try {
      const res = await compareMarkets({
        commodity,
        markets: selectedMarkets.join(','),
        distanceKm,
        transportRatePerKm: transportRate,
        quantityKg,
      });

      if (res && res.comparison) {
        setComparisonData(res.comparison);
        setIsDemo(false);
      }
    } catch (err: any) {
      console.warn('Compare API fallback to mock:', err);
      const mock = getMockComparison(commodity);
      setComparisonData(mock.comparison);
      setIsDemo(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [commodity, selectedMarkets, distanceKm, transportRate, quantityKg]);

  const toggleMarket = (marketName: string) => {
    if (selectedMarkets.includes(marketName)) {
      if (selectedMarkets.length > 2) {
        setSelectedMarkets(selectedMarkets.filter((m) => m !== marketName));
      }
    } else {
      setSelectedMarkets([...selectedMarkets, marketName]);
    }
  };

  // Metrics
  const prices = comparisonData.map((c) => c.latestPrice);
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const priceDifference = Math.round((highestPrice - lowestPrice) * 10) / 10;
  const highestItem = comparisonData.find((c) => c.latestPrice === highestPrice);
  const lowestItem = comparisonData.find((c) => c.latestPrice === lowestPrice);

  // Prepare chart data
  const chartData = comparisonData.map((item) => ({
    marketName: translateMarket(item.marketName, lang),
    latestPrice: item.latestPrice,
    netRealization: item.netRealization || item.latestPrice,
    avgPrice: item.avgPrice,
  }));

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#0d9488', '#14b8a6'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header currentLanguage={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <section aria-labelledby="compare-title" className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold uppercase tracking-wider mb-2.5">
                <Scale className="w-3.5 h-3.5 text-teal-700" />
                <span>Regional Mandi Arbitrage & Comparison</span>
              </div>
              <h1 id="compare-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
                {t.marketComparison}
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
                Neutral, multi-APMC price comparison factoring in estimated haulage costs to compute realistic net realization.
              </p>
            </div>

            <div className="text-xs text-slate-500 font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              {t.marketsTracked(comparisonData.length)}
            </div>
          </div>
        </section>

        {/* Commodity & Market Selection Bar */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Commodity dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">
                {t.crop}:
              </label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20"
              >
                {['Tomato', 'Onion', 'Potato', 'Rice (Paddy)', 'Wheat', 'Green Chilli', 'Maize'].map((c) => (
                  <option key={c} value={c}>
                    {translateCommodity(c, lang)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selection Guidance */}
            <span className="text-xs text-slate-500">
              Select 2 or more APMCs to compare:
            </span>
          </div>

          {/* Market Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {availableMarketsList.map((m) => {
              const isSelected = selectedMarkets.includes(m.name);
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => toggleMarket(m.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {translateMarket(m.name, lang)}
                  <span className="ml-1 text-[10px] opacity-75">({m.district})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transport Net Realization Adjustment Inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
              Transport Realization Adjuster (Optional)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Avg Distance (km):
              </label>
              <input
                type="number"
                min="0"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Rate (₹/km):
              </label>
              <input
                type="number"
                min="0"
                value={transportRate}
                onChange={(e) => setTransportRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Produce Quantity (kg):
              </label>
              <input
                type="number"
                min="100"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Price Difference Spotlight Card */}
        {highestItem && lowestItem && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Highest Mandi Price
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ₹{highestPrice}
              </p>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">
                {highestItem.marketName} ({highestItem.districtName})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Lowest Mandi Price
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ₹{lowestPrice}
              </p>
              <p className="text-xs text-amber-700 font-bold mt-0.5">
                {lowestItem.marketName} ({lowestItem.districtName})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-xs">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                Spread / Difference
              </span>
              <p className="text-2xl font-black text-white mt-1">
                ₹{priceDifference}
              </p>
              <p className="text-xs text-emerald-200 font-medium mt-0.5">
                Potential gross difference before transport
              </p>
            </div>
          </div>
        )}

        {/* Recharts Bar Chart: Market vs Price */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-8">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                Market vs Price Comparison (₹/kg)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Gross Rate vs Net Realization
            </span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="marketName"
                  stroke="#64748b"
                  fontSize={11}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} tickLine={false} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `₹${value}`,
                    name === 'latestPrice' ? 'Gross APMC Price' : 'Est. Net Realization',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="latestPrice" name="Gross APMC Price" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="netRealization" name="Est. Net Realization" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Mandi Detailed Price Comparison Table
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Market / APMC</th>
                  <th className="py-3 px-4">District & State</th>
                  <th className="py-3 px-4 text-right">Latest Price</th>
                  <th className="py-3 px-4 text-right">Min Price</th>
                  <th className="py-3 px-4 text-right">Max Price</th>
                  <th className="py-3 px-4 text-right">Average</th>
                  <th className="py-3 px-4 text-right">Net Realization</th>
                  <th className="py-3 px-4 text-right">Trend Change</th>
                  <th className="py-3 px-4 text-center">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {comparisonData.map((item) => (
                  <tr key={item.marketId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {translateMarket(item.marketName, lang)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.districtName}, {item.stateName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      ₹{item.latestPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      ₹{item.minPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      ₹{item.maxPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      ₹{item.avgPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      ₹{item.netRealization ?? item.latestPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        item.priceChange >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {item.priceChange >= 0 ? '+' : ''}{item.priceChange}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400 text-[11px]">
                      {item.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Neutral Comparison Guidance Note */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Neutral Comparison Principle:</strong> Higher mandi prices in distant APMCs do not necessarily guarantee higher farmer profits. Extra transportation mileage, road tolls, handling charges, and produce weight shrinkage can offset nominal price premiums.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="font-bold text-slate-800">
            {t.footerRights}
          </p>
          <p className="max-w-2xl mx-auto text-[11px] leading-relaxed text-slate-500">
            {t.footerDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
