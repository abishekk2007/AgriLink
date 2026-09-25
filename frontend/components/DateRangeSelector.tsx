'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  startDateLabel: string;
  endDateLabel: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error?: string | null;
  disabled?: boolean;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDateLabel,
  endDateLabel,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
  disabled = false,
}) => {
  return (
    <>
      {/* Start Date */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="start-date-input"
          className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>{startDateLabel}</span>
        </label>
        <input
          id="start-date-input"
          type="date"
          value={startDate}
          min="2026-09-01"
          max="2026-09-25"
          onChange={(e) => onStartDateChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? "date-error-desc" : undefined}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs focus:outline-hidden focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 transition-all ${
            error
              ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 bg-white hover:border-emerald-500 focus:border-emerald-600 focus:ring-emerald-600/20'
          }`}
        />
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="end-date-input"
          className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>{endDateLabel}</span>
        </label>
        <input
          id="end-date-input"
          type="date"
          value={endDate}
          min="2026-09-01"
          max="2026-09-25"
          onChange={(e) => onEndDateChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? "date-error-desc" : undefined}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs focus:outline-hidden focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 transition-all ${
            error
              ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 bg-white hover:border-emerald-500 focus:border-emerald-600 focus:ring-emerald-600/20'
          }`}
        />
      </div>
    </>
  );
};
