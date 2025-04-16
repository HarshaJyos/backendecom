// src/services/buyerService.ts
import { UserModel, OrderModel, ProductModel, ReviewModel } from "../models";
import { NotFoundError, BadRequestError } from "../middleware/error.middleware";

export const getCart = async (userId: string) => {
  const user = await UserModel.findById(userId).populate("cart.product");
  if (!user || user.role !== "buyer") throw new NotFoundError("User not found");
  return user.cart;
};

export const addToCart = async (userId: string, productId: string, variant: number, quantity: number) => {
  const user = await UserModel.findById(userId);
  const product = await ProductModel.findById(productId);
  if (!user || user.role !== "buyer" || !product) throw new NotFoundError("User or product not found");
  const variantData = product.variants[variant];
  if (!variantData || variantData.stock < quantity) throw new BadRequestError("Invalid variant or insufficient stock");
  const cartItem = user.cart.find((item) => item.product.toString() === productId && item.variant === variant);
  if (cartItem) cartItem.quantity += quantity;
  else user.cart.push({ product: productId as any, variant, quantity });
  await user.save();
  return user.cart;
};

export const updateCart = async (userId: string, itemId: string, quantity: number) => {
  const user = await UserModel.findById(userId);
  if (!user || user.role !== "buyer") throw new NotFoundError("User meditations not found");
  const cartItem = user.cart.find((item: any, idx: number) => String(item._id ?? idx) === itemId);
  if (!cartItem) throw new NotFoundError("Cart item not found");
  const product = await ProductModel.findById(cartItem.product);
  if (!product || product.variants[cartItem.variant].stock < quantity) throw new BadRequestError("Insufficient stock");
  cartItem.quantity = quantity;
  await user.save();
  return user.cart;
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const user = await UserModel.findById(userId);
  if (!user || user.role !== "buyer") throw new NotFoundError("User not found");
  user.cart = user.cart.filter((item, idx) => String((item as any)._id ?? idx) !== itemId);
  await user.save();
  return user.cart;
};

export const getWishlist = async (userId: string) => {
  const user = await UserModel.findById(userId).populate("wishlist");
  if (!user || user.role !== "buyer") throw new NotFoundError("User not found");
  return user.wishlist;
};

export const addToWishlist = async (userId: string, productId: string) => {
  const user = await UserModel.findById(userId);
  const product = await ProductModel.findById(productId);
  if (!user || user.role !== "buyer" || !product) throw new NotFoundError("User or product not found");
  if (!user.wishlist.includes(productId as any)) user.wishlist.push(productId as any);
  await user.save();
  return user.wishlist;
};

export const checkout = async (userId: string, addressId: string, paymentMethod: string) => {
  const user = await UserModel.findById(userId).populate("cart.product");
  if (!user || user.role !== "buyer" || !user.cart.length) throw new BadRequestError("Invalid checkout request");
  const address = user.addresses.find((addr: any) => addr._id?.toString() === addressId);
  if (!address) throw new NotFoundError("Address not found");

  let totalAmount = 0;
  const products = user.cart.map((item) => {
    const product = item.product as any;
    const variant = product.variants[item.variant];
    totalAmount += variant.price * item.quantity;
    return { product: product._id, variant: item.variant, quantity: item.quantity };
  });

  const order = new OrderModel({
    buyer: userId,
    products,
    shippingAddress: address,
    paymentMethod,
    totalAmount,
  });
  await order.save();
  user.cart = [];
  await user.save();
  return order;
};

export const getOrders = async (userId: string) => {
  return OrderModel.find({ buyer: userId }).populate("products.product");
};

export const addReview = async (userId: string, orderId: string, productId: string, rating: number, comment?: string) => {
  const order = await OrderModel.findOne({ _id: orderId, buyer: userId, status: "delivered" });
  if (!order) throw new BadRequestError("Order not found or not delivered");
  const product = await ProductModel.findById(productId);
  if (!product || !order.products.some((p) => p.product.toString() === productId)) throw new NotFoundError("Product not in order");

  const review = new ReviewModel({ user: userId, product: productId, order: orderId, rating, comment });
  await review.save();
  product.reviews.push(review._id as any);
  const reviews = await ReviewModel.find({ product: productId });
  product.ratings = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await product.save();
  return review;
};

