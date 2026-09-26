import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export class AnalyticsController {
  calculateTransportCost(req: Request, res: Response, next: NextFunction) {
    try {
      const { marketPrice, distanceKm, transportRatePerKm, quantityKg } = req.body;
      const result = analyticsService.calculateNetRealization({
        marketPrice: parseFloat(marketPrice),
        distanceKm: parseFloat(distanceKm),
        transportRatePerKm: parseFloat(transportRatePerKm),
        quantityKg: quantityKg ? parseFloat(quantityKg) : 1000,
      });

      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
