'use client';

import React, { useState, useEffect } from 'react';
import { Database, Calendar, MapPin } from 'lucide-react';
import { Header } from '../components/Header';
import { FilterPanel } from '../components/FilterPanel';
import { PriceStats } from '../components/PriceStats';
import { PriceChart } from '../components/PriceChart';
import { PricePosition } from '../components/PricePosition';
import { MarketComparison } from '../components/MarketComparison';
import { InsightCard } from '../components/InsightCard';
import { EmptyState } from '../components/EmptyState';
import {
  MarketFilterParams,
  MarketDataResult,
  Language,
} from '../types/market';
import { getMarketData } from '../services/marketService';
import {
  TRANSLATIONS,
  translateCommodity,
  translateDistrict,
  translateMarket,
  formatLocalizedDisplayDate,
} from '../utils/translations';

const DEFAULT_FILTERS: MarketFilterParams = {
  commodity: 'Tomato',
  state: 'Tamil Nadu',
  district: 'Chennai',
  market: 'Koyambedu',
  startDate: '2026-09-01',
  endDate: '2026-09-24',
};

export default function AgriLinkDashboard() {
  const [lang, setLang] = useState<Language>('en');
  const [filters, setFilters] = useState<MarketFilterParams>(DEFAULT_FILTERS);
  const [dataResult, setDataResult] = useState<MarketDataResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const t = TRANSLATIONS[lang];

  // Initial load with default filters
  useEffect(() => {
    let isCancelled = false;
    async function loadInitialData() {
      try {
        const res = await getMarketData(DEFAULT_FILTERS, 'en');
        if (!isCancelled) {
          setDataResult(res);
        }
      } catch (err) {
        console.error('Error loading initial market data:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }
    loadInitialData();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    // Regenerate insights and data results in the selected language
    getMarketData(filters, newLang).then((res) => {
      setDataResult(res);
    });
  };

  const handleFilterSubmit = async (newFilters: MarketFilterParams) => {
    setFilters(newFilters);
    setIsLoading(true);
    try {
      const res = await getMarketData(newFilters, lang);
      setDataResult(res);
    } catch (err) {
      console.error('Error fetching market data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setFilters(DEFAULT_FILTERS);
    setIsLoading(true);
    try {
      const res = await getMarketData(DEFAULT_FILTERS, lang);
      setDataResult(res);
    } catch (err) {
      console.error('Error resetting market data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRecords = dataResult && dataResult.records.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. HEADER */}
      <Header
        currentLanguage={lang}
        onLanguageChange={handleLanguageChange}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 2. PROJECT HERO / INTRO */}
        <section aria-labelledby="hero-title" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>{t.heroBadge}</span>
              </div>

              <h1
                id="hero-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight"
              >
                {t.heroTitle}
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Quick Context Chips */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {translateMarket(filters.market, lang)}, {translateDistrict(filters.district, lang)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {formatLocalizedDisplayDate(filters.startDate, lang)} - {formatLocalizedDisplayDate(filters.endDate, lang)}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* 3. MARKET SEARCH FILTERS */}
        {dataResult && (
          <FilterPanel
            initialFilters={filters}
            availableCommodities={dataResult.availableCommodities}
            availableStates={dataResult.availableStates}
            availableDistricts={dataResult.availableDistricts}
            availableMarkets={dataResult.availableMarkets}
            isLoading={isLoading}
            onFiltersSubmit={handleFilterSubmit}
            lang={lang}
          />
        )}

        {/* 4. DATA STATUS BANNER (DEMO DATA NOTICE) */}
        <section aria-label="Data Source Status" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-amber-950">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-200/80 text-amber-900 font-extrabold text-xs tracking-wider border border-amber-300">
                <Database className="w-3 h-3" />
                <span>{t.demoDataBadge}</span>
              </span>
              <p className="text-xs sm:text-sm font-medium text-amber-900">
                {t.demoDataNotice}
              </p>
            </div>

            <div className="text-[11px] text-amber-800/80 font-medium self-end sm:self-auto">
              {t.demoDataSchemaNote}
            </div>
          </div>
        </section>

        {/* Loading Spinner / Skeleton Overlay */}
        {isLoading && (
          <div
            role="status"
            className="bg-white rounded-2xl border border-emerald-100 p-12 text-center shadow-xs my-6 animate-pulse"
          >
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-emerald-900">
              {t.fetchingData}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t.loadingQueryPrefix} {translateCommodity(filters.commodity, lang)} ({translateMarket(filters.market, lang)})...
            </p>
          </div>
        )}

        {/* 5. MAIN CONTENT AREA */}
        {!isLoading && !hasRecords && (
          <EmptyState onReset={handleResetFilters} lang={lang} />
        )}

        {!isLoading && hasRecords && dataResult.stats && (
          <>
            {/* Active Query Headline */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h2 className="text-base font-bold text-slate-900">
                  {t.marketOverview(translateCommodity(filters.commodity, lang), translateMarket(filters.market, lang))}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {t.daysObserved(dataResult.stats.recordCount)}
              </span>
            </div>

            {/* 5.1 PRICE STATISTICS */}
            <PriceStats stats={dataResult.stats} lang={lang} />

            {/* 5.2 PRICE HISTORY + HISTORICAL TREND */}
            <PriceChart
              records={dataResult.records}
              stats={dataResult.stats}
              marketName={filters.market}
              commodityName={filters.commodity}
              lang={lang}
            />

            {/* 5.3 PRICE RANGE / CONTEXT (Current Price Position) */}
            <PricePosition stats={dataResult.stats} lang={lang} />

            {/* 5.4 MARKET COMPARISON */}
            <MarketComparison
              comparison={dataResult.comparison}
              selectedMarketName={filters.market}
              commodityName={filters.commodity}
              lang={lang}
            />

            {/* 5.5 DATA-BASED INSIGHT */}
            {dataResult.insight && (
              <InsightCard insight={dataResult.insight} lang={lang} />
            )}
          </>
        )}
      </main>

      {/* 6. FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="font-semibold text-slate-700">
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
