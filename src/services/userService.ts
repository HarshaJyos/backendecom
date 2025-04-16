// src/services/userService.ts
import { NotFoundError } from "../middleware/error.middleware";
import { UserModel } from "../models";
import { Address } from "../types";

export const getUserProfile = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password -refreshTokens -otp");
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const updateUserProfile = async (userId: string, data: { name?: string; email?: string }) => {
  const user = await UserModel.findByIdAndUpdate(userId, data, { new: true, runValidators: true }).select("-password -refreshTokens -otp");
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const addAddress = async (userId: string, address: Address) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  user.addresses.push(address);
  await user.save();
  return user.addresses[user.addresses.length - 1];
};

export const getAddresses = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  return user.addresses;
};

