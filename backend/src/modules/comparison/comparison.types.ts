/**
 * Single market entry in comparison results
 */
export interface MarketComparisonItem {
  market: string;
  modalPrice: number;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  district?: string;
}

/**
 * Summary metadata highlighting price spread, highest, and lowest markets
 */
export interface MarketComparisonSummary {
  crop: string;
  date: string;
  totalMarkets: number;
  highestMarket: string;
  highestPrice: number;
  lowestMarket: string;
  lowestPrice: number;
  priceSpread: number;
  averagePrice: number;
}

/**
 * Filter query parameters for market price comparison
 */
export interface MarketComparisonQuery {
  crop: string;
  date?: string;
  markets?: string[];
  state?: string;
}

/**
 * Complete comparison result structure
 */
export interface MarketComparisonResult {
  data: MarketComparisonItem[];
  summary: MarketComparisonSummary;
}
