// src/controllers/buyerController.ts
import { Request, Response } from "express";
import * as buyerService from "../services/buyerService";
import catchAsyncError from "../middleware/catchAsyncError";

export const getCart = catchAsyncError(async (req: Request, res: Response) => {
  const cart = await buyerService.getCart(req.user.userId);
  res.json(cart);
});

export const addToCart = catchAsyncError(async (req: Request, res: Response) => {
  const cart = await buyerService.addToCart(req.user.userId, req.body.productId, req.body.variant, req.body.quantity);
  res.json(cart);
});

export const updateCart = catchAsyncError(async (req: Request, res: Response) => {
  const cart = await buyerService.updateCart(req.user.userId, req.params.itemId, req.body.quantity);
  res.json(cart);
});

export const removeFromCart = catchAsyncError(async (req: Request, res: Response) => {
  const cart = await buyerService.removeFromCart(req.user.userId, req.params.itemId);
  res.json(cart);
});

export const getWishlist = catchAsyncError(async (req: Request, res: Response) => {
  const wishlist = await buyerService.getWishlist(req.user.userId);
  res.json(wishlist);
});

export const addToWishlist = catchAsyncError(async (req: Request, res: Response) => {
  const wishlist = await buyerService.addToWishlist(req.user.userId, req.body.productId);
  res.json(wishlist);
});

export const checkout = catchAsyncError(async (req: Request, res: Response) => {
  const order = await buyerService.checkout(req.user.userId, req.body.addressId, req.body.paymentMethod);
  res.status(201).json(order);
});

export const getOrders = catchAsyncError(async (req: Request, res: Response) => {
  const orders = await buyerService.getOrders(req.user.userId);
  res.json(orders);
});

export const addReview = catchAsyncError(async (req: Request, res: Response) => {
  const review = await buyerService.addReview(req.user.userId, req.body.orderId, req.body.productId, req.body.rating, req.body.comment);
  res.status(201).json(review);
});