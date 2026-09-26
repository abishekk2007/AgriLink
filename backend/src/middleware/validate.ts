import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { errorResponse } from '../utils/responseFormatter.js';

export const validate = (
  schema: z.ZodTypeAny,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req[source]);
      req[source] = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json(
          errorResponse('VALIDATION_ERROR', 'Invalid request parameters or payload', details)
        );
        return;
      }
      next(error);
    }
  };
};
