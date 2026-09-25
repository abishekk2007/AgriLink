import { Request, Response } from 'express';
import { InsightService } from '../services/insightService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export class InsightController {
  /**
   * Generates rule-based actionable insights for farmers
   * GET /api/insights
   *
   * Example: /api/insights?crop=Tomato&market=Koyambedu
   */
  public static getInsights = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const crop = (req.query.crop || req.query.commodity) as string | undefined;
    const market = req.query.market as string | undefined;
    const state = req.query.state as string | undefined;

    if (!crop || crop.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Crop parameter is required for generating insights',
      });
      return;
    }

    if (!market || market.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Market parameter is required for generating insights',
      });
      return;
    }

    try {
      const result = await InsightService.generateInsights(crop.trim(), market.trim(), state?.trim());

      res.status(200).json({
        success: true,
        message: 'Farmer insights generated successfully',
        data: {
          crop: result.crop,
          market: result.market,
          insights: result.insights,
          metrics: result.metrics,
        },
      });
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        res.status(404).json({
          success: false,
          message: error.message || 'No historical data available to generate insights',
        });
        return;
      }
      throw error;
    }
  });
}
