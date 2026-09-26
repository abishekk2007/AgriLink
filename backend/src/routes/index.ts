import { Router } from 'express';
import healthRoutes from './health.routes.js';
import commodityRoutes from './commodity.routes.js';
import locationRoutes from './location.routes.js';
import marketRoutes from './market.routes.js';
import analyticsRoutes from './analytics.routes.js';
import insightRoutes from './insight.routes.js';
import alertRoutes from './alert.routes.js';
import { successResponse } from '../utils/responseFormatter.js';

const router = Router();

// Sub-routers
router.use('/health', healthRoutes);
router.use('/commodities', commodityRoutes);
router.use('/', locationRoutes); // /states, /states/:stateId/districts, /districts/:districtId/markets, /markets
router.use('/market-prices', marketRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/insights', insightRoutes);
router.use('/alerts', alertRoutes);

// Section 26: Future ML Forecasting Placeholder
router.get('/forecast', (req, res) => {
  res.json(
    successResponse({
      forecast: [],
      model: 'future',
      confidence: null,
      status: 'NOT_IMPLEMENTED',
      note: 'ML/AI forecasting is planned as a separate downstream service. The current AgriLink core uses transparent deterministic calculations and real government mandi records.',
    })
  );
});

export default router;
