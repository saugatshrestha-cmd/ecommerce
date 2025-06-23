import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be 6+ chars' }),
});

export const registerCustomerSchema = z.object({
    firstName: z.string().min(2, { message: 'Name too short' }),
    lastName: z.string().min(2, { message: 'Name too short' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be 6+ chars' }),
    phone: z.string().regex(/^\d+$/, 'Phone must contain only numbers').min(10, 'Phone must be at least 10 digits'),
    address: z.string().min(6, 'Address must be at least 10 characters')
});

export const registerSellerSchema = z.object({
    storeName: z.string().min(2, { message: 'Name too short' }),
    email:    z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be 6+ chars' }),
    phone: z.string().regex(/^\d+$/, 'Phone must contain only numbers').min(10, 'Phone must be at least 10 digits'),
    address: z.string().min(6, 'Address must be at least 10 characters')
});

export const registerAdminSchema = registerCustomerSchema;
