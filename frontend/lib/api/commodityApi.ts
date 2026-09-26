import { apiClient } from './apiClient';

export interface CommodityItem {
  id: string;
  name: string;
  code: string;
  category: string;
  defaultUnit: string;
  icon?: string;
  isMspCovered: boolean;
  msps?: Array<{
    price: number;
    unit: string;
    season: string;
    year: number;
  }>;
}

export async function getCommodities(): Promise<CommodityItem[]> {
  const res = await apiClient<CommodityItem[]>('/commodities');
  return res.data;
}

export async function getCommodityById(id: string): Promise<CommodityItem> {
  const res = await apiClient<CommodityItem>(`/commodities/${id}`);
  return res.data;
}
