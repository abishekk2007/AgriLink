'use client';

import React, { useState, useEffect } from 'react';
import { Database, Calendar, MapPin, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Header } from '../../components/Header';
import { FilterPanel } from '../../components/FilterPanel';
import { PriceStats } from '../../components/PriceStats';
import { PriceChart } from '../../components/PriceChart';
import { PricePosition } from '../../components/PricePosition';
import { InsightCard } from '../../components/InsightCard';
import { EmptyState } from '../../components/EmptyState';
import { TransportCalculator } from '../../components/TransportCalculator';
import { MspCard } from '../../components/MspCard';
import { WhatsAppShareButton } from '../../components/WhatsAppShareButton';
import {
  MarketFilterParams,
  MarketDataResult,
  Language,
} from '../../types/market';
import { getMarketPrices, MarketPriceResponse } from '../../lib/api/marketApi';
import { getMockMarketPrices } from '../../lib/mock/marketData';
import {
  TRANSLATIONS,
  translateCommodity,
  translateDistrict,
  translateMarket,
  formatLocalizedDisplayDate,
} from '../../utils/translations';

const DEFAULT_FILTERS: MarketFilterParams = {
  commodity: 'Tomato',
  state: 'Tamil Nadu',
  district: 'Chennai',
  market: 'Koyambedu',
  startDate: '2026-09-01',
  endDate: '2026-09-26',
};

