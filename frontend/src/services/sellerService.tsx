import { api } from "@/utils/api";
import type { Seller, UpdateSeller, UpdateEmail, UpdatePassword } from "@/types/sellerTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getAllSellers = async () => {
    const res = await api.get<ApiResponse<Seller[]>>('/sellers')
    return res.data.data;
}
    
export const getSellerById = async (id: string) => {
    const res = await api.get<ApiResponse<Seller>>(`/sellers/${id}`)
    return res.data.data;
}

export const getMyProfile = async () => {
    const res = await api.get<ApiResponse<Seller>>('/sellers/view-profile')
    return res.data.data;
}

export const updateMyProfile = async (payload: UpdateSeller) =>{
    const res = await api.put<ApiResponse<Seller>>('/sellers/update-profile', payload)
    return res.data.data;
}

export const changeMyEmail = async (payload: UpdateEmail) =>{
    const res = await api.put<ApiResponse<Seller>>('/sellers/change-email', payload)
    return res.data.data;
}

export const changeMyPassword = async (payload: UpdatePassword) =>{
    const res = await api.put<ApiResponse<Seller>>('/sellers/change-password', payload)
    return res.data.data;
}

export const deleteMyAccount = async () =>{
    const res = await api.delete<void>('/sellers/delete')
    return res.data;
}

export const deleteSellerAdmin = async (id: string) =>{
    const res = await api.delete<void>(`/sellers/${id}`)
    return res.data;
}

