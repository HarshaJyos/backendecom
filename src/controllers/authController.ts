// src/controllers/authController.ts
import { Request, Response } from "express";
import * as authService from "../services/authService";
import catchAsyncError from "../middleware/catchAsyncError";

export const register = catchAsyncError(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

export const login = catchAsyncError(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(req.body.email, req.body.password);
  res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Logged in successfully", user });
});

export const refreshToken = catchAsyncError(async (req: Request, res: Response) => {
  const { accessToken } = await authService.refreshToken(req.cookies.refreshToken);
  res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 15 * 60 * 1000 });
  res.json({ message: "Token refreshed" });
});

export const logout = catchAsyncError(async (req: Request, res: Response) => {
  await authService.logoutUser(req.user.userId, req.cookies.refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

export const forgotPassword = catchAsyncError(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res.json({ message: "Password reset email sent" });
});

export const resetPassword = catchAsyncError(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body.token, req.body.newPassword);
  res.json(result);
});

export const verifyEmail = catchAsyncError(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.body.userId, req.body.otp);
  res.json(result);
});

export const activateAdmin = catchAsyncError(async (req: Request, res: Response) => {
  const result = await authService.activateAdmin(req.body.userId, req.body.secret);
  res.json(result);
});