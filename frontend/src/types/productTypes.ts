import { ProductStatus } from "./enumTypes";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: CategoryInfo;
    images: ImageInfo[];
    sellerId: SellerInfo;
    featured: boolean;
    bannerProduct: boolean;
    bannerTitle:string;
    bannerImage: BannerImage;
    bannerDescription: string;
    isActive: boolean;
    status: ProductStatus;
    createdAt: Date;
}

export interface SellerInfo {
    _id: string;
    storeName: string;
    email: string;
    address: string;
}

export interface ImageInfo {
    _id: string;
    originalName: string;
    url: string;
}

export interface BannerImage {
    _id: string;
    originalName: string;
    url: string;
}

export interface CategoryInfo {
    _id: string;
    name: string;
}

export interface CreateProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    images: File[]; 
}

export interface UpdateProduct {
    _id: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    categoryId?: string;
    images?: File[];
    bannerTitle?:string;
    bannerImage?: BannerImage[];
    bannerDescription?: string;
    status?: ProductStatus;
}

export interface Filters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: "newest" | "price-high-low" | "price-low-high" | "name-a-z" | "name-z-a";
}

export interface PriceRange {
    minPrice: number;
    maxPrice: number;
}