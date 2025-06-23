import { injectable, inject } from "tsyringe";
import { MongoDashboardRepository } from "@repository/dashboardRepo";
import { DashboardRepositoryFactory } from "@factories/dashboardFactory";

@injectable()
export class DashboardService {
    private dashboardRepository: MongoDashboardRepository;
    constructor(
    @inject("DashboardRepositoryFactory") private dashboardRepositoryFactory: DashboardRepositoryFactory,
    ) {
        this.dashboardRepository = this.dashboardRepositoryFactory.getRepository();
    }

    async getAdminDashboardMetrics() {
    const [productCount, customerCount, pendingOrders, revenue, monthlyRevenue, monthlyOrders] = await Promise.all([
        this.dashboardRepository.countAllProducts(),
        this.dashboardRepository.countAllCustomers(),
        this.dashboardRepository.countAllPendingOrders(),
        this.dashboardRepository.calculateTotalRevenue(),
        this.dashboardRepository.getMonthlyRevenueForAdmin(),
        this.dashboardRepository.getMonthlyOrdersForAdmin(),
    ]);

    return {
        productCount,
        customerCount,
        pendingOrders,
        revenue,
        monthlyRevenue,
        monthlyOrders
    };
    }

    async getSellerDashboardMetrics(sellerId: string) {
    const [productCount, pendingOrders, revenue, monthlyRevenue, monthlyOrders] = await Promise.all([
        this.dashboardRepository.countProductsBySeller(sellerId),
        this.dashboardRepository.countPendingOrdersBySeller(sellerId),
        this.dashboardRepository.calculateRevenueBySeller(sellerId),
        this.dashboardRepository.getMonthlyRevenueBySeller(sellerId),
        this.dashboardRepository.getMonthlyOrdersBySeller(sellerId),
    ]);

    return {
        productCount,
        pendingOrders,
        revenue,
        monthlyRevenue,
        monthlyOrders
    };
    }
}
