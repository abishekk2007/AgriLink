import { Request, Response } from 'express';
import { ComparisonService } from './comparison.service';
import { MarketComparisonQuery } from './comparison.types';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';

export class ComparisonController {
  /**
   * Compares prices between different markets for a given crop
   * GET /api/markets/compare
   *
   * Example: /api/markets/compare?crop=Tomato&date=2026-09-25&markets=Koyambedu,Madurai
   */
  public static compareMarkets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const crop = (req.query.crop || req.query.commodity) as string | undefined;
    const date = req.query.date as string | undefined;
    const rawMarkets = req.query.markets || req.query.market;
    const state = req.query.state as string | undefined;

    // Validation: crop is required
    if (!crop || crop.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Crop parameter is required for market comparison',
      });
      return;
    }

    // Parse markets (handles both array and comma-separated string)
    let marketsList: string[] | undefined;
    if (rawMarkets) {
      if (Array.isArray(rawMarkets)) {
        marketsList = rawMarkets.map(String);
      } else if (typeof rawMarkets === 'string') {
        marketsList = rawMarkets.split(',').map((m) => m.trim()).filter(Boolean);
      }
    }

    const query: MarketComparisonQuery = {
      crop: crop.trim(),
      date: date ? date.trim() : undefined,
      markets: marketsList,
      state: state ? state.trim() : undefined,
    };

    try {
      const result = await ComparisonService.compareMarkets(query);

      // Map data cleanly to required fields { market, modalPrice }
      const cleanData = result.data.map((item) => ({
        market: item.market,
        modalPrice: item.modalPrice,
        ...(item.state ? { state: item.state } : {}),
      }));

      res.status(200).json({
        success: true,
        message: 'Market comparison generated successfully',
        data: cleanData,
        summary: result.summary,
      });
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        res.status(404).json({
          success: false,
          message: error.message || 'No markets found matching the comparison criteria',
        });
        return;
      }
      throw error;
    }
  });
}
