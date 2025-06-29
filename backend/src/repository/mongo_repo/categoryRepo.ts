import { injectable } from "tsyringe";
import { CategoryModel } from '@models/categoryModel';
import { Category } from '@mytypes/categoryTypes';
import { CategoryRepository } from "@mytypes/repoTypes";

@injectable()
export class MongoCategoryRepository implements CategoryRepository {

  async getAll(): Promise<Category[]> {
    return await CategoryModel.find();
  }

  async findById(categoryId: string): Promise<Category | null> {
    return await CategoryModel.findOne({ _id: categoryId });
  }

  async findByName(name: string): Promise<Category | null> {
    return await CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  async searchByName(query: string): Promise<Category[]> {
      return CategoryModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } }
        ]
      });
    }

  async add(categoryData: Category): Promise<Category> {
    const newCategory = new CategoryModel(categoryData );
    await newCategory.save();
    return newCategory.toObject();
  }

  async update(categoryId: string, updatedInfo: Partial<Category>): Promise<void> {
    await CategoryModel.updateOne({ _id: categoryId }, updatedInfo);
  }

  async deleteCategoryById(categoryId: string): Promise<boolean> {
    const result = await CategoryModel.deleteOne({ _id: categoryId });
    return result.deletedCount === 1;
  }
}
