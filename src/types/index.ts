// src/types/index.ts
import { Types } from "mongoose";

export type Role = "buyer" | "seller" | "delivery" | "admin";

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  geoLocation?: { latitude: number; longitude: number };
}

export interface User {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: "pending" | "active" | "rejected";
  emailVerified: boolean;
  otp?: { code: string; expiresAt: Date };
  refreshTokens: { token: string; expiresAt: Date }[];
  cart: { product: Types.ObjectId; variant: number; quantity: number }[];
  wishlist: Types.ObjectId[];
  addresses: Address[];
  isActive: boolean;
  sellerDetails?: { verificationStatus: "pending" | "approved" | "rejected"; businessName?: string; businessAddress?: string };
  deliveryDetails?: { currentLocation?: { latitude: number; longitude: number }; availability: boolean };
  adminDetails?: { isActivated: boolean };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface Product {
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categories: string[];
  tags: string[];
  seller: Types.ObjectId;
  ratings: number;
  reviews: Types.ObjectId[];
  variants: { color: string; size: string; price: number; stock: number }[];
  isActive: boolean;
}

export interface Order {
  buyer: Types.ObjectId;
  products: { product: Types.ObjectId; variant: number; quantity: number }[];
  shippingAddress: Address;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "pending" | "completed" | "failed";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  geoLocation?: { latitude: number; longitude: number };
  deliveryBoy?: Types.ObjectId;
  createdAt: Date;
}

export interface Review {
  user: Types.ObjectId;
  product: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

