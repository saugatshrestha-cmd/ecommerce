export interface DashboardMetrics {
    productCount: number;
    customerCount: number;
    pendingOrders: number;
    revenue: number;
    monthlyRevenue: {
        _id: { year: number; month: number };
        days: { day: number; revenue: number }[];
    }[];
    monthlyOrders: {
        _id: { year: number; month: number };
        days: { day: number; count: number }[];
    }[];
}