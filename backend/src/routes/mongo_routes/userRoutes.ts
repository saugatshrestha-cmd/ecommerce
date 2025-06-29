import { container } from "@config/diContainer";
import express from 'express';
import { UserController } from '@controller/userController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { Validator } from "@middleware/validationMiddleware";
import { updateUserSchema, updateUserEmailSchema, updateUserPasswordSchema } from "@validation/userValidation";

const router = express.Router();
const controller = container.resolve(UserController);



// User routes
router.get('/view-profile', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('customer'), controller.getProfile.bind(controller));
router.put('/update-profile', AuthMiddleware.verifyToken, new Validator(updateUserSchema).validate(), RoleMiddleware.hasRole('customer'), controller.updateProfile.bind(controller));
router.put('/change-email', AuthMiddleware.verifyToken, new Validator(updateUserEmailSchema).validate(), RoleMiddleware.hasRole('customer'), controller.updateEmail.bind(controller));
router.put('/change-password', AuthMiddleware.verifyToken, new Validator(updateUserPasswordSchema).validate(), RoleMiddleware.hasRole('customer'), controller.updatePassword.bind(controller));
router.delete('/delete', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('customer'), controller.deleteUser.bind(controller));

// Admin routes
router.get('/', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), controller.getAllUsers.bind(controller));
router.get('/:id', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), controller.getUserById.bind(controller));
router.put('/:id', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), new Validator(updateUserSchema).validate(), controller.adminUpdateUser.bind(controller));
router.put('/:id/change-password', AuthMiddleware.verifyToken, new Validator(updateUserPasswordSchema).validate(), RoleMiddleware.hasRole('admin'), controller.adminUpdatePassword.bind(controller));
router.put('/:id/change-email', AuthMiddleware.verifyToken, new Validator(updateUserEmailSchema).validate(), RoleMiddleware.hasRole('admin'), controller.adminUpdateEmail.bind(controller));
router.delete('/:id', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), controller.adminDeleteUser.bind(controller));

export default router;
