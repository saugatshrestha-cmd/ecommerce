import { Request } from "express";
import { Role } from "./enumTypes";

interface User {
    _id: string;
    role: Role;
}

export interface AuthRequest extends Request {
    user?: User;
}