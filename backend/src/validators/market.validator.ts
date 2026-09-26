import { z } from 'zod';

export const MarketPriceQuerySchema = z.object({
  commodity: z.string().min(1, 'Commodity is required'),
  state: z.string().optional(),
  district: z.string().optional(),
  market: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
  days: z.coerce.number().int().positive().max(365).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['startDate'],
  }
);

export const MarketComparisonQuerySchema = z.object({
  commodity: z.string().min(1, 'Commodity is required'),
  state: z.string().optional(),
  district: z.string().optional(),
  markets: z.string().optional(), // Comma-separated list of market names or IDs
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  distanceKm: z.coerce.number().min(0).optional(),
  transportRatePerKm: z.coerce.number().min(0).optional(),
  quantityKg: z.coerce.number().min(1).optional(),
});
