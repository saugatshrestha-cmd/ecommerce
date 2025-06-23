import express from 'express';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { initiateCheckout, stripeWebhook } from '@controller/checkoutController';


const router = express.Router();

router.post('/create-checkout-session',AuthMiddleware.verifyToken, initiateCheckout);


router.post('/webhook', stripeWebhook);


export default router;