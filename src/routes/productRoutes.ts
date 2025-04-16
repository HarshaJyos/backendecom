// src/routes/productRoutes.ts
import express from "express";
import * as productController from "../controllers/productController";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/:productId", productController.getProduct);

export default router;