import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    getAllProducts,
    getBannerProducts, 
    newestProducts, 
    getProductById, 
    createProduct, 
    updateProduct,
    adminUpdateProduct,
    updateBannerStatus,
    updateActiveStatus, 
    deleteProduct, 
    deleteProductAdmin, 
    searchProducts, 
    getSellerProduct,
    getFeaturedProduct,
    getFilteredProducts,
    getPriceRange 
} from '@/services/productService';
import type { Product, Filters } from '@/types/productTypes';

export const usePriceRange = (categoryId?: string) => {
    return useQuery({
        queryKey: ["price-range", categoryId],
        queryFn: () => getPriceRange(categoryId),
    });
}
export const useFilteredProducts = (filters: Filters) => {
    return useQuery({
        queryKey: ["filtered-products", filters],
        queryFn: () => getFilteredProducts(filters),
        placeholderData: (prev) => prev,
    });
}

export const useProductsLimit = (limit?: number) => {
    return useQuery<Product[]>({
        queryKey: ['products', limit],
        queryFn: () => getAllProducts(limit),
    });
};

export const useNewProductsLimit = (limit?: number) => {
    return useQuery<Product[]>({
        queryKey: ['new-products', limit],
        queryFn: () => newestProducts(limit),
    });
};

export const useProducts = () => {
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: () => getAllProducts(),
    });
};

export const useBannerProducts = () => {
    return useQuery<Product[]>({
        queryKey: ['banner-products'],
        queryFn: () => getBannerProducts(),
    });
};

export const useSearchProducts = (query: string) => {
    return useQuery<Product[]>({
        queryKey: ['search', query],
        queryFn: () => searchProducts(query),
        enabled: !!query
    });
};

export const useFeaturedProducts = () => {
    return useQuery<Product[]>({
        queryKey: ['featured-products'],
        queryFn: getFeaturedProduct,
    });
};

export const useSellerProducts = () => {
    return useQuery<Product[]>({
        queryKey: ['seller-products'],
        queryFn: getSellerProduct,
    });
};

export const useUpdateBannerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => 
      updateBannerStatus(id, status),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['products'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['product', variables.id] 
      });
    },
    
  });
};

export const useUpdateActiveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => 
      updateActiveStatus(id, status),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['products'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['product', variables.id] 
      });
    },
  });
};

export const useProduct = (id: string) => {
    return useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id, 
    });
};

export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation<Product, unknown, FormData>({
        mutationFn: createProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] });
            qc.invalidateQueries({ queryKey: ['seller-products'] });
        },
    });
}

export function useUpdateProduct() {
    const qc = useQueryClient();
    return useMutation<Product, unknown, {id: string, data: FormData}>({
    mutationFn: ({ id, data }) => updateProduct(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['product'] });
            qc.invalidateQueries({ queryKey: ['products'] });
            qc.invalidateQueries({ queryKey: ['seller-products'] });
        },
    });
}

export function useAdminUpdateProduct() {
    const qc = useQueryClient();
    return useMutation<Product, unknown, {id: string, data: FormData}>({
    mutationFn: ({ id, data }) => adminUpdateProduct(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['product'] });
            qc.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useDeleteProductAdmin() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteProductAdmin,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: deleteProduct,
        onSuccess: (_, id) => {
            qc.setQueriesData<Product[]>(
                { queryKey: ['seller-products'] },
                (old) => old?.filter(product => product._id !== id) || []
            );
            qc.invalidateQueries({ queryKey: ['seller-products'] });
        },
    });
}