import { Request, Response, NextFunction } from 'express';
import { marketService } from '../services/market.service.js';
import { insightService } from '../services/insight.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export class InsightController {
  async analyzeMarketInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { commodityId, commodityName, marketId, marketName, startDate, endDate, lang } = req.body;

      const targetCommodity = commodityName || commodityId || 'Tomato';
      const targetMarket = marketName || marketId || 'Koyambedu';

      const marketData = await marketService.getMarketPrices({
        commodity: targetCommodity,
        market: targetMarket,
        startDate,
        endDate,
        lang: lang || 'en',
      });

      if (!marketData.stats) {
        res.status(404).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_DATA',
            message: 'Not enough historical data points to generate rule-based insights.',
          },
        });
        return;
      }

      const insight = insightService.generateInsights(
        marketData.stats,
        lang || 'en',
        marketData.commodity.name,
        marketData.market?.name || 'APMC'
      );

      res.json(
        successResponse({
          trend: insight.trend,
          percentageChange: insight.percentageChange,
          pricePosition: insight.pricePosition,
          volatility: insight.volatility,
          insights: insight.insights,
          disclaimer: insight.disclaimer,
          stats: marketData.stats,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export const insightController = new InsightController();
