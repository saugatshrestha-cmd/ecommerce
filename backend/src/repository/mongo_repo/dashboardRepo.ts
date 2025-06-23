import { ProductModel } from '@models/productModel';
import { OrderModel } from '@models/orderModel';
import { UserModel } from '@models/userModel';
import mongoose from 'mongoose';
import { Status, Role } from '@mytypes/enumTypes';
import { injectable } from "tsyringe";

@injectable()
export class MongoDashboardRepository {
    async countProductsBySeller(sellerId: string) {
        return ProductModel.countDocuments({ sellerId: new mongoose.Types.ObjectId(sellerId) });
    }

    async countAllCustomers() {
        return UserModel.countDocuments({role: Role.CUSTOMER});
    }

    async countAllProducts() {
        return ProductModel.countDocuments();
    }

    async countPendingOrdersBySeller(sellerId: string) {
    return OrderModel.countDocuments({
        items: {
        $elemMatch: {
            sellerId: new mongoose.Types.ObjectId(sellerId),
            sellerStatus: Status.PENDING
        }
        }
    });
    }

    async getMonthlyOrdersBySeller(sellerId: string) {
    return OrderModel.aggregate([
        { $unwind: "$items" },
        {
        $match: {
            "items.sellerId": new mongoose.Types.ObjectId(sellerId),
            "items.sellerStatus": { $in: [Status.PENDING, Status.SHIPPED, Status.DELIVERED] }
        }
        },
        {
        $group: {
        _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
        },
        dailyOrderCount: { $sum: 1 },
        },
        },
        {
        $group: {
        _id: {
            year: "$_id.year",
            month: "$_id.month",
        },
        days: {
            $push: {
            day: "$_id.day",
            count: "$dailyOrderCount",
            },
        },
        monthlyOrderCount: { $sum: "$dailyOrderCount" },
        },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    }

    async getMonthlyOrdersForAdmin() {
    return OrderModel.aggregate([
        {
        $group: {
        _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
        },
        dailyOrderCount: { $sum: 1 },
        },
        },
        {
        $group: {
        _id: {
            year: "$_id.year",
            month: "$_id.month",
        },
        days: {
            $push: {
            day: "$_id.day",
            count: "$dailyOrderCount",
            },
        },
        monthlyOrderCount: { $sum: "$dailyOrderCount" },
        },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    }

    async countAllPendingOrders() {
    return OrderModel.countDocuments({
        status: Status.PENDING
    });
    }

    async calculateRevenueBySeller(sellerId: string) {
    const result = await OrderModel.aggregate([
        { $unwind: "$items" },
        {
        $match: {
            "items.sellerId": new mongoose.Types.ObjectId(sellerId),
            "items.sellerStatus": Status.PENDING
        }
        },
        {
        $group: {
            _id: null,
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
        }
    ]);

    return result[0]?.revenue || 0;
    }

    async calculateTotalRevenue() {
    const result = await OrderModel.aggregate([
        { $match: { "payment.payment_status": "paid" } },
        {
        $group: {
            _id: null,
            total: { $sum: "$total" }
        }
        }
    ]);

    return result[0]?.total || 0;
    }

    async getMonthlyRevenueBySeller(sellerId: string) {
    return OrderModel.aggregate([
    { $unwind: "$items" },
    {
        $match: {
        "items.sellerId": new mongoose.Types.ObjectId(sellerId),
        "payment.payment_status": "paid",
        },
    },
    {
        $group: {
        _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
        },
        dailyRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
        },
        },
    },
    {
        $group: {
        _id: {
            year: "$_id.year",
            month: "$_id.month",
        },
        days: {
            $push: {
            day: "$_id.day",
            revenue: "$dailyRevenue",
            },
        },
            monthlyRevenue: { $sum: "$dailyRevenue" },
        },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
}

    async getMonthlyRevenueForAdmin() {
    return OrderModel.aggregate([
    {
        $match: {
        "payment.payment_status": "paid",
        },
    },
    {
        $group: {
        _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
        },
        dailyRevenue: { $sum: "$total" },
        },
    },
    {
        $group: {
        _id: {
            year: "$_id.year",
            month: "$_id.month",
        },
        days: {
            $push: {
            day: "$_id.day",
            revenue: "$dailyRevenue",
            },
        },
        monthlyRevenue: { $sum: "$dailyRevenue" },
        },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
}

};
