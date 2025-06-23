import { injectable } from "tsyringe";
import { ProductModel } from '@models/productModel';
import { Product, ProductInput } from '@mytypes/productTypes';
import { ProductStatus } from "@mytypes/enumTypes";
import { ProductRepository } from "@mytypes/repoTypes";
import { Types } from 'mongoose';
import mongoose from 'mongoose';

@injectable()
export class MongoProductRepository implements ProductRepository {

  async getAll(limit?: number): Promise<Product[]> {
    const query = ProductModel.find({status: { $nin: ['deleted'] }}).lean().populate([
      { path: 'sellerId', select: 'storeName email address' },
      { path: 'images', select: 'originalName url' },
      { path: 'categoryId', select: 'name' }]);
    if (limit) query.limit(limit);
    return await query;
  }

  async getBannerProducts(): Promise<Product[]> {
      return await ProductModel.find({status: { $nin: ['deleted'] }, isActive: true,}).lean().populate([
      { path: 'images', select: 'originalName url' },
      { path: 'bannerImage', select: 'originalName url' }]);
  }

  async getFilteredProducts(query: any) {
    const { categoryId, minPrice, maxPrice, sort = "newest" } = query;

    const filter: any = { status: { $nin: ['deleted', 'archived'] } };

    if (categoryId) filter.categoryId = categoryId;
    if (minPrice || maxPrice) {
        filter.price = {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
        };
    }

    const sortOptions: Record<string, any> = {
        "newest": { createdAt: -1 },
        "price-high-low": { price: -1 },
        "price-low-high": { price: 1 },
        "name-a-z": { name: 1 },  
        "name-z-a": { name: -1 }   
    };

    const sortBy = sortOptions[sort as string] || sortOptions.newest;

    if (sort !== "name-a-z" && sort !== "name-z-a") {
        return ProductModel.find(filter)
            .sort(sortBy)
            .populate([
                { path: 'sellerId', select: 'storeName email address' },
                { path: 'images', select: 'originalName url' },
                { path: 'categoryId', select: 'name' }
            ]);
    }

    const products = await ProductModel.find(filter)
        .populate([
            { path: 'sellerId', select: 'storeName email address' },
            { path: 'images', select: 'originalName url' },
            { path: 'categoryId', select: 'name' }
        ]);

    return products.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sort === "name-a-z" 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
    });
}

  async getPriceRange(query: any) {
    const { categoryId } = query;

    const pipeline: any[] = [{
      $match: {
        status: { $nin: ['deleted', 'archived'] }
      }
    }];
  
    if (categoryId) {
    pipeline.push({
      $match: {
        categoryId: new mongoose.Types.ObjectId(categoryId),
      },
    });
    }

    pipeline.push({
    $group: {
      _id: null,
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
    },
    });

    const result = await ProductModel.aggregate(pipeline);
    return result[0] || { minPrice: 0, maxPrice: 0 };
}

  async newestProduct(limit?: number): Promise<Product[]> {
    const query = ProductModel.find({status: { $nin: ['deleted', 'archived'] }}).sort({ createdAt: -1 }).lean().populate([
      { path: 'sellerId', select: 'storeName email address' },
      { path: 'images', select: 'originalName url' },
      { path: 'categoryId', select: 'name' }]);
    if (limit) query.limit(limit);
    return await query;
  }

  async featuredProduct(): Promise<Product[]> {
    const query = ProductModel.find({status: { $nin: ['deleted', 'archived'] }, featured: true }).lean().populate([
      { path: 'sellerId', select: 'storeName email address' },
      { path: 'images', select: 'originalName url' },
      { path: 'categoryId', select: 'name' }]);
    return await query;
  }

  async searchByName(query: string): Promise<Product[]> {
    return ProductModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }
      ]
    })
    .limit(20)
    .sort({ createdAt: -1 }).lean().populate([
      { path: 'sellerId', select: 'storeName email address' },
      { path: 'images', select: 'originalName url' },
      { path: 'categoryId', select: 'name' }]);;
  }

  async findById(productId: string): Promise<Product | null> {
    return await ProductModel.findOne({ _id: productId, status: { $ne: ProductStatus.DELETED } }).select('-deletedAt').populate([
      { path: 'sellerId', select: 'storeName email address' },
      { path: 'images', select: 'originalName url' },
      { path: 'categoryId', select: 'name' }]).lean();
  }

  async findByName(name: string): Promise<Product | null> {
    return await ProductModel.findOne({ name, status: { $ne: ProductStatus.DELETED } });
  }

  async add(productData: ProductInput): Promise<Product> {
    const newProduct = new ProductModel(productData);
    await newProduct.save();
    return newProduct.toObject() as Product;
  }

  async update(productId: string, updatedInfo: Partial<Product>): Promise<void> {
    await ProductModel.updateOne({ _id: productId }, updatedInfo);
  }

  async updateMany(filter: object, update: object): Promise<void> {
    await ProductModel.updateMany(filter, update);
  }

  async getBySellerId(sellerId: string): Promise<Product[]> {
    return ProductModel.find({ sellerId: new Types.ObjectId(sellerId), status: { $ne: 'deleted' } }).populate([
      { path: 'sellerId', select: 'storeName email address' },
      { path: 'images', select: 'originalName url' },
      { path: 'categoryId', select: 'name' }]).lean();
  }
}
