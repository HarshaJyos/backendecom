// src/controllers/paymentController.ts
import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";
import catchAsyncError from "../middleware/catchAsyncError";

export const createOrder = catchAsyncError(async (req: Request, res: Response) => {
  const order = await paymentService.createRazorpayOrder(req.body.orderId);
  res.json(order);
});

export const verifyPayment = catchAsyncError(async (req: Request, res: Response) => {
  const result = await paymentService.verifyPayment(req.body.orderId, req.body.razorpayPaymentId, req.body.signature);
  res.json(result);
});

export const markCODCollected = catchAsyncError(async (req: Request, res: Response) => {
  const result = await paymentService.markCODCollected(req.params.orderId);
  res.json(result);
});