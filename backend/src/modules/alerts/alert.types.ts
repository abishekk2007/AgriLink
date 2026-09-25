/**
 * Alert status enumeration
 */
export type AlertStatus = 'ACTIVE' | 'TRIGGERED' | 'DISMISSED';

/**
 * Standard Alert data structure
 */
export interface PriceAlert {
  id: string;
  crop: string;
  market: string;
  targetPrice: number;
  currentPrice?: number;
  isTriggered: boolean;
  status: AlertStatus;
  notificationMessage?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Input DTO for creating a new price alert
 */
export interface CreateAlertDto {
  crop: string;
  market: string;
  targetPrice: number;
}
