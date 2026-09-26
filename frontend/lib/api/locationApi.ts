import { apiClient } from './apiClient';

export interface StateItem {
  id: string;
  name: string;
  code: string;
}

export interface DistrictItem {
  id: string;
  name: string;
  stateId: string;
}

export interface MarketItem {
  id: string;
  name: string;
  code: string;
  districtId: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export async function getStates(): Promise<StateItem[]> {
  const res = await apiClient<StateItem[]>('/states');
  return res.data;
}

export async function getDistrictsByState(stateId: string): Promise<DistrictItem[]> {
  const res = await apiClient<DistrictItem[]>(`/states/${stateId}/districts`);
  return res.data;
}

export async function getMarketsByDistrict(districtId: string): Promise<MarketItem[]> {
  const res = await apiClient<MarketItem[]>(`/districts/${districtId}/markets`);
  return res.data;
}

export async function getAllMarkets(): Promise<MarketItem[]> {
  const res = await apiClient<MarketItem[]>('/markets');
  return res.data;
}
