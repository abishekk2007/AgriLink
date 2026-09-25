import { PriceAlert, CreateAlertDto } from './alert.types';
import { PriceService } from '../prices/price.service';
import { prisma } from '../../database/prisma';
import { logger } from '../../utils/logger';
import { ApiError } from '../../utils/ApiError';

// In-memory fallback alert store for development resilience
const inMemoryAlerts: PriceAlert[] = [];

export class AlertService {
  /**
   * Creates a new farmer price alert and evaluates initial trigger status
   * Logic: IF currentPrice >= targetPrice THEN Trigger alert
   */
  public static async createAlert(dto: CreateAlertDto): Promise<PriceAlert> {
    const { crop, market, targetPrice } = dto;

    if (!crop || !market || targetPrice === undefined || targetPrice <= 0) {
      throw ApiError.badRequest('Valid crop, market, and a positive targetPrice are required');
    }

    logger.info(`Creating price alert for ${crop} at ${market} with target ₹${targetPrice}`);

    // Fetch current modal price
    let currentPrice = 0;
    try {
      const records = await PriceService.getHistoricalPrices({ crop, market, range: '7d' });
      if (records.length > 0) {
        currentPrice = records[records.length - 1].modalPrice;
      }
    } catch {
      logger.warn(`Could not fetch real-time price for alert initial check`);
    }

    // Evaluate trigger condition
    const isTriggered = currentPrice > 0 && currentPrice >= targetPrice;
    const status = isTriggered ? 'TRIGGERED' : 'ACTIVE';
    const notificationMessage = isTriggered
      ? `Alert Triggered! Current price (₹${currentPrice}/kg) has reached or exceeded your target (₹${targetPrice}/kg).`
      : `Alert Active: Monitoring price for ${crop} at ${market}. Current price is ₹${currentPrice}/kg.`;

    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newAlert: PriceAlert = {
      id: alertId,
      crop: crop.trim(),
      market: market.trim(),
      targetPrice,
      currentPrice,
      isTriggered,
      status,
      notificationMessage,
      createdAt: now,
      updatedAt: now,
    };

    // Attempt saving to PostgreSQL database via Prisma
    try {
      const saved = await prisma.alert.create({
        data: {
          crop: newAlert.crop,
          market: newAlert.market,
          targetPrice: newAlert.targetPrice,
        },
      });
      newAlert.id = saved.id;
    } catch {
      logger.info('Database offline, alert saved to active memory store.');
    }

    inMemoryAlerts.unshift(newAlert);
    return newAlert;
  }

  /**
   * Retrieves all farmer alerts with refreshed market prices and trigger states
   */
  public static async getUserAlerts(): Promise<PriceAlert[]> {
    logger.info('Retrieving and evaluating all price alerts...');

    let alerts: PriceAlert[] = [...inMemoryAlerts];

    // Attempt fetching from Prisma database
    try {
      const dbAlerts = await prisma.alert.findMany({
        orderBy: { createdAt: 'desc' },
      });

      if (dbAlerts.length > 0) {
        alerts = dbAlerts.map((d: any) => ({
          id: d.id,
          crop: d.crop,
          market: d.market,
          targetPrice: d.targetPrice,
          isTriggered: false,
          status: 'ACTIVE',
          createdAt: typeof d.createdAt === 'string' ? d.createdAt : d.createdAt?.toISOString?.() || new Date().toISOString(),
        }));
      }
    } catch {
      // Use in-memory alerts
    }

    // Refresh current prices and evaluate status for all alerts
    for (const alert of alerts) {
      try {
        const records = await PriceService.getHistoricalPrices({
          crop: alert.crop,
          market: alert.market,
          range: '7d',
        });

        if (records.length > 0) {
          const current = records[records.length - 1].modalPrice;
          alert.currentPrice = current;
          alert.isTriggered = current >= alert.targetPrice;
          alert.status = alert.isTriggered ? 'TRIGGERED' : 'ACTIVE';
          alert.notificationMessage = alert.isTriggered
            ? `Target reached! Current price (₹${current}/kg) >= target (₹${alert.targetPrice}/kg).`
            : `Price below target: ₹${current}/kg (Target: ₹${alert.targetPrice}/kg).`;
        }
      } catch {
        // Leave previous status
      }
    }

    return alerts;
  }
}
