// src/controllers/deliveryController.ts
import { Request, Response } from "express";
import * as deliveryService from "../services/deliveryService";
import catchAsyncError from "../middleware/catchAsyncError";

export const getOrders = catchAsyncError(async (req: Request, res: Response) => {
  const orders = await deliveryService.getAssignedOrders(req.user.userId, req.query);
  res.json(orders);
});

export const updateDeliveryStatus = catchAsyncError(async (req: Request, res: Response) => {
  const order = await deliveryService.updateDeliveryStatus(req.user.userId, req.params.orderId, req.body.status);
  res.json(order);
});

export const updateLocation = catchAsyncError(async (req: Request, res: Response) => {
  const result = await deliveryService.updateLocation(req.user.userId, req.params.orderId, req.body.latitude, req.body.longitude);
  res.json(result);
});