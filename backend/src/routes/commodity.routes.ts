import { Router } from 'express';
import { commodityController } from '../controllers/commodity.controller.js';

const router = Router();

router.get('/', (req, res, next) => commodityController.getCommodities(req, res, next));
router.get('/:id', (req, res, next) => commodityController.getCommodityById(req, res, next));

export default router;
