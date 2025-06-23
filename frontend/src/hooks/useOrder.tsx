import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getUserOrders,
    createUserOrder,
    cancelUserOrder,
    deleteUserOrder,
    getSellerOrders,
    updateOrderItemStatus,
    getAllOrders,
    getOrderById,
    cancelOrderAsAdmin,
    deleteOrderAsAdmin
} from '@/services/orderService';
import type { Order, CreateOrder, CancelOrder, UpdateOrderStatus, OrderStripe } from '@/types/orderTypes';
import { AxiosError } from 'axios';

export function useUserOrders() {
    return useQuery<Order[], AxiosError>({
        queryKey: ['userOrders'],
        queryFn: getUserOrders,
    });
}

export function useCreateUserOrder() {
    const qc = useQueryClient();
    return useMutation<OrderStripe, AxiosError, CreateOrder>({
        mutationFn: createUserOrder,
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['userOrders'] });
        qc.invalidateQueries({ queryKey: ['cart', 'summary'] });
        },
    });
}

export function useCancelUserOrder() {
    const qc = useQueryClient();
    return useMutation<void, AxiosError, CancelOrder>({
        mutationFn: cancelUserOrder,
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['userOrders'] });
        },
    });
}

export function useDeleteUserOrder() {
    const qc = useQueryClient();
    return useMutation<void, AxiosError, string>({
        mutationFn: deleteUserOrder,
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['userOrders'] });
        },
    });
}

export function useSellerOrders() {
    return useQuery<Order[], AxiosError>({
        queryKey: ['sellerOrders'],
        queryFn: getSellerOrders,
    });
}

export function useUpdateOrderItemStatus() {
    const qc = useQueryClient();
    return useMutation<Order, AxiosError, UpdateOrderStatus>({
        mutationFn: updateOrderItemStatus,
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['sellerOrders'] });
        },
    });
}

export function useAllOrders() {
    return useQuery<Order[], AxiosError>({
        queryKey: ['allOrders'],
        queryFn: getAllOrders,
    });
}

export function useOrderById(id: string) {
    return useQuery<OrderStripe, AxiosError>({
        queryKey: ['order', id],
        queryFn: () => getOrderById(id),
    });
}

export function useCancelOrderAsAdmin() {
    const qc = useQueryClient();
    return useMutation<void, AxiosError, string>({
        mutationFn: cancelOrderAsAdmin,
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['allOrders'] });
        },
    });
}

export function useDeleteOrderAsAdmin() {
    const qc = useQueryClient();
    return useMutation<void, AxiosError, string>({
        mutationFn: deleteOrderAsAdmin,
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['allOrders'] });
        },
    });
}
