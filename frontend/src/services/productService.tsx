import { api } from "@/utils/api";
import type { Product, Filters, PriceRange } from "@/types/productTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getAllProducts = async (limit?: number): Promise<Product[]> => {
    const url = limit ? `/products?limit=${limit}` : `/products`;
    const res = await api.get(url);
    return res.data.data;
}

export const getBannerProducts = async (): Promise<Product[]> => {
    const res = await api.get<ApiResponse<Product[]>>("/products/banners");
    return res.data.data;
}

export const updateBannerStatus = async (id: string, status: boolean) => {
    const response = await api.patch(`/products/${id}/banner-status`, {
        bannerStatus: status,
    });
    return response.data;
};

export const updateActiveStatus = async (id: string, status: boolean) => {
    const response = await api.patch(`/products/${id}/active-status`, {
        isActive: status,
    });
    return response.data;
};


export const getFilteredProducts = async (filters: Filters): Promise<Product[]> => {
    const res = await api.get<ApiResponse<Product[]>>("/products/filter", { params: filters });
    return res.data.data;
}

export const getPriceRange = async (categoryId?: string): Promise<PriceRange> =>  {
    const res = await api.get<ApiResponse<PriceRange>>("/products/price-range", {
        params: categoryId ? { categoryId } : {},
    });
    return res.data.data;
}

export const newestProducts = async (limit?: number): Promise<Product[]> => {
    const url = limit ? `/products/new?limit=${limit}` : `/products/new`;
    const res = await api.get(url);
    return res.data.data;
}

export const searchProducts = async (query: string): Promise<Product[]> => {
    const res = await api.get('/products/search', {
        params: { query }
    });
    return res.data.data;
}

export const getProductById = async (id: string): Promise<Product> => {
    const res = await api.get<ApiResponse<Product>>(`/products/view/${id}`);
    return res.data.data;
}

export const getFeaturedProduct = async (): Promise<Product[]> => {
    const res = await api.get<ApiResponse<Product[]>>('/products/featured');
    return res.data.data;
}

export const getSellerProduct = async (): Promise<Product[]> => {
    const res = await api.get<ApiResponse<Product[]>>('/products/seller');
    return res.data.data;
}

export const createProduct = async (payload: FormData) => {
    const res = await api.post<Product>('/products', payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

export const updateProduct = async (id: string, payload: FormData) => {
    const res = await api.put<Product>(`/products/seller/${id}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

export const adminUpdateProduct = async (id: string, payload: FormData) => {
    const res = await api.put<Product>(`/products/product/${id}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

export const deleteProduct = async (id: string) =>{
    const res = await api.delete<void>(`/products/delete/${id}`)
    return res.data;
}

export const deleteProductAdmin = async (id: string) =>{
    const res = await api.delete<void>(`/products/product/${id}`)
    return res.data;
}
