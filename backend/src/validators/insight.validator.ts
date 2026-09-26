import { z } from 'zod';

export const InsightAnalysisSchema = z.object({
  commodityId: z.string().optional(),
  commodityName: z.string().optional(),
  marketId: z.string().optional(),
  marketName: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  lang: z.enum(['en', 'ta']).optional().default('en'),
});

export const TransportCalculationSchema = z.object({
  marketPrice: z.coerce.number().positive('Market price must be greater than zero'),
  distanceKm: z.coerce.number().min(0, 'Distance cannot be negative'),
  transportRatePerKm: z.coerce.number().min(0, 'Rate cannot be negative'),
  quantityKg: z.coerce.number().min(1).optional().default(1000), // default to 1 tonne for demonstration
});
