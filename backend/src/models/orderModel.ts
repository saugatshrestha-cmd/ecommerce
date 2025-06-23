import mongoose from 'mongoose';
import { Status } from '@mytypes/enumTypes';
import { Order } from '@mytypes/orderTypes';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    shippingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipping', 
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: Object.values(Status),
        required: true
    },
    payment: {
        payment_status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        method: {
            type: String,
            enum: ['stripe', 'cod'], // Add other methods if needed
            required: false
        },
        amountPaid: {
            type: Number,
            required: false
        },
        paymentId: { // Stripe payment intent/session ID
            type: String,
            required: false
        },
        paymentDate: {
            type: Date,
            required: false
        },
        receiptUrl: { // Stripe receipt URL
            type: String,
            required: false
        }
    },
    cancelledAt: {
        type: Date,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller', 
            required: true
        },
        sellerStatus: {
            type: String,
            enum: Object.values(Status),
            required: true
        }
    }]
},
{ timestamps: true }
);

export const OrderModel = mongoose.model<Order & mongoose.Document>('Order', orderSchema);
