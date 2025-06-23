import { injectable } from "tsyringe";
import { ShippingModel } from "@models/shippingModel";
import { ShipmentInfo } from "@mytypes/shippingTypes";
import { ShippingRepository } from "@mytypes/repoTypes";
import { Types } from "mongoose";

@injectable()
export class MongoShippingRepository implements ShippingRepository {

    async getAll(): Promise<ShipmentInfo[]> {
        return await ShippingModel.find();
    }

    async findById(shippingId: string): Promise<ShipmentInfo | null> {
        return await ShippingModel.findOne({ _id: shippingId });
    }

    async findFirstByUserId(customer_id: string): Promise<ShipmentInfo | null> {
        return await ShippingModel.findOne({customer_id: new Types.ObjectId(customer_id)});
    }

    async getDefaultShippingAddress(customer_id: string): Promise<ShipmentInfo | null> {
  const address = await ShippingModel.findOne({ customer_id: new Types.ObjectId(customer_id), isDefault: true });
  console.log(address)

  if (!address) {
    const firstAvailable = await this.findFirstByUserId(customer_id);
    return firstAvailable || null;
  }

  return address;
}

    async add(shippingData: ShipmentInfo): Promise<ShipmentInfo> {
        const newShipping = new ShippingModel(shippingData);
        await newShipping.save();
        return newShipping.toObject();
    }

    async update(categoryId: string, updatedInfo: Partial<ShipmentInfo>): Promise<void> {
        await ShippingModel.updateOne({ _id: categoryId }, updatedInfo);
    }

    async deleteShippingById(shippingId: string): Promise<boolean> {
        const result = await ShippingModel.deleteOne({ _id: shippingId });
        return result.deletedCount === 1;
    }
}
