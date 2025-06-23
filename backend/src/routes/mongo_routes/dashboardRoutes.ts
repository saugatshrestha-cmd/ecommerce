import express from 'express';
import { container } from "@config/diContainer";
import { DashboardController } from "@controller/dashboardController";
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(DashboardController);

router.use(AuthMiddleware.verifyToken);
// Admin dashboard
router.get("/admin", RoleMiddleware.hasRole('admin'), controller.getAdminDashboard.bind(controller));

// Seller dashboard
router.get("/seller", RoleMiddleware.hasRole('seller'),controller.getSellerDashboard.bind(controller));

export default router;
