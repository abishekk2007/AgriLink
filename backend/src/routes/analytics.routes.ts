import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { validate } from '../middleware/validate.js';
import { TransportCalculationSchema } from '../validators/insight.validator.js';

const router = Router();

router.post(
  '/transport-cost',
  validate(TransportCalculationSchema, 'body'),
  (req, res, next) => analyticsController.calculateTransportCost(req, res, next)
);

export default router;
