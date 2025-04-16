// src/models/index.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, Address, User, Product, Order, Review } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const addressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  geoLocation: {
    latitude: Number,
    longitude: Number,
  },
});

interface UserDocument extends User, Document {
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["buyer", "seller", "delivery", "admin"], required: true },
  status: { type: String, enum: ["pending", "active", "rejected"], default: "pending" },
  emailVerified: { type: Boolean, default: false },
  otp: { code: String, expiresAt: Date },
  refreshTokens: [{ token: String, expiresAt: Date }],
  cart: [{ product: { type: Schema.Types.ObjectId, ref: "Product" }, variant: Number, quantity: Number }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  addresses: [addressSchema],
  isActive: { type: Boolean, default: true },
  sellerDetails: {
    verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    businessName: String,
    businessAddress: String,
  },
  deliveryDetails: {
    currentLocation: { latitude: Number, longitude: Number },
    availability: { type: Boolean, default: true },
  },
  adminDetails: {
    isActivated: { type: Boolean, default: false },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ userId: this._id, role: this.role }, JWT_SECRET, { expiresIn: "15m" });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ userId: this._id, role: this.role }, JWT_SECRET, { expiresIn: "7d" });
};

export const UserModel = mongoose.model<UserDocument>("User", userSchema);

interface ProductDocument extends Product, Document {}

const productSchema = new Schema<ProductDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [String],
  categories: [String],
  tags: [String],
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ratings: { type: Number, default: 0 },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  variants: [{ color: String, size: String, price: Number, stock: Number }],
  isActive: { type: Boolean, default: true },
});

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

interface OrderDocument extends Order, Document {}

const orderSchema = new Schema<OrderDocument>({
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ product: { type: Schema.Types.ObjectId, ref: "Product" }, variant: Number, quantity: Number }],
  shippingAddress: addressSchema,
  paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
  paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  totalAmount: { type: Number, required: true },
  geoLocation: { latitude: Number, longitude: Number },
  deliveryBoy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);

interface ReviewDocument extends Review, Document {}

const reviewSchema = new Schema<ReviewDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

export const ReviewModel = mongoose.model<ReviewDocument>("Review", reviewSchema);

export default {
  UserModel,
  ProductModel,
  OrderModel,
  ReviewModel,
};