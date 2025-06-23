import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(3, "Product name is required"),
    description: z.string().min(10, "Description is required"),
    price: z.number().min(1, "Price must be positive"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    categoryId: z.string().min(1, "Category is required"),
    images: z
    .any()
    .refine((files: FileList) => files?.length > 0, "At least one image is required")
    .refine(
        (files: FileList) =>
        Array.from(files).every(file =>
            ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
        ),
        "Only .jpg, .jpeg, and .png files are allowed"
    ),
});

export const updateProductSchema = z.object({
    name: z.string().min(3, "Product name is required").optional(),
    description: z.string().min(20, "Description is required").optional(),
    price: z.number().min(1, "Price must be positive").optional(),
    quantity: z.number().int().min(1, "Quantity must be at least 0").optional(),
    categoryId: z.string().min(1, "Category is required").optional(),
    images: z
    .any()
    .refine((files: FileList) => files?.length > 0, "At least one image is required")
    .refine(
        (files: FileList) =>
        Array.from(files).every(file =>
            ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
        ),
        "Only .jpg, .jpeg, and .png files are allowed"
    ).optional(),
    bannerProduct: z.boolean().optional(),
    bannerTitle: z.string().min(3, "Product name is required").optional(),
    bannerDescription: z.string().min(20, "Description is required").optional(),
    bannerImage: z
    .any()
    .refine((files: FileList) => files?.length > 0, "At least one image is required")
    .refine(
        (files: FileList) =>
        Array.from(files).every(file =>
            ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
        ),
        "Only .jpg, .jpeg, and .png files are allowed"
    ).optional(),
});


