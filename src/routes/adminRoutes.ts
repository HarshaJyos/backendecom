// src/routes/adminRoutes.ts
import express from "express";
import * as adminController from "../controllers/adminController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware(["admin"]), adminController.getUsers);
router.patch("/sellers/:sellerId/approve", authMiddleware, roleMiddleware(["admin"]), adminController.approveSeller);
router.patch("/delivery/:deliveryBoyId/approve", authMiddleware, roleMiddleware(["admin"]), adminController.approveDeliveryBoy);
router.get("/orders", authMiddleware, roleMiddleware(["admin"]), adminController.getOrders);
router.patch("/orders/:orderId/assign-delivery", authMiddleware, roleMiddleware(["admin"]), adminController.assignDeliveryBoy);
router.patch("/orders/:orderId/status", authMiddleware, roleMiddleware(["admin"]), adminController.updateOrderStatus);
router.get("/analytics", authMiddleware, roleMiddleware(["admin"]), adminController.getAnalytics);

export default router;