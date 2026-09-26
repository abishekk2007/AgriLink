import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/agrilink_db?schema=public',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
    : 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
    : 200,
};
