import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(2, { message: 'Name too short' }),
    description: z.string().min(20, { message: 'Description too short' }),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2, { message: 'Name too short' }).optional(),
    description: z.string().min(20, { message: 'Description too short' }).optional(),
});

