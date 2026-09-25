import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Environment variables schema definition with runtime validation and sensible defaults
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  HOST: z.string().default('0.0.0.0'),
  API_PREFIX: z.string().default('/api'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().positive().default(100),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  MARKET_API_URL: z.string().url().default('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'),
  MARKET_API_KEY: z.string().optional().default(''),
  MARKET_API_TIMEOUT: z.coerce.number().positive().default(10000),
  DATA_GOV_IN_API_KEY: z.string().optional().default(''),
  DATA_GOV_IN_BASE_URL: z.string().url().default('https://api.data.gov.in/resource'),
  AGMARKNET_RESOURCE_ID: z.string().default('9ef84268-d588-465a-a308-a864a43d0070'),
  DATABASE_URL: z.string().optional().default(''),
});

const parsedEnv = envSchema.safeParse(process.cwd() ? process.env : {});

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Centralized, strongly typed application configuration
 */
export const config = Object.freeze({
  env: parsedEnv.data.NODE_ENV,
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isTest: parsedEnv.data.NODE_ENV === 'test',
  server: {
    port: parsedEnv.data.PORT,
    host: parsedEnv.data.HOST,
    apiPrefix: parsedEnv.data.API_PREFIX,
  },
  cors: {
    origin: parsedEnv.data.CORS_ORIGIN,
  },
  rateLimit: {
    windowMs: parsedEnv.data.RATE_LIMIT_WINDOW_MS,
    maxRequests: parsedEnv.data.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: parsedEnv.data.LOG_LEVEL,
  },
  marketApi: {
    baseUrl: parsedEnv.data.MARKET_API_URL,
    apiKey: parsedEnv.data.MARKET_API_KEY || parsedEnv.data.DATA_GOV_IN_API_KEY,
    timeout: parsedEnv.data.MARKET_API_TIMEOUT,
  },
  agriculturalApi: {
    apiKey: parsedEnv.data.DATA_GOV_IN_API_KEY,
    baseUrl: parsedEnv.data.DATA_GOV_IN_BASE_URL,
    resourceId: parsedEnv.data.AGMARKNET_RESOURCE_ID,
  },
  database: {
    url: parsedEnv.data.DATABASE_URL,
  },
});
