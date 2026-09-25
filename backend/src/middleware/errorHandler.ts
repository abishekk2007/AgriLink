import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

/**
 * Global Centralized Error Handling Middleware
 * Handles:
 * - API / Business logic failures
 * - Database (Prisma) errors
 * - Schema validation errors (Zod)
 * - Unknown internal errors
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: unknown = undefined;

  // 1. Handle custom operational ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // 2. Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error: ' + err.issues.map((i) => i.message).join(', ');
    errors = err.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
  }
  // 3. Handle Prisma Database Errors
  else if (err && typeof err === 'object' && 'code' in err && typeof (err as any).code === 'string') {
    const prismaCode = (err as any).code;
    logger.error(`[Database Error] Code ${prismaCode}: ${(err as any).message}`);

    if (prismaCode === 'P2002') {
      statusCode = 409;
      message = 'A record with this unique identifier already exists in the database';
    } else if (prismaCode === 'P2025') {
      statusCode = 404;
      message = 'Requested record not found in the database';
    } else {
      statusCode = 500;
      message = 'Database operation failed';
    }
  }
  // 4. Handle JSON Body Parser syntax errors
  else if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    statusCode = 400;
    message = 'Malformed JSON payload received';
  }
  // 5. General Error
  else if (err instanceof Error) {
    message = err.message || 'Something went wrong';
  }

  // Structured logging
  if (statusCode >= 500) {
    logger.error(`[500 Server Error] ${req.method} ${req.originalUrl}: ${message}`, {
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else {
    logger.warn(`[${statusCode} Client Error] ${req.method} ${req.originalUrl}: ${message}`);
  }

  // Standard response contract per Requirement 7
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
    ...(config.isDevelopment && err instanceof Error ? { stack: err.stack } : {}),
  });
};
