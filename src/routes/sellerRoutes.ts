// src/routes/sellerRoutes.ts
import express from "express";
import * as sellerController from "../controllers/sellerController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/products", authMiddleware, roleMiddleware(["seller"]), sellerController.createProduct);
router.get("/products", authMiddleware, roleMiddleware(["seller"]), sellerController.getProducts);
router.patch("/products/:productId", authMiddleware, roleMiddleware(["seller"]), sellerController.updateProduct);
router.delete("/products/:productId", authMiddleware, roleMiddleware(["seller"]), sellerController.deleteProduct);
router.post("/products/:productId/upload-image", authMiddleware, roleMiddleware(["seller"]), upload.single("image"), sellerController.uploadProductImage);
router.get("/orders", authMiddleware, roleMiddleware(["seller"]), sellerController.getOrders);
router.patch("/orders/:orderId/status", authMiddleware, roleMiddleware(["seller"]), sellerController.updateOrderStatus);
router.get("/analytics", authMiddleware, roleMiddleware(["seller"]), sellerController.getAnalytics);

export default router;

