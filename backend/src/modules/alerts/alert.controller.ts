import { Request, Response } from 'express';
import { AlertService } from './alert.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';

export class AlertController {
  /**
   * Creates a new farmer price alert
   * POST /api/alerts
   */
  public static createAlert = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { crop, market, targetPrice } = req.body;

    if (!crop || typeof crop !== 'string' || crop.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Crop parameter is required',
      });
      return;
    }

    if (!market || typeof market !== 'string' || market.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Market parameter is required',
      });
      return;
    }

    const parsedPrice = parseFloat(targetPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      res.status(400).json({
        success: false,
        message: 'Target price must be a positive number',
      });
      return;
    }

    const alert = await AlertService.createAlert({
      crop: crop.trim(),
      market: market.trim(),
      targetPrice: parsedPrice,
    });

    ApiResponse.created(
      res,
      'Price alert created successfully',
      alert
    );
  });

  /**
   * Fetches all farmer price alerts with evaluated triggers
   * GET /api/alerts
   */
  public static getAlerts = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const alerts = await AlertService.getUserAlerts();

    ApiResponse.success(
      res,
      'Price alerts retrieved successfully',
      alerts
    );
  });
}
