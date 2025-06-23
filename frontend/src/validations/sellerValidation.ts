import { z } from 'zod';

export const updateSellerSchema = z.object({
    storeName: z.string().min(2, { message: 'Name too short' }).optional(),
    phone: z.string().regex(/^\d+$/, 'Phone must contain only numbers').min(10, 'Phone must be at least 10 digits').optional(),
    address: z.string().min(6, 'Address must be at least 10 characters').optional()
});

export const updateEmailSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(6, { message: 'Password must be 6+ chars' }),
    newPassword: z.string().min(6, { message: 'Password must be 6+ chars' })
});
