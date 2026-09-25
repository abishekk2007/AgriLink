import { CorsOptions } from 'cors';
import { config } from './env.config';

/**
 * Parses allowed origins from environment configuration
 */
function getAllowedOrigins(): string[] | '*' {
  const originStr = config.cors.origin.trim();
  if (originStr === '*') {
    return '*';
  }
  return originStr.split(',').map((o) => o.trim()).filter(Boolean);
}

/**
 * Production-ready CORS options configuration
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();

    // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowed === '*') {
      return callback(null, true);
    }

    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin '${origin}' not allowed by CORS policy`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Api-Key'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400, // 24 hours preflight cache
};
