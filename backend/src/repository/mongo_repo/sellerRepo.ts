import { injectable } from "tsyringe";
import { SellerModel } from '@models/sellerModel';
import { Seller } from '@mytypes/sellerTypes';
import { SellerRepository } from "@mytypes/repoTypes";

@injectable()
export class MongoSellerRepository implements SellerRepository {

    async getAll(): Promise<Seller[]> {
    return await SellerModel.find({ isDeleted: false }).select('-password -isDeleted');
    }

    async findById(sellerId: string): Promise<Seller | null> {
    return await SellerModel.findOne({ _id: sellerId, isDeleted: false }).select('-password -isDeleted -deletedAt');
    }

    async findByEmail(email: string): Promise<Seller | null> {
    return await SellerModel.findOne({ email, isDeleted: false });
    }

    async add(sellerData: Seller): Promise<Seller> {
        const newSeller = new SellerModel(sellerData );
        await newSeller.save();
        return newSeller.toObject();
    }

    async update(sellerId: string, updatedInfo: Partial<Seller>): Promise<void> {
    await SellerModel.updateOne({ _id: sellerId }, updatedInfo);
    }
}   
