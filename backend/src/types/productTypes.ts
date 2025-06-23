import { ProductStatus } from "./enumTypes";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    images: string[]; 
    sellerId: string;
    status: ProductStatus;
    bannerProduct: boolean;
    bannerTitle: string;
    bannerDescription: string;
    bannerImage: string;
    isActive: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductInput {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    images?: string[]; // For incoming file uploads
    sellerId: string;
    status: ProductStatus; // Made optional with default
    deletedAt?: Date | null;
}
