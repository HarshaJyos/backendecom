// src/controllers/adminController.ts
import { Request, Response } from "express";
import * as adminService from "../services/adminService";
import catchAsyncError from "../middleware/catchAsyncError";

export const getUsers = catchAsyncError(async (req: Request, res: Response) => {
  const users = await adminService.getUsers(req.query);
  res.json(users);
});

export const approveSeller = catchAsyncError(async (req: Request, res: Response) => {
  const result = await adminService.approveSeller(req.params.sellerId);
  res.json(result);
});

export const approveDeliveryBoy = catchAsyncError(async (req: Request, res: Response) => {
  const result = await adminService.approveDeliveryBoy(req.params.deliveryBoyId);
  res.json(result);
});

export const getOrders = catchAsyncError(async (req: Request, res: Response) => {
  const orders = await adminService.getAllOrders(req.query);
  res.json(orders);
});

export const assignDeliveryBoy = catchAsyncError(async (req: Request, res: Response) => {
  const order = await adminService.assignDeliveryBoy(req.params.orderId, req.body.deliveryBoyId);
  res.json(order);
});

export const updateOrderStatus = catchAsyncError(async (req: Request, res: Response) => {
  const order = await adminService.updateOrderStatus(req.params.orderId, req.body.status);
  res.json(order);
});

export const getAnalytics = catchAsyncError(async (req: Request, res: Response) => {
  const analytics = await adminService.getAdminAnalytics();
  res.json(analytics);
});