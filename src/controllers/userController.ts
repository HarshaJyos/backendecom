// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userService from "../services/userService";
import catchAsyncError from "../middleware/catchAsyncError";

export const getProfile = catchAsyncError(async (req: Request, res: Response) => {
  const user = await userService.getUserProfile(req.user.userId);
  res.json(user);
});

export const updateProfile = catchAsyncError(async (req: Request, res: Response) => {
  const user = await userService.updateUserProfile(req.user.userId, req.body);
  res.json(user);
});

export const addAddress = catchAsyncError(async (req: Request, res: Response) => {
  const address = await userService.addAddress(req.user.userId, req.body);
  res.status(201).json(address);
});

export const getAddresses = catchAsyncError(async (req: Request, res: Response) => {
  const addresses = await userService.getAddresses(req.user.userId);
  res.json(addresses);
});