// src/controllers/productController.ts
import { Request, Response } from "express";
import * as productService from "../services/productService";
import catchAsyncError from "../middleware/catchAsyncError";

export const getProducts = catchAsyncError(async (req: Request, res: Response) => {
  const products = await productService.getProducts(req.query);
  res.json(products);
});

export const getProduct = catchAsyncError(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.productId);
  res.json(product);
});

export const searchProducts = catchAsyncError(async (req: Request, res: Response) => {
  const products = await productService.searchProducts(req.query.q as string, req.query);
  res.json(products);
});