import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config/env.config';
import { corsOptions } from './config/cors.config';
import { requestLogger, notFoundHandler, errorHandler } from './middleware';
import apiRouter from './routes';
import marketRoutes from './routes/marketRoutes';
import priceRoutes from './modules/prices/price.routes';
import comparisonRoutes from './modules/comparison/comparison.routes';
import insightRoutes from './routes/insightRoutes';
import alertRoutes from './modules/alerts/alert.routes';
import { ApiResponse } from './utils/ApiResponse';

/**
 * Express Application Configuration Factory
 */
export const createApp = (): Application => {
  const app: Application = express();

  // 1. Security HTTP Headers with Helmet
  app.use(helmet());

  // 2. CORS Policy Middleware
  app.use(cors(corsOptions));

  // 3. HTTP Request Logging with Morgan & High-Resolution Timer
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
  app.use(requestLogger);

  // 4. Built-in JSON and Form Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 5. Base Welcome Route
  app.get('/', (_req: Request, res: Response) => {
    ApiResponse.success(res, 'Welcome to AgriLink Backend API', {
      name: 'AgriLink - Agricultural Market Intelligence Platform',
      version: '1.0.0',
      status: 'production-ready',
      endpoints: {
        health: '/api/health',
        marketData: '/api/market/data',
        marketTest: '/api/market/test',
        marketComparison: '/api/markets/compare',
        priceHistory: '/api/prices/history',
        priceAnalytics: '/api/prices/analytics',
        farmerInsights: '/api/insights',
        priceAlerts: '/api/alerts',
      },
    });
  });

  // 6. Register Functional Domain Modules
  app.use('/api/market', marketRoutes);
  app.use('/api/markets', comparisonRoutes);
  app.use('/api/prices', priceRoutes);
  app.use('/api/insights', insightRoutes);
  app.use('/api/alerts', alertRoutes);

  // 7. Mount Master Aggregated API Router (/api)
  app.use(config.server.apiPrefix, apiRouter);

  // 8. 404 Unmatched Route Handler
  app.use(notFoundHandler);

  // 9. Centralized Error Handler (API, DB, Validation, Unknown)
  app.use(errorHandler);

  return app;
};

export const app = createApp();
