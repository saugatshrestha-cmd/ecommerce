import { z } from 'zod';

export const shippingSchema = z.object({
    full_name: z.string().min(2, { message: 'Name too short' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().regex(/^\d+$/, 'Phone must contain only numbers').min(10, 'Phone must be at least 10 digits'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    region: z.string().min(3, 'Region must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters')
});

export const updateShippingSchema = z.object({
    full_name: z.string().min(2, { message: 'Name too short' }).optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    phone: z.string().regex(/^\d+$/, 'Phone must contain only numbers').min(10, 'Phone must be at least 10 digits').optional(),
    address: z.string().min(5, 'Address must be at least 5 characters').optional(),
    region: z.string().min(3, 'Region must be at least 3 characters').optional(),
    city: z.string().min(3, 'City must be at least 3 characters').optional()
});
