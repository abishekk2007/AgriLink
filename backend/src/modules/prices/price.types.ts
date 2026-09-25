/**
 * Historical Price Record matching AgriLink specifications
 */
export interface HistoricalPriceRecord {
  date: string;
  crop: string;
  market: string;
  state?: string;
  district?: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
}

/**
 * Query filter parameters for historical price lookups
 */
export interface PriceHistoryQuery {
  crop: string;
  market: string;
  state?: string;
  district?: string;
  startDate?: string;
  endDate?: string;
  range?: '7d' | '30d' | '90d' | 'all';
}

/**
 * Standard Price Analytics Data Payload
 */
export interface PriceAnalyticsData {
  latestPrice: number;
  highestPrice: number;
  highestDate?: string;
  lowestPrice: number;
  lowestDate?: string;
  averagePrice: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  percentageChange: number;
}

/**
 * Comprehensive Analytics Summary
 */
export interface ComprehensivePriceAnalytics extends PriceAnalyticsData {
  crop: string;
  market: string;
  totalRecords: number;
  firstDate: string;
  latestDate: string;
  firstPrice: number;
}
