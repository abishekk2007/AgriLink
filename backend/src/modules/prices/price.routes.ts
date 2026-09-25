import { Router } from 'express';
import { PriceController } from './price.controller';

const router = Router();

/**
 * @route   GET /api/prices/history
 * @desc    Fetch historical crop price records
 * @query   crop, market, state, district, startDate, endDate, range
 * @access  Public
 */
router.get('/history', PriceController.getHistory);

/**
 * @route   GET /api/prices/analytics
 * @desc    Fetch transparent statistical price analytics (latest, min/max, average, trend)
 * @query   crop, market, state, district, startDate, endDate, range
 * @access  Public
 */
router.get('/analytics', PriceController.getAnalytics);

export default router;
