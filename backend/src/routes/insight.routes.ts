import { Router } from 'express';
import { insightController } from '../controllers/insight.controller.js';
import { validate } from '../middleware/validate.js';
import { InsightAnalysisSchema } from '../validators/insight.validator.js';

const router = Router();

router.post(
  '/analyze',
  validate(InsightAnalysisSchema, 'body'),
  (req, res, next) => insightController.analyzeMarketInsights(req, res, next)
);

// Also support GET /api/insights
router.get('/', (req, res, next) => {
  // Transfer query params into body for the controller
  req.body = {
    commodityName: req.query.commodity as string,
    marketName: req.query.market as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    lang: (req.query.lang as any) || 'en',
  };
  insightController.analyzeMarketInsights(req, res, next);
});

export default router;
