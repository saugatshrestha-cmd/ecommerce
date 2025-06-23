import { Role } from "./enumTypes";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: Role;
}

export interface UpdateUser {
    firstName?: string;
    lastName?: string;
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
