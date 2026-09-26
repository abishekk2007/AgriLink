import { z } from 'zod';

export const CreateAlertSchema = z.object({
  commodityId: z.string().min(1, 'Commodity ID is required'),
  marketId: z.string().min(1, 'Market ID is required'),
  targetPrice: z.coerce.number().positive('Target price must be a positive number'),
  condition: z.enum(['ABOVE', 'BELOW'], {
    errorMap: () => ({ message: 'Condition must be either ABOVE or BELOW' }),
  }),
  userId: z.string().optional(),
  notes: z.string().max(255).optional(),
});

export const UpdateAlertSchema = z.object({
  targetPrice: z.coerce.number().positive().optional(),
  condition: z.enum(['ABOVE', 'BELOW']).optional(),
  status: z.enum(['ACTIVE', 'TRIGGERED', 'DISABLED']).optional(),
  notes: z.string().max(255).optional(),
});
