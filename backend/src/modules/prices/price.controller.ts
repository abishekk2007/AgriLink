import { Request, Response } from 'express';
import { PriceService } from './price.service';
import { PriceHistoryQuery } from './price.types';
import { validateDateRange } from './price.utils';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class PriceController {
  /**
   * Fetches historical crop price records
   * GET /api/prices/history
   */
  public static getHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const crop = (req.query.crop || req.query.commodity) as string | undefined;
    const market = req.query.market as string | undefined;
    const state = req.query.state as string | undefined;
    const district = req.query.district as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const range = req.query.range as '7d' | '30d' | '90d' | undefined;

    // 1. Data Validation: Validate Crop
    if (!crop || crop.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Crop parameter is required',
      });
      return;
    }

    // 2. Data Validation: Validate Market
    if (!market || market.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Market parameter is required',
      });
      return;
    }

    // 3. Data Validation: Validate Date Range
    if (startDate || endDate) {
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.valid) {
        res.status(400).json({
          success: false,
          message: dateValidation.error || 'Invalid date range',
        });
        return;
      }
    }

    const query: PriceHistoryQuery = {
      crop: crop.trim(),
      market: market.trim(),
      state: state ? state.trim() : undefined,
      district: district ? district.trim() : undefined,
      startDate: startDate ? startDate.trim() : undefined,
      endDate: endDate ? endDate.trim() : undefined,
      range,
    };

    const history = await PriceService.getHistoricalPrices(query);

    // 4. Return proper error/empty handling if needed
    if (history.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No price records found for the given criteria',
      });
      return;
    }

    // Format clean data per Requirement 3:
    // { date, crop, market, minPrice, maxPrice, modalPrice }
    const formattedData = history.map((item) => ({
      date: item.date,
      crop: item.crop,
      market: item.market,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      modalPrice: item.modalPrice,
    }));

    ApiResponse.success(
      res,
      'Price history fetched successfully',
      formattedData
    );
  });

  /**
   * Generates transparent price statistical insights
   * GET /api/prices/analytics
   */
  public static getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const crop = (req.query.crop || req.query.commodity) as string | undefined;
    const market = req.query.market as string | undefined;
    const state = req.query.state as string | undefined;
    const district = req.query.district as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const range = req.query.range as '7d' | '30d' | '90d' | undefined;

    // 1. Data Validation: Validate Crop
    if (!crop || crop.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Crop parameter is required',
      });
      return;
    }

    // 2. Data Validation: Validate Market
    if (!market || market.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Market parameter is required',
      });
      return;
    }

    // 3. Data Validation: Validate Date Range
    if (startDate || endDate) {
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.valid) {
        res.status(400).json({
          success: false,
          message: dateValidation.error || 'Invalid date range',
        });
        return;
      }
    }

    const query: PriceHistoryQuery = {
      crop: crop.trim(),
      market: market.trim(),
      state: state ? state.trim() : undefined,
      district: district ? district.trim() : undefined,
      startDate: startDate ? startDate.trim() : undefined,
      endDate: endDate ? endDate.trim() : undefined,
      range,
    };

    try {
      const analytics = await PriceService.getPriceAnalytics(query);

      // Return exact required format from Requirement 6:
      // { "success": true, "data": { ... } }
      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        res.status(404).json({
          success: false,
          message: 'No price records found for the given criteria',
        });
        return;
      }

      throw error;
    }
  });
}
