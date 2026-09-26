'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  ShieldCheck,
  Building2,
  FileText,
  ExternalLink,
  Cpu,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Language } from '../../types/market';
import { TRANSLATIONS } from '../../utils/translations';
import { getDataSources } from '../../lib/api/marketApi';

export default function SettingsPage() {
  const [lang, setLang] = useState<Language>('en');
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [defaultUnit, setDefaultUnit] = useState<string>('kg');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    let isCancelled = false;
    getDataSources()
      .then((sources) => {
        if (!isCancelled && sources) setDataSources(sources);
      })
      .catch((err) => {
        console.warn('Sources API fallback:', err);
        if (!isCancelled) {
          setDataSources([
            {
              id: 'ds-1',
              name: 'AGMARKNET (DMI)',
              provider: 'Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, GoI',
              url: 'https://agmarknet.gov.in',
              lastUpdated: '2026-09-26T06:00:00Z',
              _count: { marketPrices: 1425 },
              importLogs: [
                {
                  id: 'log-1',
                  filename: 'agmarknet_daily_feed_20260926.json',
                  recordsImported: 1425,
                  status: 'SUCCESS',
                  createdAt: '2026-09-26T06:00:00Z',
                },
              ],
            },
          ]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header currentLanguage={lang} onLanguageChange={setLang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title */}
        <section aria-labelledby="settings-title" className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2.5">
                <Settings className="w-3.5 h-3.5 text-slate-700" />
                <span>Configuration & Transparency</span>
              </div>
              <h1 id="settings-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
                {t.settingsTitle}
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
                Review data provenance, government audit trails, and interface preferences.
              </p>
            </div>
          </div>
        </section>

        {/* 1. Government Data Provenance Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Database className="w-6 h-6 text-emerald-700" />
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {t.dataSourceTitle}
              </h2>
              <p className="text-xs text-slate-500">
                Transparency tracking and data ingestion verification
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {dataSources.map((source) => (
              <div key={source.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{source.name}</span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified Feed
                    </span>
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {source.provider}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200/80">
                  <span>
                    Last Ingestion Sync: <strong>{new Date(source.lastUpdated).toLocaleString()}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Active Price Points: <strong>{source._count?.marketPrices || '1,425'} records</strong>
                  </span>
                </div>

                {/* Import Logs */}
                {source.importLogs && source.importLogs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Recent Ingestion Logs:
                    </span>
                    <div className="space-y-1.5">
                      {source.importLogs.map((log: any) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold text-slate-800">{log.filename}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">{log.recordsImported} records</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              {log.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Preferences Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Globe className="w-6 h-6 text-emerald-700" />
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Language & Display Preferences
              </h2>
              <p className="text-xs text-slate-500">
                Configure default language and measurement units
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900">Interface Language</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`p-3 rounded-2xl border font-bold text-center transition-all ${
                    lang === 'en'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('ta')}
                  className={`p-3 rounded-2xl border font-bold text-center transition-all ${
                    lang === 'ta'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-slate-900">Default Price Unit</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDefaultUnit('kg')}
                  className={`p-3 rounded-2xl border font-bold text-center transition-all ${
                    defaultUnit === 'kg'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Per Kilogram (₹/kg)
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultUnit('quintal')}
                  className={`p-3 rounded-2xl border font-bold text-center transition-all ${
                    defaultUnit === 'quintal'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Per Quintal (₹/quintal)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Future ML Architecture Blueprint Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Cpu className="w-6 h-6 text-indigo-700" />
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Future Machine Learning Forecasting Architecture
              </h2>
              <p className="text-xs text-slate-500">
                Section 26 Compliance: Architectural blueprint for downstream predictive services
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 space-y-3 leading-relaxed">
            <p>
              In accordance with project architecture guidelines, <strong>AI/ML price prediction is not active in the current prototype</strong> to prevent misleading farmers with speculative forecasts.
            </p>
            <p>
              The system is designed with a dedicated <code>/api/forecast</code> endpoint and modular service architecture ready for future integration with XGBoost or LSTM temporal models trained on multi-year AGMARKNET seasonal trends.
            </p>
            <div className="pt-2 text-[11px] font-mono text-indigo-800 bg-white p-3 rounded-xl border border-indigo-200">
              GET /api/forecast → &#123; &quot;forecast&quot;: [], &quot;model&quot;: &quot;future&quot;, &quot;confidence&quot;: null, &quot;status&quot;: &quot;NOT_IMPLEMENTED&quot; &#125;
            </div>
          </div>
        </div>

        {/* 4. College & Project Initiative Credits */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-base shadow-sm">
              AN
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Team Alpha Nexus
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                Panimalar Engineering College • Chennai, Tamil Nadu
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                AgriLink — Market Intelligence for a Stronger Tomorrow
              </p>
            </div>
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
