import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseFormatter.js';
import { ENV } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected server error occurred.';

  const details = ENV.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json(errorResponse(errorCode, message, details));
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    errorResponse('NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`)
  );
}
