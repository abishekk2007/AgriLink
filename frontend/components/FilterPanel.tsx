'use client';

import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Filter, Mic, MicOff, Sparkles } from 'lucide-react';
import { CropSelector } from './CropSelector';
import { LocationSelector } from './LocationSelector';
import { DateRangeSelector } from './DateRangeSelector';
import { MarketFilterParams, Language } from '../types/market';
import {
  TRANSLATIONS,
  translateCommodity,
  translateMarket,
} from '../utils/translations';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface FilterPanelProps {
  initialFilters: MarketFilterParams;
  availableCommodities: string[];
  availableStates: string[];
  availableDistricts: Record<string, string[]>;
  availableMarkets: Record<string, string[]>;
  isLoading: boolean;
  onFiltersSubmit: (filters: MarketFilterParams) => void;
  lang: Language;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  initialFilters,
  availableCommodities,
  availableStates,
  availableDistricts,
  availableMarkets,
  isLoading,
  onFiltersSubmit,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const [formData, setFormData] = useState<MarketFilterParams>(initialFilters);
  const [dateError, setDateError] = useState<string | null>(null);
  const [activeDatePreset, setActiveDatePreset] = useState<number | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Voice Search hook
  const { isListening, isSupported, transcript, startListening, stopListening } =
    useSpeechRecognition((parsed) => {
      setVoiceNotice(`Recognized: "${parsed.rawTranscript}"`);

      setFormData((prev) => {
        const next = { ...prev };
        if (parsed.matchedCommodity) next.commodity = parsed.matchedCommodity;
        if (parsed.matchedState) next.state = parsed.matchedState;
        if (parsed.matchedDistrict) next.district = parsed.matchedDistrict;
        if (parsed.matchedMarket) next.market = parsed.matchedMarket;
        return next;
      });
    });

  const handleCropChange = (crop: string) => {
    setFormData((prev) => ({ ...prev, commodity: crop }));
  };

  const handleStateChange = (
    state: string,
    nextDistrict: string,
    nextMarket: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      state,
      district: nextDistrict,
      market: nextMarket,
    }));
  };

  const handleDistrictChange = (district: string, nextMarket: string) => {
    setFormData((prev) => ({
      ...prev,
      district,
      market: nextMarket,
    }));
  };

  const handleMarketChange = (market: string) => {
    setFormData((prev) => ({ ...prev, market }));
  };

  const handleStartDateChange = (date: string) => {
    setActiveDatePreset(null);
    setFormData((prev) => ({ ...prev, startDate: date }));
    if (formData.endDate && date > formData.endDate) {
      setDateError(t.dateError);
    } else {
      setDateError(null);
    }
  };

  const handleEndDateChange = (date: string) => {
    setActiveDatePreset(null);
    setFormData((prev) => ({ ...prev, endDate: date }));
    if (formData.startDate && formData.startDate > date) {
      setDateError(t.dateError);
    } else {
      setDateError(null);
    }
  };

  const handlePresetDays = (days: number) => {
    setActiveDatePreset(days);
    const end = new Date('2026-09-26T00:00:00Z');
    const start = new Date(end);
    start.setDate(start.getDate() - days);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    setDateError(null);
    setFormData((prev) => ({
      ...prev,
      startDate: startStr,
      endDate: endStr,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.startDate > formData.endDate) {
      setDateError(t.dateError);
      return;
    }

    setDateError(null);
    onFiltersSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-6 mb-8 transition-shadow hover:shadow-md">
      {/* Header bar of filter card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Filter className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.marketSearch}
            </h2>
            <p className="text-xs text-slate-500">
              {t.marketSearchDesc}
            </p>
          </div>
        </div>

        {/* Voice Search Button & Status */}
        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              type="button"
              onClick={() => {
                if (isListening) stopListening();
                else startListening(lang === 'ta' ? 'ta-IN' : 'en-IN');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isListening
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
              title={t.voiceSearchBtn}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>{t.listening}</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>{t.voiceSearchBtn}</span>
                </>
              )}
            </button>
          )}

          {/* Current Selection summary pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>{translateCommodity(formData.commodity, lang)}</span>
            <span className="text-slate-300">•</span>
            <span>{translateMarket(formData.market, lang)}</span>
          </div>
        </div>
      </div>

      {/* Voice feedback banner if active */}
      {voiceNotice && (
        <div className="mb-4 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{voiceNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceNotice(null)}
            className="text-slate-400 hover:text-slate-600 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Quick Date Window Presets */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider shrink-0">
            Presets:
          </span>
          {[
            { days: 7, label: 'Last 7 Days' },
            { days: 30, label: 'Last 30 Days' },
            { days: 90, label: 'Last 90 Days' },
          ].map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() => handlePresetDays(preset.days)}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                activeDatePreset === preset.days
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Responsive Grid for fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Crop */}
          <CropSelector
            label={t.crop}
            selectedCrop={formData.commodity}
            commodities={availableCommodities}
            onChange={handleCropChange}
            disabled={isLoading}
            lang={lang}
          />

          {/* 2, 3, 4. Location Selector (State, District, Market) */}
          <LocationSelector
            stateLabel={t.state}
            districtLabel={t.district}
            marketLabel={t.market}
            selectedState={formData.state}
            selectedDistrict={formData.district}
            selectedMarket={formData.market}
            availableStates={availableStates}
            availableDistricts={availableDistricts}
            availableMarkets={availableMarkets}
            onStateChange={handleStateChange}
            onDistrictChange={handleDistrictChange}
            onMarketChange={handleMarketChange}
            disabled={isLoading}
            lang={lang}
          />

          {/* 5, 6. Date Range Selector (Start Date, End Date) */}
          <DateRangeSelector
            startDateLabel={t.startDate}
            endDateLabel={t.endDate}
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            error={dateError}
            disabled={isLoading}
          />
        </div>

        {/* Date Validation Error Banner */}
        {dateError && (
          <div
            id="date-error-desc"
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-800 border border-red-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{dateError}</span>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            {t.marketSearchFooter}
          </div>

          <button
            type="submit"
            disabled={isLoading || !!dateError}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all focus:outline-hidden focus:ring-3 focus:ring-emerald-700/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>{t.fetchingData}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>{t.fetchData}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
