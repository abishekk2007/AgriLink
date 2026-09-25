import { Response } from 'express';
import { ApiResponseFormat, HttpStatus, HttpStatusCode } from '../types/api.types';

/**
 * Standard API response formatter adhering strictly to:
 * {
 *   "success": true,
 *   "message": "API response message",
 *   "data": {}
 * }
 */
export class ApiResponse {
  /**
   * Dispatches a standard success response
   */
  static success<T>(
    res: Response,
    message = 'API response message',
    data?: T,
    statusCode: HttpStatusCode = HttpStatus.OK,
    extraProps?: Record<string, unknown>
  ): Response {
    const payload: ApiResponseFormat<T> = {
      success: true,
      message,
      ...(data !== undefined ? { data } : {}),
      ...(extraProps || {}),
    };

    return res.status(statusCode).json(payload);
  }

  /**
   * Dispatches a 201 Created response
   */
  static created<T>(
    res: Response,
    message = 'Resource created successfully',
    data?: T
  ): Response {
    return ApiResponse.success(res, message, data, HttpStatus.CREATED);
  }

  /**
   * Dispatches a 204 No Content response
   */
  static noContent(res: Response): Response {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
