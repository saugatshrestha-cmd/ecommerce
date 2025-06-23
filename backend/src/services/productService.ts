import { injectable, inject } from "tsyringe";
import { ProductRepository } from '@mytypes/repoTypes';
import { CategoryService } from '@services/categoryService';
import { FileService } from "./fileService";
import { AppError } from "@utils/errorHandler";
import { ProductStatus } from "@mytypes/enumTypes";
import { Product, ProductInput } from '@mytypes/productTypes';
import { ProductRepositoryFactory } from "@factories/productFactory";
import { CloudService } from "./cloudService";
import { logger } from "@utils/logger";
import { AuditService } from "./auditService";
import { Request } from "express";

@injectable()
export class ProductService {
  private productRepository: ProductRepository;
  constructor(
    @inject("ProductRepositoryFactory") private productRepositoryFactory: ProductRepositoryFactory,
    @inject("CategoryService") private categoryService: CategoryService,
    @inject("CloudService") private cloudService: CloudService,
    @inject("FileService") private fileService: FileService,
    @inject("AuditService") private auditService: AuditService
  ) {
    this.productRepository = this.productRepositoryFactory.getRepository();
  }


  async createProduct(productData: ProductInput, files: Express.Multer.File[] = [], req?: Request): Promise<{ message: string }> {

    const { name, description = "", price, categoryId, quantity, sellerId } = productData;
    const existingProduct = await this.productRepository.getAll();
    if (existingProduct.some(product => product.name.toLowerCase() === name.toLowerCase())) {
      logger.warn("Product already exists");
      throw AppError.conflict("Product already exist");
    }
    if (categoryId && !(await this.categoryService.getCategoryById(categoryId))) {
      logger.warn("Category not found");
      throw AppError.notFound("Category does not exist", categoryId);
    }

    const fileIds: string[] = [];
    if (files.length > 0) {
    try {
      const uploadResults = await this.cloudService.upload(
        files.map(f => ({ buffer: f.buffer, originalName: f.originalname })),
        'products'
      );

      for (const uploaded of uploadResults) {
        const saved = await this.fileService.saveFileMetadata(uploaded);
        if (!saved._id) {
          throw new Error("File save operation didn't return an ID");
        }
        fileIds.push(saved._id);
      }
    } catch (error) {
      logger.error("File processing failed", error);
      throw AppError.internal("Image upload failed");
    }
  }
    const newProduct = await this.productRepository.add({ ...productData, images: fileIds, status: ProductStatus.ACTIVE });
    await this.auditService.logAudit({
        action: 'create_product',
        entity: 'Product',
        userId: newProduct.sellerId,
        status: 'success',
        message: 'Product added successfully',
        req
      });
    return { message: "Product added successfully" };
  }

  async getProductById(productId: string): Promise<Product | { message: string }> {
    const product = await this.productRepository.findById(productId);
      if (!product) {
        logger.warn("Product not found");
        throw AppError.notFound("Product not found", productId);
      }
    return product;
  }

  async getAllProducts(limit?: number): Promise<Product[]> {
    const products = await this.productRepository.getAll(limit);
    return products;
  }

  async getBannerProducts(): Promise<Product[]> {
    const products = await this.productRepository.getBannerProducts();
    return products;
  }

  async getFilteredProducts(query: any): Promise<Product[]> {
    const products = await this.productRepository.getFilteredProducts(query);
    return products;
  }

  async getPriceRange(query: any): Promise<Product[]> {
    const products = await this.productRepository.getPriceRange(query);
    return products;
  }


  async newestProducts(limit?: number): Promise<Product[]> {
    const products = await this.productRepository.newestProduct(limit);
    return products;
  }

  async featuredProducts(): Promise<Product[]> {
    const products = await this.productRepository.featuredProduct();
    return products;
  }

  async searchProducts(query: string) {
    const products = await this.productRepository.searchByName(query);
    return products;
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    const products = await this.productRepository.getBySellerId(sellerId);
    return products;
  }

  async updateBannerStatus(productId: string, bannerStatus: boolean) {
    const product = await this.productRepository.update(productId, {
      bannerProduct: bannerStatus,
    });

    return product;
  }

  async updateActiveStatus(productId: string, isActive: boolean) {
    const product = await this.productRepository.update(productId, {
      isActive,
    });

    return product;
  }

