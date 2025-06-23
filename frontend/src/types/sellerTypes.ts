import { Role } from "./enumTypes";

export interface Seller {
    _id: string;
    storeName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: Role;
}

export interface UpdateSeller {
    storeName?: string;
    phone?: string;
    address?: string;
}

export interface UpdateEmail {
    email: string;
}

export interface UpdatePassword {
    oldPassword: string;
    newPassword: string;
}

