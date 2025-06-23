import Stripe from 'stripe';
import { OrderModel } from '../models/orderModel';
import { CartModel } from '../models/cartModel';
import { stripe } from '@utils/stripe';

export const createCheckoutSession = async (userId: string, orderId: string) => {
  // Get order details
  const order = await OrderModel.findById(orderId)
    .populate('shippingId')
    .populate('items.productId');
  if (!order || order.userId.toString() !== userId) {
    throw new Error('Order not found or unauthorized');
  }

  if (order.payment.method !== 'stripe') {
    throw new Error('This order is not set up for Stripe payment');
  }

  // Calculate subtotal (items only)
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate VAT (13% of subtotal)
  const vatAmount = subtotal * 0.13;
  
  // Fixed shipping cost
  const shippingCost = 10;

  // Create line items for Stripe
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.productName,
      },
      unit_amount: Math.round(item.price * 100), // Price per individual item in cents
    },
    quantity: item.quantity,
  }));

  // Add shipping as a separate line item
  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Shipping',
      },
      unit_amount: Math.round(shippingCost * 100), // $10 in cents
    },
    quantity: 1,
  });

  // Add VAT as a separate line item
  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'VAT (13%)',
      },
      unit_amount: Math.round(vatAmount * 100), // VAT in cents
    },
    quantity: 1,
  });


  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/order-confirmation/${orderId}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/canceled`,
    metadata: {
      userId: userId,
      orderId: orderId,
    },
  });

  return session;
};

export const handleStripeWebhook = async (payload: Buffer, sig: string) => {
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (!session.metadata) {
      throw new Error('Session metadata is missing');
    }

    const { userId, orderId } = session.metadata;

    try {
      // Check if payment_intent exists
      if (!session.payment_intent) {
        throw new Error('Payment intent not found in session');
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string
      );

      let receiptUrl = null;
      if (paymentIntent.latest_charge) {
        const latestChargeId = paymentIntent.latest_charge as string;
        const charge = await stripe.charges.retrieve(latestChargeId);
        receiptUrl = charge.receipt_url;
      }

      // Check if order exists before updating
      const existingOrder = await OrderModel.findById(orderId);
      if (!existingOrder) {
        console.error(`Order ${orderId} not found in database`);
        throw new Error(`Order ${orderId} not found`);
      }

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        { 
          payment: {
            payment_status: 'paid',
            method: 'stripe',
            amountPaid: paymentIntent.amount / 100, // Convert from cents
            paymentId: paymentIntent.id,
            paymentDate: new Date(),
            receiptUrl: receiptUrl
          }
        },
        { new: true }
      );

      if (!updatedOrder) {
        console.error(`Failed to update order ${orderId}`);
        throw new Error(`Failed to update order ${orderId}`);
      }

      // Optional: Clear user's cart after successful payment
      await CartModel.findOneAndUpdate(
        { userId: userId },
        { $set: { items: [] } }
      );

    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  return { received: true };
};