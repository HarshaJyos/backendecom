// src/services/authService.ts
import { UserModel } from "../models";
import { sendEmail, generateOTP } from "../utils/sendemail";
import { BadRequestError, UnauthorizedError } from "../middleware/error.middleware";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const registerUser = async (data: { name: string; email: string; password: string; role: string; businessName?: string; businessAddress?: string }) => {
  const { name, email, password, role, businessName, businessAddress } = data;
  if (!["buyer", "seller", "delivery", "admin"].includes(role)) throw new BadRequestError("Invalid role");

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new BadRequestError("Email already in use");

  const otp = generateOTP();
  const user = new UserModel({
    name,
    email,
    password,
    role,
    status: role === "buyer" ? "pending" : "pending",
    otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    sellerDetails: role === "seller" ? { verificationStatus: "pending", businessName, businessAddress } : undefined,
  });
  await user.save();

  await sendEmail(email, "Verify Your Email", `Your OTP is ${otp}`);
  return { message: "User registered. Please verify your email.", userId: user._id };
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user || !user.isActive || !(await user.comparePassword(password))) throw new UnauthorizedError("Invalid credentials");
  if (!user.emailVerified) throw new UnauthorizedError("Email not verified");
  if (user.status !== "active") throw new UnauthorizedError("Account not active");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  await user.save();

  return { accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

export const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
  const user = await UserModel.findById(decoded.userId);
  if (!user || !user.refreshTokens.some((rt) => rt.token === refreshToken)) throw new UnauthorizedError("Invalid refresh token");
  const accessToken = user.generateAccessToken();
  return { accessToken };
};

export const logoutUser = async (userId: string, refreshToken: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new UnauthorizedError("User not found");
  user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
  await user.save();
};

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new BadRequestError("Email not found");
  const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  await sendEmail(email, "Reset Password", `Reset your password: ${process.env.FRONTEND_URL1}/reset-password?token=${resetToken}`);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const user = await UserModel.findById(decoded.userId).select("+password");
  if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires! < new Date()) throw new UnauthorizedError("Invalid reset token");
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return { message: "Password reset successfully" };
};

export const verifyEmail = async (userId: string, otp: string) => {
  const user = await UserModel.findById(userId);
  if (!user || user.otp?.code !== otp || user.otp?.expiresAt! < new Date()) throw new BadRequestError("Invalid OTP");
  user.emailVerified = true;
  user.otp = undefined;
  if (user.role === "buyer") user.status = "active";
  await user.save();
  return { message: "Email verified" };
};

export const activateAdmin = async (userId: string, secret: string) => {
  const user = await UserModel.findById(userId);
  if (!user || user.role !== "admin" || !user.emailVerified) throw new BadRequestError("Invalid admin activation");
  if (secret !== "Srivalli") throw new BadRequestError("Invalid secret");
  user.status = "active";
  user.adminDetails!.isActivated = true;
  await user.save();
  return { message: "Admin activated" };
};

