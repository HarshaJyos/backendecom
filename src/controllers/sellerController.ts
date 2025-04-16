// src/controllers/sellerController.ts
import { Request, Response } from "express";
import * as sellerService from "../services/sellerService";
import catchAsyncError from "../middleware/catchAsyncError";

export const createProduct = catchAsyncError(async (req: Request, res: Response) => {
  const product = await sellerService.createProduct(req.user.userId, req.body);
  res.status(201).json(product);
});

export const getProducts = catchAsyncError(async (req: Request, res: Response) => {
  const products = await sellerService.getSellerProducts(req.user.userId, req.query);
  res.json(products);
});

export const updateProduct = catchAsyncError(async (req: Request, res: Response) => {
  const product = await sellerService.updateProduct(req.user.userId, req.params.productId, req.body);
  res.json(product);
});

export const deleteProduct = catchAsyncError(async (req: Request, res: Response) => {
  await sellerService.deleteProduct(req.user.userId, req.params.productId);
  res.json({ message: "Product deleted" });
});

export const uploadProductImage = catchAsyncError(async (req: Request, res: Response) => {
  const product = await sellerService.uploadProductImage(req.user.userId, req.params.productId, req.file!);
  res.json(product);
});

export const getOrders = catchAsyncError(async (req: Request, res: Response) => {
  const orders = await sellerService.getSellerOrders(req.user.userId, req.query);
  res.json(orders);
});

export const updateOrderStatus = catchAsyncError(async (req: Request, res: Response) => {
  const order = await sellerService.updateOrderStatus(req.user.userId, req.params.orderId, req.body.status);
  res.json(order);
});

export const getAnalytics = catchAsyncError(async (req: Request, res: Response) => {
  const analytics = await sellerService.getSellerAnalytics(req.user.userId);
  res.json(analytics);
});