// src/services/productService.ts

import { NotFoundError } from "../middleware/error.middleware";
import { ProductModel } from "../models";


export const getProducts = async (query: any) => {
  const { page = 1, limit = 10, sort, category, minPrice, maxPrice } = query;
  const filter: any = { isActive: true };
  if (category) filter.categories = category;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = minPrice;
  if (maxPrice) filter.price.$lte = maxPrice;
  return ProductModel.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort || "-createdAt")
    .populate("seller", "name");
};

export const getProductById = async (productId: string) => {
  const product = await ProductModel.findById(productId).populate("reviews seller");
  if (!product || !product.isActive) throw new NotFoundError("Product not found");
  return product;
};

export const searchProducts = async (q: string, query: any) => {
  const { page = 1, limit = 10, sort } = query;
  return ProductModel.find({ $text: { $search: q }, isActive: true })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort(sort || "-createdAt")
    .populate("seller", "name");
};

