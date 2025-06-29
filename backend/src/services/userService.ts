import { injectable, inject } from "tsyringe";
import { UserRepository } from "@mytypes/repoTypes";
import { OrderService } from "./orderService";
import { CartService } from "./cartService";
import { AppError } from "@utils/errorHandler";
import { User } from '@mytypes/userTypes';
import { PasswordManager } from '@utils/passwordUtils';
import { Role } from "@mytypes/enumTypes";
import { UserRepositoryFactory } from "@factories/userFactory";
import { logger } from "@utils/logger";
import { AuditService } from "./auditService";
import { Request } from "express";

@injectable()
export class UserService {
  private userRepository: UserRepository;
  constructor(
    @inject("UserRepositoryFactory") private userRepositoryFactory: UserRepositoryFactory,
    @inject("PasswordManager") private passwordManager: PasswordManager,
    @inject("OrderService") private orderService: OrderService,
    @inject("CartService") private cartService: CartService,
    @inject("AuditService") private auditService: AuditService
  ) {
    this.userRepository = this.userRepositoryFactory.getRepository();
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      logger.warn(`User not found: ${userId}`);
      throw AppError.notFound('User', userId);
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async addUser(user: User): Promise<void> {
    await this.userRepository.add(user);
  }

  async createAdmin(adminData: User, req?: Request): Promise<void> {
    await this.userRepository.add(adminData);
  }  

  async updateUser(userId: string, updatedInfo: User, req?: Request): Promise<{ message: string }> {
      const user = await this.userRepository.findById(userId);
    if (!user) {
      logger.warn(`Update failed, user not found: ${userId}`);
      throw AppError.notFound('User', userId);
    }
    if (updatedInfo.email || updatedInfo.password) {
      logger.warn("Email and password cannot be updated here.");
      throw AppError.badRequest("Email and password cannot be updated here.");
    }
    const beforeState ={
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address
    }
    const { firstName, lastName, phone, address } = updatedInfo;
    const updatedUserInfo = {
      firstName,
      lastName,
      phone,
      address,
    };
    await this.userRepository.update(userId, updatedUserInfo);
    await this.auditService.logAudit({
        action: 'update_user',
        entity: 'User',
        entityId: userId,
        beforeState,
        afterState: updatedUserInfo,
        status: 'success',
        message: 'User updated successfully',
        req
      });
    return { message: "User updated successfully" };
  }

  async updateEmail(userId: string, newEmail: string, req?: Request): Promise<{ message: string }> {
      const user = await this.userRepository.findById(userId);
    if (!user) {
      logger.warn(`Email update failed, user not found: ${userId}`);
      throw AppError.notFound('User', userId);
    }
    if (await this.userRepository.findByEmail(newEmail)) {
      logger.warn(`Email update failed, already in use: ${newEmail}`);
      throw AppError.conflict("Email already in use");
    }
    await this.auditService.logAudit({
        action: 'update_user_email',
        entity: 'User',
        entityId: userId,
        beforeState: user.email,
        afterState: newEmail,
        status: 'success',
        message: 'User email updated successfully',
        req
      });
    await this.userRepository.update(userId, { email: newEmail });
    return { message: "Email updated successfully" };
  }

  async updatePassword(userId: string, newPassword: string, req?: Request): Promise<{ message: string }> {
      const user = await this.userRepository.findById(userId);
    if (!user) {
      logger.warn(`Password update failed, user not found: ${userId}`);
      throw AppError.notFound('User', userId);
    }
    const newSalt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(newPassword, newSalt);
    const combined = this.passwordManager.combineSaltAndHash(newSalt, hashed);
    await this.userRepository.update(userId, { password: combined });
    await this.auditService.logAudit({
        action: 'update_user_updated',
        entity: 'User',
        entityId: userId,
        status: 'success',
        message: 'User password updated successfully',
        req
      });
    return { message: "Password updated successfully" };
  }

  async deleteUser(userId: string, req?: Request): Promise<{ message: string }> {
      const user = await this.userRepository.findById(userId);
    if (!user) {
      logger.warn(`Delete failed, user not found: ${userId}`);
      throw AppError.notFound('User', userId);
    }
    await this.orderService.deleteOrderByUserId(userId);
    await this.cartService.removeCartByUserId(userId);
    await this.userRepository.update(userId, {
      isDeleted: true,
      deletedAt: new Date()
    });
    await this.auditService.logAudit({
        action: 'delete_user',
        entity: 'User',
        entityId: userId,
        status: 'success',
        message: 'User deleted successfully',
        req
      });
    return { message: "User deleted successfully" };
  }
}
