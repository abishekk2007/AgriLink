import { Router, Request, Response } from 'express';
import healthRoutes from './health.routes';
import marketRoutes from './marketRoutes';
import priceRoutes from '../modules/prices/price.routes';
import comparisonRoutes from '../modules/comparison/comparison.routes';
import insightRoutes from './insightRoutes';
import alertRoutes from '../modules/alerts/alert.routes';
import { ApiResponse } from '../utils/ApiResponse';

const apiRouter = Router();

/**
 * Root API metadata
 * GET /api
 */
apiRouter.get('/', (_req: Request, res: Response) => {
  ApiResponse.success(res, 'AgriLink Agricultural Intelligence API is active', {
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      healthDiagnostics: '/api/health/status',
      marketTest: '/api/market/test',
      marketData: '/api/market/data',
      marketComparison: '/api/markets/compare',
      priceHistory: '/api/prices/history',
      priceAnalytics: '/api/prices/analytics',
      farmerInsights: '/api/insights',
      priceAlerts: '/api/alerts',
    },
  });
});

// Mount modules
apiRouter.use('/health', healthRoutes);
apiRouter.use('/market', marketRoutes);
apiRouter.use('/markets', comparisonRoutes);
apiRouter.use('/prices', priceRoutes);
apiRouter.use('/insights', insightRoutes);
apiRouter.use('/alerts', alertRoutes);

export default apiRouter;
