export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export interface RegisterSeller {
    storeName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        message: string;
        token: string;
    };
}

export interface ErrorResponse {
    message: string;
};

interface BaseUser {
    _id: string;
    email: string;
    phone: string;
    address: string;
}

// Customer and Admin share structure
export interface CustomerOrAdmin extends BaseUser {
    _id: string;
    role: 'customer' | 'admin';
    firstName: string;
    lastName: string;
}

// Seller has different structure
export interface Seller extends BaseUser {
    _id: string;
    role: 'seller';
    storeName: string;
}

// Union type to represent any authenticated user
export type User = CustomerOrAdmin | Seller;
