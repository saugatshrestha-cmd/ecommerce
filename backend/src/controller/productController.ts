import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@services/productService';
import { handleSuccess, handleError } from '@utils/apiResponse';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { logger } from '@utils/logger';
import { AppError } from '@utils/errorHandler';

@injectable()
export class ProductController {
    constructor(
                @inject("ProductService") private productService: ProductService
            ) {}

    async createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedInUser = req.user?._id as string;
            const files = req.files as Express.Multer.File[];
            const productData = req.body;
            productData.sellerId = loggedInUser;
            if (!files || files.length === 0) {
            throw AppError.badRequest('At least one image is required');
        }           
            const result = await this.productService.createProduct(productData, files, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Product added successfully`);
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async getFilteredProducts (req: Request, res: Response, next: NextFunction) {
        try{
            const products = await this.productService.getFilteredProducts(req.query);
            handleSuccess(res, products);
        } catch (error) {
            handleError(next, error);
        }
    };

    async getPriceRange (req: Request, res: Response, next: NextFunction) {
        try {
            const prices = await this.productService.getPriceRange(req.query);
            handleSuccess(res, prices);
        } catch (error) {
            handleError(next, error);
        }
    };

    async getProductBySeller(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const products = await this.productService.getProductsBySeller(sellerId);
            logger.info('Products fetched successfully');
            handleSuccess(res, products);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const sellerId = req.user?._id as string;
        const productId = req.params.id;

    // Safely parse filesToDelete
        const filesToDelete = Array.isArray(req.body.filesToDelete)
            ? req.body.filesToDelete
            : req.body.filesToDelete
            ? [req.body.filesToDelete]
            : [];

    // Extract updatedInfo excluding file-related fields
        const { filesToDelete: _, ...updatedInfo } = req.body;

    // DEBUG: Log all incoming data
        logger.debug('Incoming request data', {
            body: req.body,
            files: req.files,
        params: req.params
        });

    // SAFE FILE EXTRACTION - Handle both newFiles and bannerImage
        let bannerImageFile: Express.Multer.File | undefined;
        let otherFiles: Express.Multer.File[] = [];

        if (req.files) {
        const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };
      // Handle newFiles (product images)
        if (filesMap['newFiles']) {
            otherFiles = filesMap['newFiles'];
        }
      
      // Handle bannerImage
        if (filesMap['bannerImage']?.[0]) {
            bannerImageFile = filesMap['bannerImage'][0];
        }
        }

    // DEBUG: Log extracted files
        logger.debug('Extracted files', {
            bannerImageFile: bannerImageFile?.originalname,
            otherFiles: otherFiles.map(f => f.originalname)
        });

        const result = await this.productService.updateProduct(
            productId,
            updatedInfo,
            otherFiles,
            filesToDelete,
            bannerImageFile,
            req
        );

        handleSuccess(res, result);
    } catch (error:any) {
        logger.error('Product update failed', {
        error: error.message,
        stack: error.stack,
        requestBody: req.body,
        requestFiles: req.files
        });
        handleError(next, error);
    }
}



    async deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Product deleted successfully`, { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            const result = await this.productService.getAllProducts(limit);
            logger.info(`[${req.method}] ${req.originalUrl} - All products fetched successfully`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getBannerProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.productService.getBannerProducts();
            logger.info(`[${req.method}] ${req.originalUrl} - All products fetched successfully`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async newestProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            const result = await this.productService.newestProducts(limit);
            logger.info(`[${req.method}] ${req.originalUrl} - All products fetched successfully`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async featuredProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.productService.featuredProducts();
            logger.info(`[${req.method}] ${req.originalUrl} - All featured products fetched successfully`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async searchProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query.query as string;
            if (!query || query.trim() === '') {
                throw AppError.badRequest('Search query is required');
            }
            const result = await this.productService.searchProducts(query);
            logger.info(`[${req.method}] ${req.originalUrl} - Products found`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.getProductById(productId);
            logger.info(`[${req.method}] ${req.originalUrl} - Product fetched successfully`, { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const updatedInfo = req.body;
            const result = await this.productService.updateProduct(productId, updatedInfo);
            logger.info(`[${req.method}] ${req.originalUrl} - Product updated successfully`, { productId, updatedInfo });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateBannerStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { bannerStatus } = req.body;

        if (typeof bannerStatus !== 'boolean') {
            throw AppError.badRequest('Invalid banner status');
        }

        const result = await this.productService.updateBannerStatus(
            id,
            bannerStatus
        );

        handleSuccess(res, result);
        } catch (error) {
            handleError(next, error);
        }
    }

    async updateActiveStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            throw AppError.badRequest('Invalid active status');
        }

        const result = await this.productService.updateActiveStatus(
        id,
        isActive
        );

        handleSuccess(res, result);
    } catch (error) {
        handleError(next, error);
    }
    }

    async adminDeleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Product deleted successfully`, { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}

