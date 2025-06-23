import { injectable, inject } from "tsyringe";
import jwt from 'jsonwebtoken';
import { UserService } from "@services/userService";
import { SellerService } from "@services/sellerService";
import { PasswordManager } from '@utils/passwordUtils';
import { AppError } from "@utils/errorHandler";
import { User } from '@mytypes/userTypes';
import { Seller } from "@mytypes/sellerTypes";
import { Role } from '@mytypes/enumTypes';
import { NotificationService } from "./notificationService";
import { AuditService } from "./auditService";
import { Request } from "express";
@injectable()
export class AuthService {
  
    constructor(
      @inject("NotificationService") private notificationService: NotificationService,
      @inject("UserService") private userService: UserService,
      @inject("SellerService") private sellerService: SellerService,
      @inject("PasswordManager") private passwordManager: PasswordManager,
      @inject("AuditService") private auditService: AuditService
    ) {
    }

    async login(email: string, password: string, req: Request): Promise<{ token?: string; message: string }> {
        // Check if it's a user
        const user = await this.userService.findByEmail(email);
        if (user && this.passwordManager.verifyPassword(password, user.password)) {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );
          await this.auditService.logAudit({
            action: 'login',
            entity: 'user',
            entityId: user._id,
            userId: user._id,
            userRole: user.role,
            req,
            message: 'Login successful',
            status: 'success'
          });
          return { token, message: 'Login successful' };
          
        }
        // Check if it's a seller
        const seller = await this.sellerService.findByEmail(email);
        if (seller && this.passwordManager.verifyPassword(password, seller.password)) {
          const token = jwt.sign(
            { _id: seller._id, role: seller.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );
          await this.auditService.logAudit({
            action: 'login',
            entity: 'Seller',
            entityId: seller._id,
            userId: seller._id,
            userRole: seller.role,
            message: 'Login successful as seller',
            req,
            status: 'success'
          });
          return { token, message: 'Login successful as seller' };
        }
        throw AppError.unauthorized("Invalid credentials");
    }

    async registerCustomer(userData: User, req?: Request) {
    const exists = await this.userService.findByEmail(userData.email);
    if (exists) return { message: 'Email already registered' };
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(userData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
    const finalUser = { ...userData, password: combined, role: Role.CUSTOMER};
    await this.userService.addUser(finalUser);
    const user = await this.userService.getAllUsers()
        .then(users => users.find(u => u.email === userData.email));
    if (!user) return { message: 'User creation failed' };
      await this.notificationService.sendWelcomeEmail(user);
    await this.auditService.logAudit({
            action: 'register',
            entity: 'User',
            userRole: user.role,
            message: 'Registration successful',
            req,
            status: 'success'
          });
    return { message: 'Registration successful', user };
    }

    async registerSeller(sellerData: Seller, req?: Request) {
      const exists = await this.sellerService.findByEmail(sellerData.email);
    if (exists) return { message: 'Email already registered' };
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(sellerData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
    const finalSeller = { ...sellerData, password: combined, role: Role.SELLER};
    await this.sellerService.createSeller(finalSeller);
    const seller = await this.sellerService.getAllSellers()
        .then(sellers => sellers.find(u => u.email === sellerData.email));
    if (!seller) return { message: 'Seller creation failed' };
      await this.notificationService.sendWelcomeEmailSeller(seller);
    await this.auditService.logAudit({
            action: 'register',
            entity: 'seller',
            userRole: seller.role,
            message: 'Registration successful',
            req,
            status: 'success'
          });
    return { message: 'Registration successful', seller };
    }

    async registerAdmin(adminData: User, req?: Request) {
      const exists = await this.userService.findByEmail(adminData.email);
    if (exists) return { message: 'Email already registered' };
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(adminData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
    const finalUser = { ...adminData, password: combined, role: Role.ADMIN};
    await this.userService.addUser(finalUser);
    const user = await this.userService.getAllUsers()
        .then(users => users.find(u => u.email === adminData.email));
    if (!user) return { message: 'Admin creation failed' };
    await this.auditService.logAudit({
            action: 'register',
            entity: 'Admin',
            userRole: user.role,
            message: 'Registration successful',
            req,
            status: 'success'
          });
    return { message: 'Registration successful', user };
    }

    async getCurrentUser(authUser: { _id: string; role: Role }) {
      if (authUser.role === Role.SELLER) {
        const seller = await this.sellerService.getSellerById(authUser._id);
        if (!seller) throw AppError.notFound("Seller not found");
        return { user: seller, role: Role.SELLER };
      }

      if (authUser.role === Role.CUSTOMER || authUser.role === Role.ADMIN) {
        const user = await this.userService.getUserById(authUser._id);
        if (!user) throw AppError.notFound("User not found");
        return { user, role: authUser.role };
      }
      throw AppError.unauthorized("Unauthorized role");
    }
}
