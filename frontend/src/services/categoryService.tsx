import { api } from "@/utils/api";
import type { Category, CreateCategory, UpdateCategory } from "@/types/categoryTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getAllCategories = async () => {
    const res = await api.get<ApiResponse<Category[]>>('/categories')
    return res.data.data;
}
    
export const getCategoryById = async (id: string) => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${id}`)
    return res.data.data;
}

export const searchCategory = async (query: string): Promise<Category[]> => {
    const res = await api.get('/categories/search', {
        params: { query }
    });
    return res.data.data;
}

export const createCategory = async (payload: CreateCategory) => {
    const res = await api.post<ApiResponse<Category>>('/categories', payload)
    return res.data.data;
}

export const updateCategory = async (id: string, payload: UpdateCategory) => {
    const res = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload)
    return res.data.data;
}

export const deleteCategory = async (id: string) => {
    const res = await api.delete<void>(`/categories/${id}`)
    return res.data;
}

