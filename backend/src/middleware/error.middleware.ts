import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiErrorFormat, HttpStatus } from '../types/api.types';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

/**
 * Global centralized error-handling middleware
 * Formats errors into the standard contract:
 * {
 *   "success": false,
 *   "message": "Error message"
 * }
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;
  let stack: string | undefined = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
    stack = err.stack;
  } else if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Malformed JSON payload received';
  } else if (err instanceof Error) {
    message = err.message || 'Internal Server Error';
    stack = err.stack;
  }

  // Log error with appropriate severity
  if (statusCode >= 500) {
    logger.error(`[500 Server Error] ${req.method} ${req.originalUrl}: ${message}`, {
      stack,
      errors,
    });
  } else {
    logger.warn(`[${statusCode} Client Error] ${req.method} ${req.originalUrl}: ${message}`);
  }

  const payload: ApiErrorFormat = {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
    ...(config.isDevelopment && stack ? { stack } : {}),
  };

  res.status(statusCode).json(payload);
};
