import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number().int().positive('Product ID must be a positive number'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export const cartItemIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>['body'];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>['body'];
