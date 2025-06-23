import { Request, Response, NextFunction } from 'express';
import { ShippingService } from '@services/shippingService';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';
import { AuthRequest } from '@mytypes/authTypes';
import { AppError } from '@utils/errorHandler';
import { logger } from '@utils/logger';

@injectable()
export class ShippingController {
    constructor(
                @inject("ShippingService") private shippingService: ShippingService
            ) {}

    async createShipping(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const loggedInUser = req.user?._id as string;
            const newShipping = req.body;
            newShipping.customer_id = loggedInUser;
            const result = await this.shippingService.createShipping(newShipping, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Shipping created successfully`, { shipping: result });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllShipping(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
            try {
                const loggedInUser = req.user?._id as string;
                const result = await this.shippingService.getAllShipping();
                logger.info(`[${req.method}] ${req.originalUrl} - All Shipping fetched successfully`);
                handleSuccess(res, result);
            } catch(error) {
                handleError(next, error);
            }
        }

    async getShippingById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedInUser = req.user?._id as string;
            const shippingId = req.params.id;
            const result = await this.shippingService.getShippingById(shippingId);
            logger.info(`[${req.method}] ${req.originalUrl} - Shipping fetched successfully`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
    
    async updateShipping(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedInUser = req.user?._id as string;
            const shippingId = req.params.id;
            const updatedInfo = req.body;
            const result = await this.shippingService.updateShipping(shippingId, updatedInfo, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Shipping updated successfully`, { shippingId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
    
    async deleteShipping(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedInUser = req.user?._id as string;
            const shippingId = req.params.id;
            const result = await this.shippingService.deleteShipping(shippingId, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Shipping deleted successfully`, { shippingId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}


