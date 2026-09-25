import { HttpStatus, HttpStatusCode } from '../types/api.types';

/**
 * Custom operational API Error class
 */
export class ApiError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    errors?: unknown,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors?: unknown): ApiError {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(HttpStatus.FORBIDDEN, message);
  }

  static notFound(message = 'Resource Not Found'): ApiError {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  static unprocessable(message = 'Unprocessable Entity', errors?: unknown): ApiError {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }

  static tooManyRequests(message = 'Too Many Requests'): ApiError {
    return new ApiError(HttpStatus.TOO_MANY_REQUESTS, message);
  }

  static internal(message = 'Internal Server Error', errors?: unknown): ApiError {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, errors, false);
  }
}
