import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1, 'Label is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z
      .string()
      .length(2, 'State must be exactly 2 characters')
      .regex(/^[A-Z]{2}$/, 'State must be 2 uppercase letters'),
    zipCode: z.string().min(1, 'Zip code is required'),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1, 'Label is required').optional(),
    street: z.string().min(1, 'Street is required').optional(),
    city: z.string().min(1, 'City is required').optional(),
    state: z
      .string()
      .length(2, 'State must be exactly 2 characters')
      .regex(/^[A-Z]{2}$/, 'State must be 2 uppercase letters')
      .optional(),
    zipCode: z.string().min(1, 'Zip code is required').optional(),
    isDefault: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export const addressIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>['body'];
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>['body'];
