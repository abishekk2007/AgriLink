import { HistoricalPriceRecord } from './price.types';
export * from '../../utils/priceCalculator';

/**
 * Validates date string in YYYY-MM-DD format
 */
export const isValidISODate = (dateStr: string): boolean => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime()) && dateStr === parsed.toISOString().split('T')[0];
};

/**
 * Validates date range logic (startDate must be <= endDate)
 */
export const validateDateRange = (
  startDate?: string,
  endDate?: string
): { valid: boolean; error?: string } => {
  if (startDate && !isValidISODate(startDate)) {
    return {
      valid: false,
      error: 'Invalid startDate format. Expected YYYY-MM-DD (e.g. 2026-09-01)',
    };
  }

  if (endDate && !isValidISODate(endDate)) {
    return {
      valid: false,
      error: 'Invalid endDate format. Expected YYYY-MM-DD (e.g. 2026-09-25)',
    };
  }

  if (startDate && endDate && startDate > endDate) {
    return {
      valid: false,
      error: 'Invalid date range: startDate must be before or equal to endDate',
    };
  }

  return { valid: true };
};

/**
 * Computes preset date range for convenient time-window filtering
 */
export const computePresetRange = (
  preset: '7d' | '30d' | '90d',
  referenceDate = new Date()
): { startDate: string; endDate: string } => {
  const endDate = referenceDate.toISOString().split('T')[0];
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;

  const start = new Date(referenceDate);
  start.setDate(start.getDate() - days);
  const startDate = start.toISOString().split('T')[0];

  return { startDate, endDate };
};

/**
 * Checks whether a given date falls within the specified date boundaries (inclusive)
 */
export const isDateInRange = (
  dateStr: string,
  startDate?: string,
  endDate?: string
): boolean => {
  if (startDate && dateStr < startDate) {
    return false;
  }
  if (endDate && dateStr > endDate) {
    return false;
  }
  return true;
};

/**
 * Sorts historical records chronologically
 */
export const sortRecordsByDate = (
  records: HistoricalPriceRecord[],
  order: 'asc' | 'desc' = 'asc'
): HistoricalPriceRecord[] => {
  return [...records].sort((a, b) => {
    return order === 'asc'
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date);
  });
};
