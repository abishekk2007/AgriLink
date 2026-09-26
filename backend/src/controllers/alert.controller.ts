import { Request, Response, NextFunction } from 'express';
import { alertService } from '../services/alert.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export class AlertController {
  async createAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const { commodityId, marketId, targetPrice, condition, notes, userId } = req.body;
      const alert = await alertService.createAlert({
        commodityId,
        marketId,
        targetPrice: parseFloat(targetPrice),
        condition,
        notes,
        userId,
      });

      res.status(201).json(successResponse(alert));
    } catch (error) {
      next(error);
    }
  }

  async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, userId } = req.query as any;
      const alerts = await alertService.getAlerts(status, userId);
      res.json(successResponse(alerts, { count: alerts.length }));
    } catch (error) {
      next(error);
    }
  }

  async updateAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await alertService.updateAlert(id, req.body);
      res.json(successResponse(updated));
    } catch (error) {
      next(error);
    }
  }

  async deleteAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await alertService.deleteAlert(id);
      res.json(successResponse({ deleted: true, id }));
    } catch (error) {
      next(error);
    }
  }

  async checkAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await alertService.checkAndTriggerAlerts();
      res.json(successResponse(summary));
    } catch (error) {
      next(error);
    }
  }
}

export const alertController = new AlertController();
