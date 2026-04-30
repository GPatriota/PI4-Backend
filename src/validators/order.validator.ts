import { z } from 'zod';
import { PAGINATION } from '../utils/constants';

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export const getOrdersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .default(String(PAGINATION.DEFAULT_PAGE))
      .transform((val) => parseInt(val, 10))
      .optional(),
    limit: z
      .string()
      .default(String(PAGINATION.DEFAULT_LIMIT))
      .transform((val) => parseInt(val, 10))
      .optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'SHIPPED', 'DELIVERED']),
  }),
});

export type GetOrdersQuery = z.infer<typeof getOrdersSchema>['query'];
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>['body'];
