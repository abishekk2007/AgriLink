export interface MarketRecord {
  id?: string;
  date: string; // ISO date format: YYYY-MM-DD
  state?: string;
  district?: string;
  market: string;
  commodity: string;
  variety?: string;
  minPrice: number; // ₹/kg
  maxPrice: number; // ₹/kg
  modalPrice: number; // ₹/kg
  unit?: string;
  source?: string;
}

export interface MarketFilterParams {
  commodity: string;
  state: string;
  district: string;
  market: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days?: number;
  lang?: string;
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

export interface MarketPriceStats {
  latestPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  modalPrice: number;
  unit: string;
  percentageChange: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  recordCount: number;
  firstDate: string;
  latestDate: string;
  pricePosition: 'LOWER_RANGE' | 'MIDDLE_RANGE' | 'UPPER_RANGE';
  percentile: number;
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  volatilityScore: number;
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
  districtName?: string;
  stateName?: string;
  netRealization?: number;
}

export interface MarketInsight {
  headline?: string;
  trendInsight?: string;
  peakInsight?: string;
  comparisonInsight?: string;
  spreadInsight?: string;
  positionInsight?: string;
  trajectory?: string;
  highLowContext?: string;
  marketPositioning?: string;
  spreadObservation?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  percentageChange?: number;
  pricePosition?: 'LOWER_RANGE' | 'MIDDLE_RANGE' | 'UPPER_RANGE';
  volatility?: 'LOW' | 'MEDIUM' | 'HIGH';
  insights?: string[];
  disclaimer?: string;
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
