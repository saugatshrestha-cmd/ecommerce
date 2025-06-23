import { injectable, inject } from "tsyringe";
import { ShippingRepository } from "@mytypes/repoTypes";
import { AppError } from "@utils/errorHandler";
import { ShipmentInfo } from "@mytypes/shippingTypes";
import { ShippingRepositoryFactory } from "@factories/shippingFactory";
import { logger } from "@utils/logger";
import { AuditService } from "./auditService";
import { Request } from "express";

@injectable()
export class ShippingService {
    private shippingRepository: ShippingRepository;
    constructor(
        @inject("ShippingRepositoryFactory") private shippingRepositoryFactory: ShippingRepositoryFactory,
        @inject("AuditService") private auditService: AuditService
    ) {
        this.shippingRepository = this.shippingRepositoryFactory.getRepository();
    }
    async createShipping(shippingData: ShipmentInfo, req?: Request): Promise<{ message: string }> {
        const { full_name, email, phone, city, region, address } = shippingData;
        await this.shippingRepository.add({...shippingData, isDefault: true});
        await this.auditService.logAudit({
            action: 'create_shipping',
            entity: 'Shipping',
            status: 'success',
            message: 'Shipping added successfully',
            req
        });
        return { message: "Shipping added successfully" };
    }

    async getShippingById(shippingId: string): Promise<ShipmentInfo | { message: string }> {
        const shipping = await this.shippingRepository.findById(shippingId);
        if (!shipping) {
            logger.warn("Shipping not found");
            throw AppError.notFound("Shipping not found", shippingId);
        }
        return shipping;
    }

    async getAllShipping(): Promise<ShipmentInfo[]> {
        return await this.shippingRepository.getAll();
    }

    async getDefaultShippingAddress(customer_id: string): Promise<ShipmentInfo | null> {
    return await this.shippingRepository.getDefaultShippingAddress(customer_id);
}

    

    async updateShipping(shippingId: string, updatedInfo: Partial<ShipmentInfo>, req?: Request): Promise<{ message: string }> {
        const oldShipping = await this.shippingRepository.findById(shippingId);
        if (!oldShipping) {
            logger.warn("Shipping not found");
            throw AppError.notFound("Shipping not found", shippingId);
        }
        const updatedShipping = await this.shippingRepository.update(shippingId, updatedInfo);
        await this.auditService.logAudit({
            action: 'update_shipping',
            entity: 'Shipping',
            entityId: shippingId,
            status: 'success',
            beforeState: oldShipping,
            afterState: updatedShipping,
            message: 'Shipping updated successfully',
            req
        });
        return { message: "Shipping updated successfully" };
    }

    async deleteShipping(shippingId: string, req?: Request): Promise<{ message: string }> {
        const shipping = await this.shippingRepository.findById(shippingId);
        if (!shipping) {
            logger.warn("Shipping not found");
            throw AppError.notFound("Shipping not found", shippingId);
        }
        const success = await this.shippingRepository.deleteShippingById(shippingId);
        await this.auditService.logAudit({
            action: 'delete_shipping',
            entity: 'Shipping',
            entityId: shippingId,
            status: 'success',
            message: 'Shipping deleted',
            req
        });  
        return { message: "Shipping deleted successfully" };
    }
}
