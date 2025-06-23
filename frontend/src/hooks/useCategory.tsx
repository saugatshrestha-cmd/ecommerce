import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, searchCategory } from '@/services/categoryService';
import type { Category, CreateCategory, UpdateCategory } from '@/types/categoryTypes';

export function useCategories() {
    return useQuery<Category[], unknown>({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    });
}

export const useCategoryById = (id: string) => {
    return useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    });
};

export const useSearchCategory = (query: string) => {
    return useQuery<Category[]>({
        queryKey: ['search', query],
        queryFn: () => searchCategory(query),
        enabled: !!query
    });
};

export function useCreateCategory() {
    const qc = useQueryClient();
    return useMutation<Category, unknown, CreateCategory>({
        mutationFn: createCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['category'] }),
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();
    return useMutation<Category, unknown, { id: string; data: UpdateCategory }>({
        mutationFn: ({ id, data }) => updateCategory(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
    });
}