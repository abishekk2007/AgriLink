import { Router } from 'express';
import { marketController } from '../controllers/market.controller.js';
import { validate } from '../middleware/validate.js';
import {
  MarketPriceQuerySchema,
  MarketComparisonQuerySchema,
} from '../validators/market.validator.js';

const router = Router();

router.get(
  '/',
  validate(MarketPriceQuerySchema, 'query'),
  (req, res, next) => marketController.getMarketPrices(req, res, next)
);

router.get('/latest', (req, res, next) =>
  marketController.getLatestPrice(req, res, next)
);

router.get(
  '/compare',
  validate(MarketComparisonQuerySchema, 'query'),
  (req, res, next) => marketController.compareMarkets(req, res, next)
);

router.get('/sources', (req, res, next) =>
  marketController.getDataSourceInfo(req, res, next)
);

export default router;
