import { alertRepository } from '../repositories/alert.repository.js';
import { commodityRepository } from '../repositories/commodity.repository.js';
import { locationRepository } from '../repositories/location.repository.js';
import { marketRepository } from '../repositories/market.repository.js';

export class AlertService {
  async createAlert(data: {
    userId?: string;
    commodityId: string;
    marketId: string;
    targetPrice: number;
    condition: 'ABOVE' | 'BELOW';
    notes?: string;
  }) {
    // Validate commodity exists
    const commodity = await commodityRepository.findByIdOrCode(data.commodityId);
    if (!commodity) {
      throw {
        status: 404,
        code: 'COMMODITY_NOT_FOUND',
        message: 'Commodity not found',
      };
    }

    // Validate market exists
    const market = await locationRepository.findMarketByIdOrName(data.marketId);
    if (!market) {
      throw {
        status: 404,
        code: 'MARKET_NOT_FOUND',
        message: 'Market not found',
      };
    }

    return alertRepository.create({
      userId: data.userId,
      commodityId: commodity.id,
      marketId: market.id,
      targetPrice: data.targetPrice,
      condition: data.condition,
      notes: data.notes,
    });
  }

  async getAlerts(status?: string, userId?: string) {
    return alertRepository.findAll(status, userId);
  }

  async getAlertById(id: string) {
    const alert = await alertRepository.findById(id);
    if (!alert) {
      throw {
        status: 404,
        code: 'ALERT_NOT_FOUND',
        message: 'Alert not found',
      };
    }
    return alert;
  }

  async updateAlert(id: string, data: any) {
    await this.getAlertById(id);
    return alertRepository.update(id, data);
  }

  async deleteAlert(id: string) {
    await this.getAlertById(id);
    return alertRepository.delete(id);
  }

  async checkAndTriggerAlerts() {
    const activeAlerts = await alertRepository.findActiveAlerts();
    const triggeredList: any[] = [];

    for (const alert of activeAlerts) {
      const latestPrice = await marketRepository.findLatestPrice(
        alert.commodityId,
        alert.marketId
      );

      if (!latestPrice) continue;

      let shouldTrigger = false;
      if (alert.condition === 'ABOVE' && latestPrice.modalPrice >= alert.targetPrice) {
        shouldTrigger = true;
      } else if (
        alert.condition === 'BELOW' &&
        latestPrice.modalPrice <= alert.targetPrice
      ) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        const updated = await alertRepository.update(alert.id, {
          status: 'TRIGGERED',
          triggeredAt: new Date(),
        });
        triggeredList.push({
          alertId: alert.id,
          commodity: alert.commodity.name,
          market: alert.market.name,
          condition: alert.condition,
          targetPrice: alert.targetPrice,
          currentPrice: latestPrice.modalPrice,
          triggeredAt: updated.triggeredAt,
        });
      }
    }

    return {
      checkedCount: activeAlerts.length,
      triggeredCount: triggeredList.length,
      triggered: triggeredList,
    };
  }
}

export const alertService = new AlertService();