export default function MarketPricesWorkspace() {
  const [lang, setLang] = useState<Language>('en');
  const [filters, setFilters] = useState<MarketFilterParams>(DEFAULT_FILTERS);
  const [marketResponse, setMarketResponse] = useState<MarketPriceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingDemoData, setIsUsingDemoData] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const fetchMarketData = async (params: MarketFilterParams) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getMarketPrices({
        commodity: params.commodity,
        state: params.state,
        district: params.district,
        market: params.market,
        startDate: params.startDate,
        endDate: params.endDate,
        lang,
      });

      setMarketResponse(res);
      setIsUsingDemoData(false);
    } catch (err: any) {
      console.warn('API fetch failed, falling back to mock dataset:', err.message);
      const fallback = getMockMarketPrices(params.commodity, params.market, 26);
      setMarketResponse(fallback);
      setIsUsingDemoData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(DEFAULT_FILTERS);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    fetchMarketData(filters);
  };

  const handleFilterSubmit = (newFilters: MarketFilterParams) => {
    setFilters(newFilters);
    fetchMarketData(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    fetchMarketData(DEFAULT_FILTERS);
  };

  const hasRecords = marketResponse && marketResponse.records && marketResponse.records.length > 0;

  // Convert API format to components format
  const formattedRecords = hasRecords
    ? marketResponse.records.map((r, i) => ({
        id: r.id || `rec-${i}`,
        date: r.date,
        commodity: r.commodity,
        market: r.market,
        district: r.district,
        state: r.state,
        variety: 'APMC Graded',
        minPrice: r.minPrice,
        maxPrice: r.maxPrice,
        modalPrice: r.modalPrice,
      }))
    : [];

  const formattedStats = marketResponse?.stats
    ? {
        latestPrice: marketResponse.stats.latestPrice,
        minPrice: marketResponse.stats.minPrice,
        maxPrice: marketResponse.stats.maxPrice,
        avgPrice: marketResponse.stats.avgPrice,
        firstPrice: formattedRecords[0]?.modalPrice || marketResponse.stats.latestPrice,
        priceChangeAmount: Math.round((marketResponse.stats.latestPrice - (formattedRecords[0]?.modalPrice || marketResponse.stats.latestPrice)) * 10) / 10,
        priceChangePercent: marketResponse.stats.percentageChange,
        trendDirection: (marketResponse.stats.trend.toLowerCase() as 'up' | 'down' | 'stable') || 'stable',
        recordCount: marketResponse.stats.recordCount,
        lowestDate: marketResponse.stats.firstDate,
        peakDate: marketResponse.stats.latestDate,
        pricePositionPercent: marketResponse.stats.percentile,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header currentLanguage={lang} onLanguageChange={handleLanguageChange} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Workspace Headline */}
        <section aria-labelledby="workspace-title" className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>{isUsingDemoData ? 'DEMO DATA' : 'AGMARKNET LIVE'}</span>
              </div>

              <h1
                id="workspace-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight"
              >
                Market Prices Workspace
              </h1>

              <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
                Query official mandi modal, min, and max price records with deterministic statistical analysis.
              </p>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs text-slate-600 font-bold">
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {translateMarket(filters.market, lang)}, {translateDistrict(filters.district, lang)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {formatLocalizedDisplayDate(filters.startDate, lang)} - {formatLocalizedDisplayDate(filters.endDate, lang)}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Filter Panel with Voice Search */}
        <FilterPanel
          initialFilters={filters}
          availableCommodities={['Tomato', 'Onion', 'Potato', 'Rice (Paddy)', 'Wheat', 'Green Chilli', 'Maize']}
          availableStates={['Tamil Nadu', 'Karnataka', 'Maharashtra']}
          availableDistricts={{
            'Tamil Nadu': ['Chennai', 'Madurai', 'Coimbatore', 'Salem', 'Dindigul', 'Tiruchirappalli', 'Thanjavur'],
            'Karnataka': ['Bengaluru Urban', 'Kolar'],
            'Maharashtra': ['Pune', 'Nashik'],
          }}
          availableMarkets={{
            'Chennai': ['Koyambedu', 'Red Hills'],
            'Madurai': ['Madurai'],
            'Coimbatore': ['Coimbatore'],
            'Salem': ['Salem'],
            'Dindigul': ['Ottanchatram (Dindigul)'],
            'Tiruchirappalli': ['Tiruchirappalli'],
            'Thanjavur': ['Thanjavur'],
            'Bengaluru Urban': ['Yeshwanthpur'],
            'Kolar': ['Kolar'],
            'Pune': ['Pune (Gultekdi)'],
            'Nashik': ['Lasalgaon'],
          }}
          isLoading={isLoading}
          onFiltersSubmit={handleFilterSubmit}
          lang={lang}
        />

        {/* Data Status Banner */}
        <section aria-label="Data Source Status" className="mb-6">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs font-semibold ${
            isUsingDemoData
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isUsingDemoData ? 'bg-amber-200 text-amber-900 border border-amber-300' : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
              }`}>
                {isUsingDemoData ? <Database className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                <span>{isUsingDemoData ? 'Demo Fallback' : 'AGMARKNET Direct'}</span>
              </span>
              <p>
                {isUsingDemoData
                  ? 'Showing offline demonstration dataset. Backend PostgreSQL is available for production queries.'
                  : 'Real government mandi market price records from AGMARKNET & Open Government Data Platform India.'}
              </p>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Deterministic calculations • No AI black-box
            </div>
          </div>
        </section>

        {/* Loading Spinner */}
        {isLoading && (
          <div
            role="status"
            className="bg-white rounded-2xl border border-emerald-100 p-12 text-center shadow-xs my-6 animate-pulse"
          >
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-emerald-900">
              {t.fetchingData}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t.loadingQueryPrefix} {translateCommodity(filters.commodity, lang)} ({translateMarket(filters.market, lang)})...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasRecords && (
          <EmptyState onReset={handleResetFilters} lang={lang} />
        )}

        {/* Active Market Workspace Content */}
        {!isLoading && hasRecords && formattedStats && (
          <>
            {/* Active Query Headline & WhatsApp Share */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse"></span>
                <h2 className="text-lg font-black text-slate-900">
                  {t.marketOverview(translateCommodity(filters.commodity, lang), translateMarket(filters.market, lang))}
                </h2>
                <span className="text-xs text-slate-500 font-medium ml-2">
                  ({t.daysObserved(formattedStats.recordCount)})
                </span>
              </div>

              {/* WhatsApp Share Button */}
              <WhatsAppShareButton
                crop={translateCommodity(filters.commodity, lang)}
                market={translateMarket(filters.market, lang)}
                latestPrice={formattedStats.latestPrice}
                avgPrice={formattedStats.avgPrice}
                percentageChange={formattedStats.priceChangePercent}
                unit={marketResponse?.commodity?.defaultUnit || '₹/kg'}
                lang={lang}
              />
            </div>

            {/* 1. Price Statistics Cards */}
            <PriceStats stats={formattedStats} lang={lang} />

            {/* 2. Price History Line Chart */}
            <PriceChart
              records={formattedRecords}
              stats={formattedStats}
              marketName={filters.market}
              commodityName={filters.commodity}
              lang={lang}
            />

            {/* 3. Price Position & Percentile Gauge */}
            <PricePosition stats={formattedStats} lang={lang} />

            {/* 4. MSP Benchmark Card (if available) */}
            {marketResponse?.msp && (
              <MspCard
                commodityName={filters.commodity}
                currentPrice={formattedStats.latestPrice}
                mspData={marketResponse.msp}
                lang={lang}
              />
            )}

            {/* 5. Transport Net Realization Calculator */}
            <TransportCalculator
              baseMarketPrice={formattedStats.latestPrice}
              unit={marketResponse?.commodity?.defaultUnit || '₹/kg'}
              lang={lang}
            />

            {/* 6. Deterministic Rule-Based Insights Card */}
            {marketResponse?.insight && (
              <InsightCard
                insight={{
                  headline: (marketResponse.insight.insights && marketResponse.insight.insights[0]) || 'Deterministic Statistical Observations',
                  trendInsight: (marketResponse.insight.insights && marketResponse.insight.insights[1]) || `Observed trend: ${marketResponse.insight.trend}`,
                  peakInsight: `Observed period range: Min ₹${formattedStats.minPrice} to Max ₹${formattedStats.maxPrice}`,
                  comparisonInsight: (marketResponse.insight.insights && marketResponse.insight.insights[2]) || 'Trading within established historical bands.',
                  spreadInsight: `Volatility Index: ${marketResponse.insight.volatility || 'LOW'}. Rule-based observation without forecasting.`,
                }}
                lang={lang}
              />
            )}
          </>
        )}
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
          <div className="pt-2 text-[10px] text-slate-400">
            {t.footerTech}
          </div>
        </div>
      </footer>
    </div>
  );
}
