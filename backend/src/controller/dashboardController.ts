import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { DashboardService } from "@services/dashboardService";
import { AuthRequest } from "@mytypes/authTypes";

@injectable()
export class DashboardController {
    constructor(
                    @inject("DashboardService") private dashboardService: DashboardService
                ) {}

    async getAdminDashboard(req: AuthRequest, res: Response): Promise<void>  {
        try {
            const adminId = req.user?._id;
            if (!adminId) {
                res.status(400).json({ success: false, message: "Seller ID is required" });
            }
            const metrics = await this.dashboardService!.getAdminDashboardMetrics();
            res.status(200).json({ success: true, data: metrics });
        } catch (error) {
            console.error("Error in getAdminDashboard:", error);
            res.status(500).json({ success: false, message: "Failed to fetch admin dashboard metrics" });
        }
    }

    async getSellerDashboard(req: AuthRequest, res: Response): Promise<void>  {
        try {
            const sellerId = req.user?._id as string; 
            if (!sellerId) {
                res.status(400).json({ success: false, message: "Seller ID is required" });
            }
            const metrics = await this.dashboardService!.getSellerDashboardMetrics(sellerId);
            res.status(200).json({ success: true, data: metrics });
            } catch (error) {
            console.error("Error in getSellerDashboard:", error);
            res.status(500).json({ success: false, message: "Failed to fetch seller dashboard metrics" });
        }
    }
}
