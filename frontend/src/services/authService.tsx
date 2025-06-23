import { api } from "@/utils/api";
import type { LoginPayload, LoginResponse, RegisterUser, RegisterSeller, User } from "@/types/authTypes";

export const login = async (payload: LoginPayload) => {
    const response = await api.post<LoginResponse>('/auth/login', payload);
    return response.data;
};

export const logout = async () => {
    await api.post('/auth/logout');
};

export const fetchCurrentUser = async () => {
    const response = await api.get<{data:{ user: User }}>("/auth/me");
    console.log("Current user response:", response.data);
    return response.data.data?.user ?? null;
};

export const registerCustomer = async (userData: RegisterUser) => {
    await api.post('/auth/register/customer', userData);
};

export const registerSeller = async (sellerData: RegisterSeller) => {
    await api.post('/auth/register/seller', sellerData);
};

export const registerAdmin = async (adminData: RegisterUser) =>{
    await api.post('/auth/register/admin', adminData);
}
