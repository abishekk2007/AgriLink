import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware that logs HTTP requests with timing, method, URL, status code, and IP
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const timeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const statusCode = res.statusCode;
    const method = req.method;
    const url = req.originalUrl || req.url;

    const logMessage = `${method} ${url} ${statusCode} - ${timeMs}ms - IP: ${clientIp}`;

    if (statusCode >= 500) {
      logger.error(logMessage);
    } else if (statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.http(logMessage);
    }
  });

  next();
};
