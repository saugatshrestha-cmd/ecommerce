import { injectable } from "tsyringe";
import { OrderModel } from '@models/orderModel';
import { Order, OrderInput } from '@mytypes/orderTypes';
import { OrderItemStatus } from "@mytypes/enumTypes";
import { OrderRepository } from "@mytypes/repoTypes";
import { Types } from 'mongoose';

@injectable()
export class MongoOrderRepository implements OrderRepository {

  async getAll(): Promise<Order[]> {
    return await OrderModel.find({ isDeleted: false }).sort({ createdAt: -1 }).lean().populate([
      { path: 'userId', select: 'firstName lastName' },
      { path: 'payment', select: 'status method' },
      { path: 'items.sellerId', select: 'storeName email address' },]);
  }

  async findById(orderId: string): Promise<Order | null> {
    return await OrderModel.findOne({ _id: orderId, isDeleted: false }).lean().populate([
      { path: 'shippingId', select: 'address region, city' },]);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await OrderModel.find({ userId, isDeleted: false }).sort({ createdAt: -1 }).select('-isDeleted -deletedAt');
  }

  async getOrderBySellerId(sellerId: string): Promise<Order[]> {
    const orders = await OrderModel.aggregate([
    {
      $match: {
        "items.sellerId": new Types.ObjectId(sellerId),
        isDeleted: false
      }
    },
    { $unwind: "$items" },
    {
      $match: {
        "items.sellerId": new Types.ObjectId(sellerId)
      }
    },
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        shippingId: { $first: "$shippingId" }, 
        total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        payment: { $first: "$payment" },
        timestamp: { $first: "$timestamp" },
        status: { $first: "$status" },
        items: { $push: "$items" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  // Explicitly populate ONLY if needed
  if (orders.length > 0 && typeof orders[0].userId !== 'string') {
    await OrderModel.populate(orders, [
      {
        path: "userId",
        select: "firstName lastName",
        model: "User"
      },
      {
        path: "shippingId",
        select: "address city state country postalCode", // Adjust fields as needed
        model: "Shipping"
      }
    ]);
  }

  return orders;
  }

  async add(orderData: OrderInput): Promise<Order> {
    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    return newOrder.toObject() as Order;
  }

  async update(orderId: string, updatedInfo: Partial<Order>): Promise<void> {
      const result = await OrderModel.updateOne({ _id: orderId }, { $set: updatedInfo });
    }
  
  async updateOrderItemStatus(
  orderId: string, 
  itemId: string, 
  sellerId: string, 
  newStatus: OrderItemStatus
): Promise<void> {
  const result = await OrderModel.updateOne(
    { 
      _id: orderId, 
      'items._id': itemId, 
      'items.sellerId': sellerId 
    },
    { $set: { 'items.$.sellerStatus': newStatus } }
  );
}
}

