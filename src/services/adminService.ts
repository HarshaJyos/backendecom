// src/services/adminService.ts
import { NotFoundError, BadRequestError } from "../middleware/error.middleware";
import { UserModel, OrderModel, ProductModel } from "../models";

export const getUsers = async (query: any) => {
  const { page = 1, limit = 10, sort, role } = query;
  const filter = role ? { role } : {};
  return UserModel.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort || "-createdAt")
    .select("-password -refreshTokens -otp");
};

export const approveSeller = async (sellerId: string) => {
  const user = await UserModel.findById(sellerId);
  if (!user || user.role !== "seller") throw new NotFoundError("Seller not found");
  user.sellerDetails!.verificationStatus = "approved";
  user.status = "active";
  await user.save();
  return { message: "Seller approved" };
};

export const approveDeliveryBoy = async (deliveryBoyId: string) => {
  const user = await UserModel.findById(deliveryBoyId);
  if (!user || user.role !== "delivery") throw new NotFoundError("Delivery boy not found");
  user.status = "active";
  await user.save();
  return { message: "Delivery boy approved" };
};

export const getAllOrders = async (query: any) => {
  const { page = 1, limit = 10, sort } = query;
  return OrderModel.find()
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort || "-createdAt")
    .populate("products.product buyer deliveryBoy");
};

export const assignDeliveryBoy = async (orderId: string, deliveryBoyId: string) => {
  const order = await OrderModel.findById(orderId);
  const deliveryBoy = await UserModel.findById(deliveryBoyId);
  if (!order || !deliveryBoy || deliveryBoy.role !== "delivery" || !deliveryBoy.deliveryDetails?.availability) throw new NotFoundError("Order or delivery boy not found or unavailable");
  order.deliveryBoy = deliveryBoyId as any;
  order.status = "shipped";
  await order.save();
  return order;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw new NotFoundError("Order not found");
  if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) throw new BadRequestError("Invalid status");
  order.status = status as any;
  await order.save();
  return order;
};

export const getAdminAnalytics = async () => {
  const totalUsers = await UserModel.countDocuments({ status: "active" });
  const usersByRole = await UserModel.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
  const totalRevenue = await OrderModel.aggregate([{ $match: { status: "delivered" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
  const ordersByStatus = await OrderModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  const topProducts = await ProductModel.find().sort("-ratings").limit(5).populate("seller");
  return { totalUsers, usersByRole, totalRevenue: totalRevenue[0]?.total || 0, ordersByStatus, topProducts };
};

