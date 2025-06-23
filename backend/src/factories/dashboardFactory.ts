import { injectable } from "tsyringe";
import { MongoDashboardRepository } from "@repository/dashboardRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class DashboardRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository() {
        switch (this.storageType) {
            case "MONGO":
                return new MongoDashboardRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}