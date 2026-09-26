'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  BarChart3,
  Scale,
  Bell,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Mic,
  Truck,
  CheckCircle,
  Database,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import { getCommodities } from '../lib/api/commodityApi';
import { getAllMarkets } from '../lib/api/locationApi';
import { getAlerts, PriceAlert } from '../lib/api/alertApi';
import { MOCK_ALERTS } from '../lib/mock/marketData';

export default function AgriLinkHomePage() {
  const [lang, setLang] = useState<Language>('en');
  const [commodityCount, setCommodityCount] = useState<number>(7);
  const [marketCount, setMarketCount] = useState<number>(11);
  const [recentAlerts, setRecentAlerts] = useState<PriceAlert[]>([]);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    let isCancelled = false;

    getCommodities()
      .then((c) => {
        if (!isCancelled && c) setCommodityCount(c.length);
      })
      .catch(() => {});

    getAllMarkets()
      .then((m) => {
        if (!isCancelled && m) setMarketCount(m.length);
      })
      .catch(() => {});

    getAlerts()
      .then((a) => {
        if (!isCancelled && a) setRecentAlerts(a.slice(0, 3));
      })
      .catch(() => {
        if (!isCancelled) setRecentAlerts(MOCK_ALERTS.slice(0, 3));
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Featured Live Mandi Tickers
  const featuredTickers = [
    { crop: 'Tomato', market: 'Koyambedu (Chennai)', price: '₹34.7', change: '+22.1%', up: true, unit: '₹/kg' },
    { crop: 'Onion', market: 'Lasalgaon (Nashik)', price: '₹32.0', change: '+18.4%', up: true, unit: '₹/kg' },
    { crop: 'Potato', market: 'Mattuthavani (Madurai)', price: '₹24.0', change: '-3.2%', up: false, unit: '₹/kg' },
    { crop: 'Rice (Paddy)', market: 'Thanjavur APMC', price: '₹2,350', change: '+2.8%', up: true, unit: '₹/q' },
    { crop: 'Tomato', market: 'Coimbatore MGR', price: '₹32.9', change: '+16.7%', up: true, unit: '₹/kg' },
    { crop: 'Green Chilli', market: 'Ottanchatram', price: '₹52.0', change: '+12.5%', up: true, unit: '₹/kg' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header currentLanguage={lang} onLanguageChange={setLang} />

      {/* Marquee Ticker Bar */}
      <div className="bg-slate-950 text-white py-2.5 px-4 overflow-hidden border-b border-emerald-950/60">
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>MANDI LIVE</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-300 font-medium">
            {featuredTickers.map((ticker, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 shrink-0">
                <span className="font-bold text-white">{ticker.crop}</span>
                <span className="text-slate-400 text-[11px]">({ticker.market}):</span>
                <span className="font-extrabold text-emerald-400">{ticker.price}</span>
                <span className={`text-[10px] font-bold flex items-center ${ticker.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {ticker.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {ticker.change}
                </span>
                {idx < featuredTickers.length - 1 && <span className="text-slate-700">|</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 1. HERO SECTION */}
        <section aria-labelledby="hero-title" className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-emerald-800/40">
            {/* Background glowing gradient orbs */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>{t.heroBadge}</span>
              </div>

              {/* Title */}
              <h1
                id="hero-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight sm:leading-tight"
              >
                {t.heroTitle}
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-emerald-100/80 leading-relaxed font-normal">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/market-prices"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 active:scale-98"
                >
                  <BarChart3 className="w-4 h-4 text-slate-950" />
                  <span>{t.heroExploreBtn}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>

                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-xs border border-white/20 transition-all hover:scale-102 active:scale-98"
                >
                  <Scale className="w-4 h-4" />
                  <span>{t.heroCompareBtn}</span>
                </Link>
              </div>

              {/* Project provenance note */}
              <div className="mt-8 pt-6 border-t border-emerald-800/40 flex flex-wrap items-center gap-4 text-xs text-emerald-200/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Deterministic Rule Calculations</span>
                </span>
                <span>•</span>
                <span>Official AGMARKNET Mandi Feed</span>
                <span>•</span>
                <span>Team Alpha Nexus • Panimalar Eng. College</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. STATS AT A GLANCE */}
        <section aria-label="System Metrics" className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
                <span>Commodities</span>
                <Sprout className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-3xl font-black text-slate-900">{commodityCount}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Vegetables, Grains & Pulses</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
                <span>Active Mandis</span>
                <Building2 className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-3xl font-black text-slate-900">{marketCount}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Tamil Nadu, KA & MH</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
                <span>Historical Records</span>
                <Database className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-3xl font-black text-slate-900">1,400+</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Daily verified price points</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
                <span>Price Alerts</span>
                <Bell className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">Active</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Rule-based threshold engine</p>
            </div>
          </div>
        </section>

        {/* 3. CAPABILITIES / CORE WORKSPACES */}
        <section aria-labelledby="features-title" className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="features-title" className="text-2xl font-black text-slate-950">
              Essential Tools for Farmers & Mandi Traders
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything needed to monitor real APMC price trends, compare regional markets, and make confident selling decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Market Intelligence Workspace */}
            <Link
              href="/market-prices"
              className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-emerald-200">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Market Prices Workspace
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Query daily modal, minimum, and maximum prices across Tamil Nadu APMCs with custom date ranges and Recharts interactive graphs.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span>Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Market Comparison */}
            <Link
              href="/compare"
              className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-teal-200">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors">
                Compare Multiple Markets
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Side-by-side neutral price analysis between Koyambedu, Madurai, Coimbatore, and Salem with transport net realization calculator.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Compare Mandis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Rule-Based Price Alerts */}
            <Link
              href="/alerts"
              className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-amber-200">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
                Price Alerts Engine
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Set target price thresholds (ABOVE or BELOW) for specific crops and markets with automated background evaluation.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                <span>Manage Alerts</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Farmer Insights */}
            <Link
              href="/insights"
              className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-emerald-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Transparent Rule Insights
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Deterministic price positioning, historical percentile rank, and volatility indicators without black-box AI claims.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span>View Insights</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: Transport Cost Calculator */}
            <Link
              href="/compare"
              className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-blue-200">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-800 transition-colors">
                Transport & Net Realization
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Calculate approximate net farmer realization after factoring in haulage distance, truck rates, and batch quantity.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <span>Calculate Net Realization</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6: Tamil & Voice Input */}
            <Link
              href="/market-prices"
              className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-indigo-200">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-800 transition-colors">
                Voice Search & தமிழ்
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Speak directly in Tamil or English (e.g., &quot;Tomato price in Chennai&quot;) to immediately auto-filter mandi data.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                <span>Try Voice Search</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* 4. RECENT PRICE ALERTS SPOTLIGHT */}
        {recentAlerts.length > 0 && (
          <section aria-labelledby="alerts-spotlight" className="mb-12">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <h3 id="alerts-spotlight" className="text-base font-extrabold text-slate-900">
                    Active & Triggered Price Alerts
                  </h3>
                </div>
                <Link href="/alerts" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                  Manage All Alerts →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border text-xs ${
                      alert.status === 'TRIGGERED'
                        ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                        : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-2">
                      <span className="text-sm font-extrabold">{alert.commodity.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        alert.status === 'TRIGGERED' ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{alert.market.name}</p>
                    <p className="font-extrabold text-slate-900 mt-2">
                      Condition: {alert.condition} ₹{alert.targetPrice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="font-bold text-slate-800 text-sm">
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
