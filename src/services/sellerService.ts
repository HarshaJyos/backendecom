// src/services/sellerService.ts

import cloudinary from "../config/cloudinaryConfig";
import { ForbiddenError, NotFoundError, BadRequestError } from "../middleware/error.middleware";
import { UserModel, ProductModel, OrderModel } from "../models";

export const createProduct = async (userId: string, data: any) => {
  const user = await UserModel.findById(userId);
  if (!user || user.role !== "seller" || user.sellerDetails?.verificationStatus !== "approved") throw new ForbiddenError("Seller not approved");
  const product = new ProductModel({ ...data, seller: userId });
  await product.save();
  return product;
};

export const getSellerProducts = async (userId: string, query: any) => {
  const { page = 1, limit = 10, sort } = query;
  return ProductModel.find({ seller: userId })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort || "-createdAt");
};

export const updateProduct = async (userId: string, productId: string, data: any) => {
  const product = await ProductModel.findOneAndUpdate({ _id: productId, seller: userId }, data, { new: true, runValidators: true });
  if (!product) throw new NotFoundError("Product not found");
  return product;
};

export const deleteProduct = async (userId: string, productId: string) => {
  const product = await ProductModel.findOneAndDelete({ _id: productId, seller: userId });
  if (!product) throw new NotFoundError("Product not found");
};

export const uploadProductImage = async (userId: string, productId: string, file: Express.Multer.File) => {
  const product = await ProductModel.findOne({ _id: productId, seller: userId });
  if (!product) throw new NotFoundError("Product not found");
  const result = await cloudinary.uploader.upload(file.path);
  product.images.push(result.secure_url);
  await product.save();
  return product;
};

export const getSellerOrders = async (userId: string, query: any) => {
  const { page = 1, limit = 10, sort } = query;
  const productIds = await ProductModel.find({ seller: userId }).distinct("_id");
  return OrderModel.find({ "products.product": { $in: productIds } })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort || "-createdAt")
    .populate("products.product");
};

export const updateOrderStatus = async (userId: string, orderId: string, status: string) => {
  const productIds = await ProductModel.find({ seller: userId }).distinct("_id");
  const order = await OrderModel.findOne({ _id: orderId, "products.product": { $in: productIds } });
  if (!order) throw new NotFoundError("Order not found");
  if (!["processing", "shipped"].includes(status)) throw new BadRequestError("Invalid status for seller");
  order.status = status as any;
  await order.save();
  return order;
};

export const getSellerAnalytics = async (userId: string) => {
  const productIds = await ProductModel.find({ seller: userId }).distinct("_id");
  const orders = await OrderModel.find({ "products.product": { $in: productIds }, status: "delivered" });
  const totalIncome = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const productCount = productIds.length;
  const orderCount = orders.length;
  const topProducts = await ProductModel.find({ seller: userId }).sort("-ratings").limit(5);
  return { totalIncome, productCount, orderCount, topProducts };
};

