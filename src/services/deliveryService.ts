// src/services/deliveryService.ts
import { OrderModel, UserModel } from "../models";
import { NotFoundError, BadRequestError } from "../middleware/error.middleware";

export const getAssignedOrders = async (userId: string, query: any) => {
  const { page = 1, limit = 10, sort } = query;
  return OrderModel.find({ deliveryBoy: userId })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort || "-createdAt")
    .populate("products.product");
};

export const updateDeliveryStatus = async (userId: string, orderId: string, status: string) => {
  const order = await OrderModel.findOne({ _id: orderId, deliveryBoy: userId });
  if (!order) throw new NotFoundError("Order not found");
  if (!["shipped", "delivered"].includes(status)) throw new BadRequestError("Invalid status");
  order.status = status as any;
  await order.save();
  return order;
};

export const updateLocation = async (userId: string, orderId: string, latitude: number, longitude: number) => {
  const order = await OrderModel.findOne({ _id: orderId, deliveryBoy: userId });
  if (!order) throw new NotFoundError("Order not found");
  order.geoLocation = { latitude, longitude };
  await order.save();
  const user = await UserModel.findById(userId);
  if (user) {
    user.deliveryDetails!.currentLocation = { latitude, longitude };
    await user.save();
  }
  return { message: "Location updated" };
};

