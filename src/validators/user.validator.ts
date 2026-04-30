import { z } from 'zod';
import { PASSWORD } from '../utils/constants';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z
      .string()
      .min(PASSWORD.MIN_LENGTH, `Password must be at least ${PASSWORD.MIN_LENGTH} characters`)
      .regex(/\d/, 'Password must contain at least one number')
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export const updateAccessibilitySchema = z.object({
  body: z.object({
    fontScale: z.number().min(0.5).max(2.0).optional(),
    highContrast: z.boolean().optional(),
    largeButtons: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type UpdateAccessibilityInput = z.infer<typeof updateAccessibilitySchema>['body'];
