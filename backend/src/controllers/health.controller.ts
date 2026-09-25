import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { checkDatabaseHealth } from '../database/prisma';

export class HealthController {
  /**
   * Production Health check endpoint: GET /api/health
   * Response:
   * {
   *   "success": true,
   *   "status": "healthy",
   *   "service": "AgriLink Backend"
   * }
   */
  public static getHealth = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      status: 'healthy',
      service: 'AgriLink Backend',
    });
  });

  /**
   * Detailed system diagnostics: GET /api/health/status
   */
  public static getDiagnostics = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const diagnostics = HealthService.getDiagnostics();
    const dbStatus = await checkDatabaseHealth();

    ApiResponse.success(res, 'System diagnostics retrieved successfully', {
      ...diagnostics,
      database: dbStatus,
    });
  });
}
