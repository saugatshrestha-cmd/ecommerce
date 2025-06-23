import { api } from "@/utils/api";
import type { ShipmentInfo, CreateShipmentInfo, UpdateShipmentInfo } from "@/types/shippingTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getAllShipping = async () => {
    const res = await api.get<ApiResponse<ShipmentInfo[]>>('/shipping')
    return res.data.data;
}
    
export const getShippingById = async (id: string) => {
    const res = await api.get<ApiResponse<ShipmentInfo>>(`/shipping/${id}`)
    return res.data.data;
}

export const createShipping = async (payload: CreateShipmentInfo) => {
    const res = await api.post<ApiResponse<ShipmentInfo>>('/shipping', payload)
    return res.data.data;
}

export const updateShipping = async (id: string, payload: UpdateShipmentInfo) => {
    const res = await api.put<ApiResponse<ShipmentInfo>>(`/shipping/${id}`, payload)
    return res.data.data;
}

export const deleteShipping = async (id: string) => {
    const res = await api.delete<void>(`/shipping/${id}`)
    return res.data;
}

