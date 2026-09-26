import { apiClient } from './apiClient';

export interface TransportCalculationParams {
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

export async function calculateTransportCost(
  params: TransportCalculationParams
): Promise<TransportCalculationResult> {
  const res = await apiClient<TransportCalculationResult>('/analytics/transport-cost', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data;
}

export async function getInsights(params: {
  commodityName?: string;
  marketName?: string;
  startDate?: string;
  endDate?: string;
  lang?: string;
}) {
  const res = await apiClient<any>('/insights/analyze', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data;
}
