// src/services/paymentService.ts
import razorpay from "../config/razorpayConfig";
import crypto from "crypto";
import { OrderModel } from "../models";
import { NotFoundError, BadRequestError } from "../middleware/error.middleware";

export const createRazorpayOrder = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order || order.paymentMethod !== "razorpay") throw new NotFoundError("Order not found or invalid payment method");
  const options = { amount: order.totalAmount * 100, currency: "INR", receipt: String(order._id)};
  const razorpayOrder = await razorpay.orders.create(options);
  return razorpayOrder;
};

export const verifyPayment = async (orderId: string, razorpayPaymentId: string, signature: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw new NotFoundError("Order not found");
  const body = order._id + "|" + razorpayPaymentId;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");
  if (expectedSignature !== signature) throw new BadRequestError("Invalid payment signature");
  order.paymentStatus = "completed";
  order.status = "processing";
  await order.save();
  return { message: "Payment verified" };
};

export const markCODCollected = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order || order.paymentMethod !== "cod") throw new NotFoundError("Order not found or not COD");
  if (order.status !== "delivered") throw new BadRequestError("Order not delivered yet");
  order.paymentStatus = "completed";
  await order.save();
  return { message: "COD marked as collected" };
};

