'use client';

import React from 'react';
import { Language } from '../types/market';
import {
  translateState,
  translateDistrict,
  translateMarket,
} from '../utils/translations';

interface LocationSelectorProps {
  stateLabel: string;
  districtLabel: string;
  marketLabel: string;
  selectedState: string;
  selectedDistrict: string;
  selectedMarket: string;
  availableStates: string[];
  availableDistricts: Record<string, string[]>;
  availableMarkets: Record<string, string[]>;
  onStateChange: (state: string, nextDistrict: string, nextMarket: string) => void;
  onDistrictChange: (district: string, nextMarket: string) => void;
  onMarketChange: (market: string) => void;
  disabled?: boolean;
  lang?: Language;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  stateLabel,
  districtLabel,
  marketLabel,
  selectedState,
  selectedDistrict,
  selectedMarket,
  availableStates,
  availableDistricts,
  availableMarkets,
  onStateChange,
  onDistrictChange,
  onMarketChange,
  disabled = false,
  lang = 'en',
}) => {
  const currentDistricts = availableDistricts[selectedState] || [];
  const currentMarkets = availableMarkets[selectedDistrict] || [];

  const handleStateSelect = (newState: string) => {
    const districtsForState = availableDistricts[newState] || [];
    const firstDistrict = districtsForState[0] || '';
    const marketsForDist = availableMarkets[firstDistrict] || [];
    const firstMarket = marketsForDist[0] || '';
    onStateChange(newState, firstDistrict, firstMarket);
  };

  const handleDistrictSelect = (newDistrict: string) => {
    const marketsForDist = availableMarkets[newDistrict] || [];
    const firstMarket = marketsForDist[0] || '';
    onDistrictChange(newDistrict, firstMarket);
  };

  return (
    <>
      {/* State Selector */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="state-selector"
          className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          {stateLabel}
        </label>
        <div className="relative">
          <select
            id="state-selector"
            value={selectedState}
            onChange={(e) => handleStateSelect(e.target.value)}
            disabled={disabled}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs hover:border-emerald-500 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 transition-all"
          >
            {availableStates.map((st) => {
              const translated = translateState(st, lang);
              const labelText =
                lang === 'ta' && translated !== st ? `${translated} (${st})` : st;
              return (
                <option key={st} value={st}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* District Selector */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="district-selector"
          className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          {districtLabel}
        </label>
        <div className="relative">
          <select
            id="district-selector"
            value={selectedDistrict}
            onChange={(e) => handleDistrictSelect(e.target.value)}
            disabled={disabled || currentDistricts.length === 0}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs hover:border-emerald-500 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 transition-all"
          >
            {currentDistricts.map((dist) => {
              const translated = translateDistrict(dist, lang);
              const labelText =
                lang === 'ta' && translated !== dist ? `${translated} (${dist})` : dist;
              return (
                <option key={dist} value={dist}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Market Selector */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="market-selector"
          className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          {marketLabel}
        </label>
        <div className="relative">
          <select
            id="market-selector"
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            disabled={disabled || currentMarkets.length === 0}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs hover:border-emerald-500 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 transition-all"
          >
            {currentMarkets.map((mkt) => {
              const translated = translateMarket(mkt, lang);
              const labelText =
                lang === 'ta' && translated !== mkt ? `${translated} (${mkt})` : mkt;
              return (
                <option key={mkt} value={mkt}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
