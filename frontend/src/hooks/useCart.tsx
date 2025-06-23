import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyCart,
    getMyCartSummary,
    createMyCart,
    updateMyCart,
    removeCartItem
} from "@/services/cartService";
import type {
    Cart,
    CartSummary,
    CreateCart,
} from "@/types/cartTypes";
import type { AxiosError } from "axios";
import { useAuthContext } from "@/context/authContext";

export const useCart = () => {
    const { isAuthenticated } = useAuthContext();
    return useQuery<Cart, AxiosError>({
        queryKey: ["cart"],
        queryFn: getMyCart,
        enabled: isAuthenticated,
        retry: false,
        staleTime: 15 * 60 * 1000,
    });
};

export const useCartSummary = () => {
    const { isAuthenticated } = useAuthContext();
    return useQuery<CartSummary, AxiosError>({
        queryKey: ["cart-summary"],
        queryFn: getMyCartSummary,
        enabled: isAuthenticated,
    });
};

export const useCreateCart = () => {
    const queryClient = useQueryClient();

    return useMutation<Cart, AxiosError, CreateCart>({
    mutationFn: createMyCart,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
    },
    onError: (err) => {
        console.error("Create cart failed", err);
    },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation<Cart, AxiosError, { productId: string; quantity: number }>({
    mutationFn: ({ productId, quantity }) => updateMyCart(productId, quantity),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
    },
    onError: (err) => {
        console.error("Update cart item failed", err);
    },
    });
};

export const useRemoveCartItem = () => {
    const qc = useQueryClient();
    return useMutation<Cart, AxiosError, string>({
        mutationFn: removeCartItem,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['cart'] });
            qc.invalidateQueries({ queryKey: ['cart-summary'] });
        },
        onError: (err) => {
            console.error("Update cart item failed", err);
        },
    });
}
