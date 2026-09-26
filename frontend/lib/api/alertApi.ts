import { apiClient } from './apiClient';

export interface PriceAlert {
  id: string;
  userId?: string;
  commodityId: string;
  marketId: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  status: 'ACTIVE' | 'TRIGGERED' | 'DISABLED';
  triggeredAt?: string | null;
  notes?: string;
  commodity: {
    id: string;
    name: string;
    code: string;
    defaultUnit: string;
  };
  market: {
    id: string;
    name: string;
    code: string;
    district: {
      name: string;
      state: {
        name: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertInput {
  commodityId: string;
  marketId: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  notes?: string;
}

export async function getAlerts(status?: string): Promise<PriceAlert[]> {
  const query = status ? `?status=${status}` : '';
  const res = await apiClient<PriceAlert[]>(`/alerts${query}`);
  return res.data;
}

export async function createAlert(input: CreateAlertInput): Promise<PriceAlert> {
  const res = await apiClient<PriceAlert>('/alerts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function updateAlert(
  id: string,
  data: Partial<CreateAlertInput & { status: 'ACTIVE' | 'TRIGGERED' | 'DISABLED' }>
): Promise<PriceAlert> {
  const res = await apiClient<PriceAlert>(`/alerts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteAlert(id: string): Promise<{ deleted: boolean; id: string }> {
  const res = await apiClient<{ deleted: boolean; id: string }>(`/alerts/${id}`, {
    method: 'DELETE',
  });
  return res.data;
}

export async function checkAlerts(): Promise<{
  checkedCount: number;
  triggeredCount: number;
  triggered: any[];
}> {
  const res = await apiClient<any>('/alerts/check', {
    method: 'POST',
  });
  return res.data;
}
