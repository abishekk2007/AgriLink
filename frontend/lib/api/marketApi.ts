import { apiClient } from './apiClient';
import { MarketPriceStats, MarketInsight } from '../../types/market';

export interface MarketPriceRecord {
  id: string;
  date: string;
  commodity: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  source: string;
}

export interface MarketPriceResponse {
  records: MarketPriceRecord[];
  stats: MarketPriceStats | null;
  commodity: {
    id: string;
    name: string;
    code: string;
    category: string;
    defaultUnit: string;
    icon?: string;
    isMspCovered: boolean;
  };
  market: {
    id: string;
    name: string;
    code: string;
    district: string;
    state: string;
  } | null;
  insight: MarketInsight | null;
  msp?: {
    price: number;
    unit: string;
    season: string;
    year: number;
    source: string;
  } | null;
  source: string;
}

export interface MarketFilterParams {
  commodity: string;
  state?: string;
  district?: string;
  market?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  lang?: string;
}

export interface ComparisonItem {
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

export interface ComparisonResponse {
  commodity: {
    id: string;
    name: string;
    defaultUnit: string;
  };
  comparison: ComparisonItem[];
  metrics: {
    highestPrice: number;
    lowestPrice: number;
    priceDifference: number;
    highestMarket: string | null;
    lowestMarket: string | null;
  };
  note: string;
}

export async function getMarketPrices(
  filters: MarketFilterParams
): Promise<MarketPriceResponse> {
  const query = new URLSearchParams();
  if (filters.commodity) query.set('commodity', filters.commodity);
  if (filters.state) query.set('state', filters.state);
  if (filters.district) query.set('district', filters.district);
  if (filters.market) query.set('market', filters.market);
  if (filters.startDate) query.set('startDate', filters.startDate);
  if (filters.endDate) query.set('endDate', filters.endDate);
  if (filters.days) query.set('days', String(filters.days));
  if (filters.lang) query.set('lang', filters.lang);

  const res = await apiClient<MarketPriceRecord[]>(`/market-prices?${query.toString()}`);
  return {
    records: res.data,
    stats: (res.meta as any)?.stats || null,
    commodity: (res.meta as any)?.commodity || null,
    market: (res.meta as any)?.market || null,
    insight: (res.meta as any)?.insight || null,
    msp: (res.meta as any)?.msp || null,
    source: (res.meta as any)?.source || 'AGMARKNET',
  };
}

export async function getLatestPrice(commodity: string, market?: string) {
  const query = new URLSearchParams({ commodity });
  if (market) query.set('market', market);
  const res = await apiClient<any>(`/market-prices/latest?${query.toString()}`);
  return res.data;
}

export async function compareMarkets(params: {
  commodity: string;
  state?: string;
  district?: string;
  markets?: string;
  distanceKm?: number;
  transportRatePerKm?: number;
  quantityKg?: number;
}): Promise<ComparisonResponse> {
  const query = new URLSearchParams({ commodity: params.commodity });
  if (params.state) query.set('state', params.state);
  if (params.district) query.set('district', params.district);
  if (params.markets) query.set('markets', params.markets);
  if (params.distanceKm !== undefined) query.set('distanceKm', String(params.distanceKm));
  if (params.transportRatePerKm !== undefined)
    query.set('transportRatePerKm', String(params.transportRatePerKm));
  if (params.quantityKg !== undefined) query.set('quantityKg', String(params.quantityKg));

  const res = await apiClient<ComparisonResponse>(`/market-prices/compare?${query.toString()}`);
  return res.data;
}

export async function getDataSources() {
  const res = await apiClient<any[]>('/market-prices/sources');
  return res.data;
}
