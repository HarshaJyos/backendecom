// src/routes/deliveryRoutes.ts
import express from "express";
import * as deliveryController from "../controllers/deliveryController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/orders", authMiddleware, roleMiddleware(["delivery"]), deliveryController.getOrders);
router.patch("/orders/:orderId/status", authMiddleware, roleMiddleware(["delivery"]), deliveryController.updateDeliveryStatus);
router.patch("/orders/:orderId/location", authMiddleware, roleMiddleware(["delivery"]), deliveryController.updateLocation);

export default router;






