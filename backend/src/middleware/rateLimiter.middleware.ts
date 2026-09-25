import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.config';
import { ApiError } from '../utils/ApiError';

interface ClientRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting by IP
const clientStore = new Map<string, ClientRecord>();

// Periodic cleanup of expired rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of clientStore.entries()) {
    if (now > record.resetTime) {
      clientStore.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * In-memory sliding window rate limiter middleware
 */
export const rateLimiter = (
  windowMs = config.rateLimit.windowMs,
  maxRequests = config.rateLimit.maxRequests
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Resolve client IP (support reverse proxies)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress || '127.0.0.1';

    const now = Date.now();
    let record = clientStore.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      clientStore.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const resetTimeSeconds = Math.ceil((record.resetTime - now) / 1000);

    // Standard rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTimeSeconds);

    if (record.count > maxRequests) {
      res.setHeader('Retry-After', resetTimeSeconds);
      return next(
        ApiError.tooManyRequests(
          `Too many requests from this IP. Please try again after ${resetTimeSeconds} seconds.`
        )
      );
    }

    next();
  };
};
