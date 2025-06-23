import { Request, Response } from 'express';
import { AuthRequest } from '@mytypes/authTypes';
import { createCheckoutSession, handleStripeWebhook } from '../services/stripeService';

export const initiateCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?._id as string; // Assuming you have authentication middleware

    const session = await createCheckoutSession(userId.toString(), orderId);
    
    res.json({ url: session.url });
  } catch (error:any) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  console.log('🔔 WEBHOOK ENDPOINT HIT');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Body type:', typeof req.body);
  console.log('Body is Buffer:', Buffer.isBuffer(req.body));
  console.log('Body length:', req.body?.length || 'undefined');
  
  // Log signature details
  const sig = req.headers['stripe-signature'] as string;
  console.log('Stripe signature present:', !!sig);
  console.log('Stripe signature preview:', sig ? sig.substring(0, 50) + '...' : 'MISSING');
  
  // Log environment variables (safely)
  console.log('Webhook secret configured:', !!process.env.STRIPE_WEBHOOK_SECRET);
  console.log('Webhook secret preview:', process.env.STRIPE_WEBHOOK_SECRET ? 
    'whsec_' + process.env.STRIPE_WEBHOOK_SECRET.substring(6, 16) + '...' : 'MISSING');

  try {
    // Call the service function
    const result = await handleStripeWebhook(req.body, sig);
    
    console.log('✅ Webhook processed successfully');
    res.status(200).json(result);
    
  } catch (error: any) {
    console.error('❌ WEBHOOK ERROR DETAILS:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Log specific Stripe webhook errors
    if (error.message.includes('No signatures found matching the expected signature')) {
      console.error('🚨 SIGNATURE MISMATCH - Check your webhook endpoint secret');
    }
    
    if (error.message.includes('Unable to extract timestamp and signatures')) {
      console.error('🚨 INVALID SIGNATURE FORMAT - Check request headers');
    }
    
    // Return the error but don't expose internal details to Stripe
    res.status(400).json({ 
      error: 'Webhook processing failed',
      // Include error message for debugging (remove in production if sensitive)
      details: error.message 
    });
  }
};