  async updateProduct(
  productId: string,
  updatedInfo: Partial<Product>,
  newFiles: Express.Multer.File[] = [],
  filesToDelete: string[] = [],
  bannerImageFile?: Express.Multer.File,
  req?: Request
): Promise<{ message: string }> {

  const product = await this.productRepository.findById(productId);
  if (!product) {
    logger.warn("Product not found");
    throw AppError.notFound("Product not found", productId);
  }

  logger.debug("Product found, validating category (if provided)");
  if (updatedInfo.categoryId && !(await this.categoryService.getCategoryById(updatedInfo.categoryId))) {
    logger.warn("Category not found");
    throw AppError.notFound("Category does not exist", updatedInfo.categoryId);
  }

  const beforeState = {
    ...product,
    images: [...product.images],
    bannerImage: product.bannerImage
  };

  let updatedImages = product.images.map(id => id.toString());
  let updatedBannerImage = product.bannerImage;

  if (filesToDelete.length > 0) {
    logger.debug(`🗑️ Deleting files: ${filesToDelete.join(", ")}`);
    const filesToDeleteStrings = filesToDelete.map(id => id.toString());
    const productImageSet = new Set(product.images.map(id => id.toString()));
    const invalidFileIds = filesToDeleteStrings.filter(id => !productImageSet.has(id));

    if (invalidFileIds.length > 0) {
      logger.warn(`Some file IDs not associated: ${invalidFileIds.join(", ")}`);
      throw AppError.badRequest("Some files are not associated with this product", invalidFileIds);
    }

    await Promise.all(
      filesToDeleteStrings.map(async (fileId) => {
        const fileMeta = await this.fileService.getFileMetadata(fileId);
        if (fileMeta?.publicId) {
          logger.debug(`🌩️ Deleting image from Cloudinary: ${fileMeta.publicId}`);
          await this.cloudService.deleteFile(fileMeta.publicId);
          await this.fileService.deleteFileMetadata(fileId);
        }
      })
    );

    updatedImages = updatedImages.filter(id => !filesToDeleteStrings.includes(id));
  }

  if (newFiles.length > 0) {
    logger.debug(`📤 Uploading ${newFiles.length} new files`);
    const uploadResults = await this.cloudService.upload(
      newFiles.map(f => ({ buffer: f.buffer, originalName: f.originalname })),
      'products'
    );
    for (const result of uploadResults) {
      const saved = await this.fileService.saveFileMetadata(result);
      updatedImages.push(saved._id!);
      logger.debug(`✅ Saved new image with ID: ${saved._id}`);
    }
  }

  if (bannerImageFile) {
    logger.debug("📤 Replacing banner image");

    if (updatedBannerImage) {
      const oldBannerMeta = await this.fileService.getFileMetadata(updatedBannerImage.toString());
      if (oldBannerMeta?.publicId) {
        await this.cloudService.deleteFile(oldBannerMeta.publicId);
        await this.fileService.deleteFileMetadata(updatedBannerImage.toString());
        logger.debug("🗑️ Deleted old banner image");
      }
    }

    const bannerUploadResult = await this.cloudService.upload(
      [{ buffer: bannerImageFile.buffer, originalName: bannerImageFile.originalname }],
      'products/banners'
    );

    if (bannerUploadResult.length > 0) {
      const savedBanner = await this.fileService.saveFileMetadata(bannerUploadResult[0]);
      updatedBannerImage = savedBanner._id!;
      logger.debug(`✅ New banner image uploaded with ID: ${updatedBannerImage}`);
    }
  }

  const updatePayload: Partial<Product> = {
    ...updatedInfo,
    ...(filesToDelete.length > 0 || newFiles.length > 0 ? { images: updatedImages } : {}),
    ...(bannerImageFile ? { bannerImage: updatedBannerImage } : {})
  };

  // Safely handle custom fields
  if ('bannerTitle' in updatedInfo) {
    updatePayload.bannerTitle = updatedInfo.bannerTitle;
    logger.debug(` Updating bannerTitle: ${updatedInfo.bannerTitle}`);
  }

  if ('bannerDescription' in updatedInfo) {
    updatePayload.bannerDescription = updatedInfo.bannerDescription;
    logger.debug(`Updating bannerDescription: ${updatedInfo.bannerDescription}`);
  }

  const updatedProduct = await this.productRepository.update(productId, updatePayload);
  logger.debug("Product updated in DB");

  //  Log audit trail
  await this.auditService.logAudit({
    action: 'update_product',
    entity: 'Product',
    entityId: productId,
    userId: product.sellerId,
    status: 'success',
    beforeState,
    afterState: updatedProduct,
    message: 'Product updated successfully',
    req
  });

  return { message: "Product updated successfully" };
}


  async updateQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.update(productId, { quantity: product.quantity });
    return { message: "Product quantity updated successfully" };
  }

  async decreaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }
    product.quantity = Math.max(0, product.quantity - newQuantity);
    await this.productRepository.update(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async increaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }
    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.update(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async deleteProduct(productId: string, req?: Request): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound('Product', productId);
    }
    if (product.status === ProductStatus.DELETED) return { message: "Product already deleted" };
  if (product.images && product.images.length > 0) {
      try {
        // Get all file metadata
        const fileMetadataPromises = product.images.map(fileId => 
          this.fileService.getFileMetadata(fileId)
        );
        const fileMetadataResults = await Promise.all(fileMetadataPromises);
        // Delete files from cloud storage
        const deletePromises = fileMetadataResults
          .filter(meta => meta?.publicId)
          .map(meta => this.cloudService.deleteFile(meta!.publicId!));
        // Delete file metadata from database
        const deleteMetadataPromises = product.images.map(fileId => 
          this.fileService.deleteFileMetadata(fileId)
        );
        await Promise.all([...deletePromises, ...deleteMetadataPromises]);
        logger.info(`All files deleted for product ${productId}`);
      } catch (error) {
        logger.error(`Failed to delete files for product ${productId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    await this.productRepository.update(productId, {
      status: ProductStatus.DELETED,
      deletedAt: new Date(),
      images: []
    });
    await this.auditService.logAudit({
        action: 'delete_product',
        entity: 'Product',
        entityId: productId,
        userId: product.sellerId,
        status: 'success',
        message: 'Product deleted successfully',
        req
      });
    return { message: "Product deleted successfully" };
  }

  async deleteProductsBySellerId(sellerId: string, req?: Request): Promise<{ message: string }> {
    const products = await this.productRepository.getBySellerId(sellerId);
    if (!products || products.length === 0) {
      logger.warn("Product not found for this seller");
      return { message: "No products to delete for this seller" };
    }
    
    await this.productRepository.updateMany(
      { sellerId }, 
      { $set: { status: ProductStatus.DELETED, deletedAt: new Date() } }
    );
    await this.auditService.logAudit({
        action: 'delete_product',
        entity: 'Product',
        entityId: sellerId,
        userId: sellerId,
        status: 'success',
        message: 'Product deleted successfully',
        req
      });
    return { message: "Product deleted successfully" };
  }
}
