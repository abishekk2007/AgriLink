import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env.js';
import { errorResponse } from '../utils/responseFormatter.js';

export const apiRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      errorResponse(
        'TOO_MANY_REQUESTS',
        'Too many requests from this IP address, please try again later.'
      )
    );
  },
});
