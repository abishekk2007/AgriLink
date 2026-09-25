export interface MarketRecord {
  id: string;
  date: string; // ISO date format: YYYY-MM-DD
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number; // ₹/kg
  maxPrice: number; // ₹/kg
  modalPrice: number; // ₹/kg
}

export interface MarketFilterParams {
  commodity: string;
  state: string;
  district: string;
  market: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface PriceStatistics {
  latestPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  recordCount: number;
  firstPrice: number;
  priceChangeAmount: number;
  priceChangePercent: number;
  trendDirection: 'up' | 'down' | 'stable';
  peakDate: string;
  lowestDate: string;
  pricePositionPercent: number; // 0 to 100
}

export interface MarketComparisonItem {
  marketName: string;
  latestPrice: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  diffFromSelected: number; // positive = higher than selected, negative = lower
  isSelected: boolean;
  recordCount: number;
}

export interface MarketInsight {
  headline: string;
  trendInsight: string;
  peakInsight: string;
  comparisonInsight: string;
  spreadInsight: string;
  positionInsight: string;
}

export interface MarketDataResult {
  records: MarketRecord[];
  stats: PriceStatistics | null;
  comparison: MarketComparisonItem[];
  insight: MarketInsight | null;
  availableCommodities: string[];
  availableStates: string[];
  availableDistricts: Record<string, string[]>;
  availableMarkets: Record<string, string[]>;
}

export type Language = 'en' | 'ta';
