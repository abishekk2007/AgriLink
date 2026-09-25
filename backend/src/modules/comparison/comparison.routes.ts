import { Router } from 'express';
import { ComparisonController } from './comparison.controller';

const router = Router();

/**
 * @route   GET /api/markets/compare
 * @desc    Compare crop prices across different markets/mandis
 * @query   crop (required), date, markets[], state
 * @access  Public
 */
router.get('/compare', ComparisonController.compareMarkets);

export default router;
