import { Request, Response } from 'express';
import { MarketDataService } from '../services/marketDataService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { MarketQueryFilters } from '../types/market.types';
import { logger } from '../utils/logger';

export class MarketController {
  /**
   * Check external agricultural market API connection
   * GET /api/market/test
   */
  public static testApiConnection = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const testResult = await MarketDataService.testConnection();

    ApiResponse.success(
      res,
      'Market API connection check completed',
      testResult
    );
  });

  /**
   * Fetch market price data with query filters
   * GET /api/market/data
   *
   * Example: /api/market/data?commodity=Tomato&state=Tamil Nadu&market=Koyambedu
   */
  public static getMarketData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: MarketQueryFilters = {
        commodity: req.query.commodity ? String(req.query.commodity).trim() : undefined,
        state: req.query.state ? String(req.query.state).trim() : undefined,
        district: req.query.district ? String(req.query.district).trim() : undefined,
        market: req.query.market ? String(req.query.market).trim() : undefined,
        limit: req.query.limit ? parseInt(String(req.query.limit), 10) : 50,
        offset: req.query.offset ? parseInt(String(req.query.offset), 10) : 0,
      };

      const marketData = await MarketDataService.fetchMarketData(filters);

      ApiResponse.success(
        res,
        'Market data fetched successfully',
        marketData
      );
    } catch (error: any) {
      logger.error('MarketController.getMarketData encountered an error', error);

      // Return standard required error format
      res.status(500).json({
        success: false,
        message: 'Unable to fetch market data',
      });
    }
  });
}
