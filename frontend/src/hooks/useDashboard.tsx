import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard, getSellerDashboard } from '@/services/dashboardService';
import type { DashboardMetrics } from '@/types/dashboardTypes';

export const useAdminDashboard = () => {
    return useQuery<DashboardMetrics, Error>({
        queryKey: ["admin-dashboard"],
        queryFn: getAdminDashboard,
    });
};

export const useSellerDashboard = () => {
    return useQuery<DashboardMetrics, Error>({
        queryKey: ["seller-dashboard"],
        queryFn: getSellerDashboard,
    });
};