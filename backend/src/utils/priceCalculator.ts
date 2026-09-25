/**
 * Reusable statistical and mathematical price calculation utilities
 * Pure functions with zero machine learning or opaque models
 */

/**
 * Calculates the arithmetic mean of an array of price values
 * Formula: sum(prices) / length
 */
export const calculateAverage = (prices: number[]): number => {
  if (!prices || prices.length === 0) {
    return 0;
  }

  const sum = prices.reduce((acc, curr) => acc + curr, 0);
  const avg = sum / prices.length;
  return Math.round(avg * 100) / 100;
};

/**
 * Finds the maximum price and the date on which it occurred
 */
export const findHighestPrice = (
  records: { modalPrice: number; date: string }[]
): { highestPrice: number; highestDate: string } => {
  if (!records || records.length === 0) {
    return { highestPrice: 0, highestDate: '' };
  }

  let maxRecord = records[0];

  for (let i = 1; i < records.length; i++) {
    if (records[i].modalPrice > maxRecord.modalPrice) {
      maxRecord = records[i];
    }
  }

  return {
    highestPrice: maxRecord.modalPrice,
    highestDate: maxRecord.date,
  };
};

/**
 * Finds the minimum price and the date on which it occurred
 */
export const findLowestPrice = (
  records: { modalPrice: number; date: string }[]
): { lowestPrice: number; lowestDate: string } => {
  if (!records || records.length === 0) {
    return { lowestPrice: 0, lowestDate: '' };
  }

  let minRecord = records[0];

  for (let i = 1; i < records.length; i++) {
    if (records[i].modalPrice < minRecord.modalPrice) {
      minRecord = records[i];
    }
  }

  return {
    lowestPrice: minRecord.modalPrice,
    lowestDate: minRecord.date,
  };
};

/**
 * Determines price movement trend by comparing the earliest chronological price
 * with the latest available price.
 * 
 * Logic:
 * - If latest > first: trend = "UP"
 * - If latest < first: trend = "DOWN"
 * - Otherwise: trend = "STABLE"
 */
export const calculateTrend = (
  firstPrice: number,
  latestPrice: number
): 'UP' | 'DOWN' | 'STABLE' => {
  if (latestPrice > firstPrice) {
    return 'UP';
  }
  if (latestPrice < firstPrice) {
    return 'DOWN';
  }
  return 'STABLE';
};

/**
 * Calculates percentage change between initial price and final price
 * Formula: ((latestPrice - firstPrice) / firstPrice) * 100
 */
export const calculatePercentageChange = (
  firstPrice: number,
  latestPrice: number
): number => {
  if (firstPrice === 0) {
    return latestPrice > 0 ? 100 : 0;
  }

  const change = ((latestPrice - firstPrice) / firstPrice) * 100;
  return Math.round(change * 100) / 100;
};
