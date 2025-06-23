import { OrderItemStatus, Status } from "./enumTypes";

export interface OrderStripe{
    success: boolean;
    data: {_id: string;
    userId: CustomerInfo,
    shippingId: Shipping,
    payment: PaymentMethod,
    total: number,
    timestamp: Date,
    status: Status,
    items: OrderItem[],
    createdAt: Date,
}
}

export interface PaymentMethod {
    payment_status: 'pending' | 'paid' ,
    method: 'cod' | 'stripe';
}

export interface Order{
    _id: string;
    userId: CustomerInfo,
    shippingId: Shipping,
    total: number,
    payment: PaymentMethod,
    timestamp: Date,
    status: Status,
    items: OrderItem[],
    createdAt: Date,
}

export interface CreateOrder{
    id?: string;
    userId: string;
    shippingId: string;
    total: number,
    cartItems: {
    productId: string;
    quantity: number;
    sellerId: string;
    }[];
}

export interface Shipping {
    full_name: string,
    email: string, 
    phone: string,
    region: string,
    city: string,
    address: string
}

export interface OrderItem {
    _id: string;
    productId: string;
    productName: string,
    quantity: number;
    sellerId: SellerInfo;
    price: number;
    sellerStatus: OrderItemStatus; 
}

export interface CustomerInfo {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
}

export interface SellerInfo {
    _id: string;
    storeName: string;
    email: string;
    address: string;
}

export interface OrderItemInput {
    id?: string;
    productId: string;
    productName: string,
    quantity: number;
    sellerId: string;
    price: number;
    sellerStatus: OrderItemStatus;
}

export interface SellerOrder {
    id: string;
    userId: string;
    items: OrderItem[];
}

export interface CancelOrder {
    orderId: string;
}

export interface UpdateOrderStatus {
    orderId: string;
    itemId: string;
    sellerStatus: OrderItem['sellerStatus'];
}