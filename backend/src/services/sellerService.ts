import { injectable, inject } from "tsyringe";
import { SellerRepository } from '@mytypes/repoTypes';
import { ProductService } from "@services/productService";
import { NotificationService } from "./notificationService";
import { Seller } from '@mytypes/sellerTypes';
import { AppError } from "@utils/errorHandler";
import { PasswordManager } from '@utils/passwordUtils';
import { Role } from '@mytypes/enumTypes';
import { SellerRepositoryFactory } from "@factories/sellerFactory";
import { logger } from "@utils/logger";
import { AuditService } from "./auditService";
import { Request } from "express";

@injectable()
export class SellerService {
  private sellerRepository: SellerRepository;
  constructor(
    @inject("SellerRepositoryFactory") private sellerRepositoryFactory: SellerRepositoryFactory,
    @inject("PasswordManager") private passwordManager: PasswordManager,
    @inject("ProductService") private productService: ProductService,
    @inject("NotificationService") private notificationService: NotificationService,
    @inject("AuditService") private auditService: AuditService
  ) {
    this.sellerRepository = this.sellerRepositoryFactory.getRepository();
  }

  async getSellerById(sellerId: string) {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      logger.warn(`Seller not found: ${sellerId}`);
      throw AppError.notFound("Seller not found", sellerId);
    }
    return seller;
  }

  async getAllSellers(): Promise<Seller[]> {
    return await this.sellerRepository.getAll();
  }

  async findByEmail(email: string): Promise<Seller | null> {
    return await this.sellerRepository.findByEmail(email);
  }

  async createSeller(sellerData: Seller, req?: Request): Promise<void> {
    await this.sellerRepository.add(sellerData);
  }  

  async updateSeller(sellerId: string, updatedInfo: Seller, req?: Request): Promise<{ message: string }> {
      const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      logger.warn(`Seller not found: ${sellerId}`);
      throw AppError.notFound("Seller not found", sellerId);
    }
    if (updatedInfo.email || updatedInfo.password) {
      logger.warn("Email or password cannot be updated here");
      throw AppError.badRequest("Email or password cannot be updated here");
    }
    const beforeState ={
      storeName: seller.storeName,
      phone: seller.phone,
      address: seller.address
    }
    const { storeName, phone, address } = updatedInfo;
    const updatedSellerInfo = {
      storeName,
      phone,
      address,
    };
    await this.sellerRepository.update(sellerId, updatedSellerInfo);
    await this.auditService.logAudit({
        action: 'update_seller',
        entity: 'Seller',
        entityId: sellerId,
        status: 'success',
        beforeState,
        afterState: updatedSellerInfo,
        message: 'Seller updated successfully',
        req
      });
    return { message: "Seller updated successfully" };
  }

  async updateEmail(sellerId: string, newEmail: string, req?: Request): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      logger.warn(`Seller not found: ${sellerId}`);
      throw AppError.notFound("Seller not found", sellerId);
    }
    if (await this.sellerRepository.findByEmail(newEmail)) {
      logger.warn("Email already in use");
      throw AppError.conflict("Email already in use");
    }
    await this.sellerRepository.update(sellerId, { email: newEmail });
    await this.auditService.logAudit({
        action: 'update_seller_email',
        entity: 'Seller',
        entityId: sellerId,
        status: 'success',
        beforeState: seller.email,
        afterState: newEmail,
        message: 'Seller email updated successfully',
        req
      });
    return { message: "Email updated successfully" };
  }

  async updatePassword(sellerId: string, newPassword: string, req?: Request): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      logger.warn(`Seller not found: ${sellerId}`);
      throw AppError.notFound("Seller not found", sellerId);
    }
    const newSalt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(newPassword, newSalt);
    const combined = this.passwordManager.combineSaltAndHash(newSalt, hashed);
    await this.sellerRepository.update(sellerId, { password: combined });
    await this.auditService.logAudit({
        action: 'update_seller_password',
        entity: 'Seller',
        entityId: sellerId,
        status: 'success',
        message: 'Seller password updated successfully',
        req
      });
    return { message: "Password updated successfully" };
  }

  async deleteSeller(sellerId: string, req?: Request): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller || seller.isDeleted) {
      logger.warn(`Seller not found: ${sellerId}`);
      throw AppError.notFound("Seller not found or already deleted", sellerId);
    }
    await this.productService.deleteProductsBySellerId(sellerId);
    await this.sellerRepository.update(sellerId, {
      isDeleted: true,
      deletedAt: new Date()
    });
    await this.auditService.logAudit({
        action: 'delete_seller',
        entity: 'Seller',
        entityId: sellerId,
        status: 'success',
        message: 'Seller deleted successfully',
        req
      });
    return { message: "Seller and their products deleted successfully" };
  }
}
