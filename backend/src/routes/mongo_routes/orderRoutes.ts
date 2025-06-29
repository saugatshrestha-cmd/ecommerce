import { container } from "@config/diContainer";
import express from 'express';
import { OrderController } from '@controller/orderController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(OrderController);

router.use(AuthMiddleware.verifyToken);

// User routes
router.get('/user', RoleMiddleware.hasRole('customer'), controller.getUserOrders.bind(controller));
router.get('/user/:id', RoleMiddleware.hasRole('customer'), controller.getById.bind(controller));
router.post('/', RoleMiddleware.hasRole('customer'), controller.createUserOrder.bind(controller));
router.put('/cancel', RoleMiddleware.hasRole('customer'), controller.cancelUserOrder.bind(controller));
router.delete('/delete/:id', RoleMiddleware.hasRole('customer'), controller.cancelUserOrder.bind(controller));

//Seller routes
router.get('/seller', RoleMiddleware.hasRole('seller'), controller.getSellerOrders.bind(controller));
router.put('/seller', RoleMiddleware.hasRole('seller'), controller.updateOrderItemStatus.bind(controller));

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), controller.getAllOrders.bind(controller));
router.get('/:id', RoleMiddleware.hasRole('admin'), controller.getOrderByUserId.bind(controller));
router.put('/:id/cancel', RoleMiddleware.hasRole('admin'), controller.cancelOrderByAdmin.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.deleteOrder.bind(controller));

export default router;
