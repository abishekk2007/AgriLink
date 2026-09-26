export type Language = 'en' | 'ta';

export type AlertCondition = 'ABOVE' | 'BELOW';
export type AlertStatus = 'ACTIVE' | 'TRIGGERED' | 'DISABLED';

export type PricePositionTier = 'LOWER_RANGE' | 'MIDDLE_RANGE' | 'UPPER_RANGE';
export type VolatilityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TrendDirection = 'UP' | 'DOWN' | 'STABLE';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    count?: number;
    source?: string;
    [key: string]: any;
  };
}

export interface MarketPriceRecord {
  id: string;
  date: string;
  commodity: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  source: string;
}

export interface MarketPriceStats {
  latestPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  modalPrice: number;
  unit: string;
  percentageChange: number;
  trend: TrendDirection;
  recordCount: number;
  firstDate: string;
  latestDate: string;
  pricePosition: PricePositionTier;
  percentile: number;
  volatility: VolatilityLevel;
  volatilityScore: number;
}

export interface MarketComparisonItem {
  marketId: string;
  marketName: string;
  districtName: string;
  stateName: string;
  latestPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  priceChange: number;
  lastUpdated: string;
  distanceKm?: number;
  estimatedTransportCost?: number;
  netRealization?: number;
}

export interface MarketInsight {
  trend: TrendDirection;
  percentageChange: number;
  pricePosition: PricePositionTier;
  volatility: VolatilityLevel;
  insights: string[];
  disclaimer: string;
}

export interface TransportCalculationRequest {
  marketPrice: number;
  distanceKm: number;
  transportRatePerKm: number;
  quantityKg?: number;
}

export interface TransportCalculationResult {
  marketPrice: number;
  distanceKm: number;
  transportRatePerKm: number;
  quantityKg: number;
  totalTransportCost: number;
  transportCostPerKg: number;
  grossMarketValue: number;
  netRealization: number;
  netRealizationPerKg: number;
  isEstimate: boolean;
  disclaimer: string;
}
