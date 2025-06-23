import { container } from "@config/diContainer";
import express from 'express';
import { AuthController } from '@controller/authController';
import { Validator } from '@middleware/validationMiddleware';
import { createUserSchema } from "@validation/userValidation";
import { createSellerSchema } from "@validation/sellerValidation";
import { AuthMiddleware } from "@middleware/authMiddleware";

const router = express.Router();
const controller = container.resolve(AuthController);

router.post('/login', controller.login.bind(controller));

router.post('/register/customer', new Validator(createUserSchema).validate(), controller.registerCustomer.bind(controller));
router.post('/register/seller', new Validator(createSellerSchema).validate(), controller.registerSeller.bind(controller));
router.post('/register/admin', new Validator(createUserSchema).validate(), controller.registerAdmin.bind(controller));

router.get('/me', AuthMiddleware.verifyToken, controller.currentUser.bind(controller));

router.post('/logout', controller.logout.bind(controller));

export default router;
