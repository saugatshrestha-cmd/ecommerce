import { api } from "@/utils/api";
import type { Order, CreateOrder, UpdateOrderStatus, OrderStripe } from "@/types/orderTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getUserOrders = async () => {
    const res = await api.get<ApiResponse<Order[]>>('/orders/user')
    return res.data.data;
}

export const createUserOrder = (payload: CreateOrder) =>
    api.post<OrderStripe>('/orders', payload)
    .then(r => r.data);

export const cancelUserOrder = (payload: { orderId: string }) =>
    api.put<void>('/orders/cancel', payload)
    .then(r => r.data);

export const deleteUserOrder = (id: string) =>
    api.delete<void>(`/orders/delete/${id}`)
    .then(r => r.data);

export const getSellerOrders = async () => {
    const res = await api.get<ApiResponse<Order[]>>('/orders/seller')
    return res.data.data
}

export const updateOrderItemStatus = async (payload: UpdateOrderStatus) => {
    const res =  await api.put<Order>('/orders/seller', payload)
    return res.data;
}

export const getAllOrders = () =>
    api.get<Order[]>('/orders')
    .then(r => r.data);

export const getOrderById = async (id: string) => {
    const res = await api.get<OrderStripe>(`/orders/user/${id}`)
    return res.data;
}

export const cancelOrderAsAdmin = (id: string) =>
    api.put<void>(`/orders/${id}/cancel`)
    .then(r => r.data);

export const deleteOrderAsAdmin = (id: string) =>
    api.delete<void>(`/orders/${id}`)
    .then(r => r.data);

