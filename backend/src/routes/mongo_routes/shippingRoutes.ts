import { container } from "@config/diContainer";
import express from 'express';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { ShippingController } from "@controller/shippingController";
import { Validator } from "@middleware/validationMiddleware";
import { createShippingSchema, updateShippingSchema } from "@validation/shippingValidation";

const router = express.Router();
const controller = container.resolve(ShippingController);

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.hasRole('customer'));

router.get('/', controller.getAllShipping.bind(controller));
router.post('/', new Validator(createShippingSchema).validate(), controller.createShipping.bind(controller));
router.put('/:id', new Validator(updateShippingSchema).validate(), controller.updateShipping.bind(controller));
router.get('/:id', controller.getShippingById.bind(controller));
router.delete('/:id', controller.deleteShipping.bind(controller));

export default router;
