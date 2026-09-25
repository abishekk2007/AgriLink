import { Router } from 'express';
import { MarketController } from '../controllers/marketController';

const router = Router();

/**
 * @route   GET /api/market/test
 * @desc    Check external agricultural market API connection
 * @access  Public
 */
router.get('/test', MarketController.testApiConnection);

/**
 * @route   GET /api/market/data
 * @desc    Fetch agricultural market price data with optional filters
 * @query   commodity, state, district, market, limit, offset
 * @access  Public
 */
router.get('/data', MarketController.getMarketData);

export default router;
