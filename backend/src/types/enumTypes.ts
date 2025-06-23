export enum OrderItemStatus {
    PENDING = 'Pending',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

export enum Status {
    PENDING = 'Pending',
    PARTIALLY_SHIPPED = 'Partially Shipped',
    SHIPPED = 'Shipped',
    PARTIALLY_DELIVERED = 'Partially Delivered',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

export enum Role {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    SELLER = 'seller'
}

export enum ProductStatus{
    ACTIVE = 'active',
    ARCHIVED = 'archived',
    DELETED = 'deleted'
}
