import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    originalPrice: z.number().positive('Original price must be positive').optional(),
    stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
    categoryId: z.number().int().positive('Category ID is required'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    imageAlt: z.string().optional(),
    rating: z.number().min(0).max(5, 'Rating must be between 0 and 5').optional(),
    ratingCount: z.number().int().min(0, 'Rating count must be non-negative').optional(),
    badge: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().positive('Price must be positive').optional(),
    originalPrice: z.number().positive('Original price must be positive').optional().nullable(),
    stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
    categoryId: z.number().int().positive('Category ID is required').optional(),
    imageUrl: z.string().url('Invalid image URL').optional().nullable(),
    imageAlt: z.string().optional().nullable(),
    rating: z.number().min(0).max(5, 'Rating must be between 0 and 5').optional().nullable(),
    ratingCount: z.number().int().min(0, 'Rating count must be non-negative').optional().nullable(),
    badge: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    active: z.enum(['true', 'false']).optional(),
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => parseInt(val, 10)),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform((val) => parseInt(val, 10)),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type GetProductsQuery = z.infer<typeof getProductsSchema>['query'];
