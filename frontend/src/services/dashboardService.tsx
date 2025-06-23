import { api } from "@/utils/api";
import type { DashboardMetrics } from "@/types/dashboardTypes";
import type { ApiResponse } from "@/types/responseTypes";

export const getAdminDashboard = async () => {
    const res = await api.get<ApiResponse<DashboardMetrics>>('/dashboard/admin')
    return res.data.data;
}
    
export const getSellerDashboard = async () => {
    const res = await api.get<ApiResponse<DashboardMetrics>>(`/dashboard/seller`)
    return res.data.data;
}