import { Request, Response, NextFunction } from 'express';
import { commodityService } from '../services/commodity.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export class CommodityController {
  async getCommodities(req: Request, res: Response, next: NextFunction) {
    try {
      const commodities = await commodityService.getAllCommodities();
      res.json(successResponse(commodities, { count: commodities.length }));
    } catch (error) {
      next(error);
    }
  }

  async getCommodityById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const commodity = await commodityService.getCommodityByIdOrCode(id);
      if (!commodity) {
        res.status(404).json({
          success: false,
          error: { code: 'COMMODITY_NOT_FOUND', message: `Commodity '${id}' not found` },
        });
        return;
      }
      res.json(successResponse(commodity));
    } catch (error) {
      next(error);
    }
  }
}

export const commodityController = new CommodityController();
