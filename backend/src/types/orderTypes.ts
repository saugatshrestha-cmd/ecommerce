import { OrderItemStatus, Status } from "@mytypes/enumTypes";

export interface Order{
    _id: string;
    userId: string,
    shippingId: string,
    total: number,
    timestamp: Date,
    status: Status,
    payment: PaymentInfo;
    items: OrderItem[],
    cancelledAt ?: Date | null,
    isDeleted?: boolean,
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaymentInfo {
    status?: 'pending' | 'paid' | 'failed' | 'refunded';
    method?: 'stripe' | 'paypal' | 'cod';
    amountPaid?: number;
    paymentId?: string;
    paymentDate?: Date;
    receiptUrl?: string;
}

export interface OrderInput{
    _id?: string;
    userId: string,
    shippingId: string,
    total: number,
    timestamp: Date,
    status: Status,
    payment: PaymentInfo;
    items: OrderItemInput[],
    cancelledAt ?: Date | null,
    isDeleted?: boolean,
    deletedAt?: Date | null;
}

export interface OrderItem {
    _id: string;
    productId: string;
    productName: string,
    quantity: number;
    sellerId: string;
    price: number;
    sellerStatus: OrderItemStatus; 
}

export interface OrderItemInput {
    _id?: string;
    productId: string;
    productName: string,
    quantity: number;
    sellerId: string;
    price: number;
    sellerStatus: OrderItemStatus;
}

export interface SellerOrder {
    _id: string;
    userId: string;
    shippingId: string,
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    items: OrderItem[];
}