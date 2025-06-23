import { api } from "@/utils/api";
import type { User, UpdateUser, UpdateEmail, UpdatePassword } from "@/types/userTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getAllUsers = async () => {
    const res = await api.get<ApiResponse<User[]>>('/users')
    return res.data.data;
}
    
export const getUserById = async (id: string) => {
    const res = await api.get<ApiResponse<User>>(`/users/${id}`)
    return res.data.data;
}

export const getMyProfile = async () => {
    const res = await api.get<ApiResponse<User>>('/users/view-profile')
    return res.data.data;
}

export const updateMyProfile = async (payload: UpdateUser) =>{
    const res = await api.put<ApiResponse<User>>('/users/update-profile', payload)
    return res.data.data;
}

export const changeMyEmail = async (payload: UpdateEmail) =>{
    const res = await api.put<ApiResponse<User>>('/users/change-email', payload)
    return res.data.data;
}

export const changeMyPassword = async (payload: UpdatePassword) =>{
    const res = await api.put<ApiResponse<User>>('/users/change-password', payload)
    return res.data.data;
}

export const deleteMyAccount = async () =>{
    const res = await api.delete<void>('/users/delete')
    return res.data;
}

export const deleteUserAdmin = async (id: string) =>{
    const res = await api.delete<void>(`/users/${id}`)
    return res.data;
}

export const getAdminProfile = async () => {
    const res = await api.get<ApiResponse<User>>('/admin/')
    return res.data.data;
}

export const updateAdminProfile = async (payload: UpdateUser) =>{
    const res = await api.put<ApiResponse<User>>('/admin/update-profile', payload)
    return res.data.data;
}

export const changeAdminEmail = async (payload: UpdateEmail) =>{
    const res = await api.put<ApiResponse<User>>('/admin/change-email', payload)
    return res.data.data;
}

export const changeAdminPassword = async (payload: UpdatePassword) =>{
    const res = await api.put<ApiResponse<User>>('/admin/change-password', payload)
    return res.data.data;
}

export const deleteAdminAccount = async () =>{
    const res = await api.delete<void>('/admin/:id')
    return res.data;
}
