import { Router } from 'express';
import { InsightController } from '../controllers/insightController';

const router = Router();

/**
 * @route   GET /api/insights
 * @desc    Fetch rule-based market recommendations and insights for farmers
 * @query   crop (required), market (required), state
 * @access  Public
 */
router.get('/', InsightController.getInsights);

export default router;
