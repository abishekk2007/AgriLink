'use client';

import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Filter } from 'lucide-react';
import { CropSelector } from './CropSelector';
import { LocationSelector } from './LocationSelector';
import { DateRangeSelector } from './DateRangeSelector';
import { MarketFilterParams, Language } from '../types/market';
import {
  TRANSLATIONS,
  translateCommodity,
  translateMarket,
} from '../utils/translations';

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

  // Local state for interactive form inputs
  const [formData, setFormData] = useState<MarketFilterParams>(initialFilters);
  const [dateError, setDateError] = useState<string | null>(null);

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
    setFormData((prev) => ({ ...prev, startDate: date }));
    if (formData.endDate && date > formData.endDate) {
      setDateError(t.dateError);
    } else {
      setDateError(null);
    }
  };

  const handleEndDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, endDate: date }));
    if (formData.startDate && formData.startDate > date) {
      setDateError(t.dateError);
    } else {
      setDateError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check validity
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 mb-6 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
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

        {/* Current Selection summary pill */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>{translateCommodity(formData.commodity, lang)}</span>
          <span className="text-slate-300">•</span>
          <span>{translateMarket(formData.market, lang)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Responsive Grid for 6 fields */}
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-sm transition-all focus:outline-hidden focus:ring-3 focus:ring-emerald-700/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
