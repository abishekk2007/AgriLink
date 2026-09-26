import { Request, Response, NextFunction } from 'express';
import { marketService } from '../services/market.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export class MarketController {
  async getMarketPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const { commodity, state, district, market, startDate, endDate, days, lang } = req.query as any;

      const result = await marketService.getMarketPrices({
        commodity: String(commodity),
        state: state ? String(state) : undefined,
        district: district ? String(district) : undefined,
        market: market ? String(market) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        days: days ? parseInt(days, 10) : undefined,
        lang: (lang as any) || 'en',
      });

      res.json(successResponse(result.records, {
        stats: result.stats,
        commodity: result.commodity,
        market: result.market,
        insight: result.insight,
        msp: result.msp,
        count: result.records.length,
        source: result.meta.source,
      }));
    } catch (error) {
      next(error);
    }
  }

  async getLatestPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { commodity, market } = req.query as any;
      if (!commodity) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_QUERY', message: "Query parameter 'commodity' is required" },
        });
        return;
      }

      const result = await marketService.getLatestPrice(
        String(commodity),
        market ? String(market) : undefined
      );

      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async compareMarkets(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        commodity,
        state,
        district,
        markets,
        startDate,
        endDate,
        distanceKm,
        transportRatePerKm,
        quantityKg,
      } = req.query as any;

      const result = await marketService.compareMarkets({
        commodity: String(commodity),
        state: state ? String(state) : undefined,
        district: district ? String(district) : undefined,
        markets: markets ? String(markets) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        distanceKm: distanceKm ? parseFloat(distanceKm) : undefined,
        transportRatePerKm: transportRatePerKm ? parseFloat(transportRatePerKm) : undefined,
        quantityKg: quantityKg ? parseFloat(quantityKg) : undefined,
      });

      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getDataSourceInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const sources = await marketService.getDataSourceInfo();
      res.json(successResponse(sources));
    } catch (error) {
      next(error);
    }
  }
}

export const marketController = new MarketController();
