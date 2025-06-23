import { injectable } from "tsyringe";
import { ShippingRepository } from "@mytypes/repoTypes";
import { MongoShippingRepository } from "@repository/shippingRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class ShippingRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): ShippingRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoShippingRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}