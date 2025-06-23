import { api } from "@/utils/api";
import type { Cart, CreateCart, UpdateCart, CartSummary } from "@/types/cartTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getMyCart = async () => {
    const res = await api.get<ApiResponse<Cart>>('/carts/user')
    return res.data.data;
}

export const createMyCart = async (payload: CreateCart) => {
    console.log('Sending create cart request with payload:', payload);
    const response = await api.post<ApiResponse<Cart>>('/carts', payload);
    console.log('Create cart response:', response);
    return response.data.data;
};

export const updateMyCart = async (productId: string, quantity: number) => {
    const payload: UpdateCart = { productId, quantity };
    const res = await api.put<ApiResponse<Cart>>(`/carts/update/${productId}`, payload);
    return res.data.data;
};

export const removeCartItem = async (productId: string) => {
    const res = await api.delete<ApiResponse<Cart>>(`/carts/delete/${productId}`);
    return res.data.data;
};

export const getMyCartSummary = async (): Promise<CartSummary> => {
    const res = await api.get<ApiResponse<CartSummary>>('/carts/summary');
    return res.data.data;
};

