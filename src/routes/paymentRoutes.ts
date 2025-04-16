// src/routes/paymentRoutes.ts
import express from "express";
import * as paymentController from "../controllers/paymentController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-order", authMiddleware, roleMiddleware(["buyer"]), paymentController.createOrder);
router.post("/verify", authMiddleware, roleMiddleware(["buyer"]), paymentController.verifyPayment);
router.patch("/cod/:orderId/mark-collected", authMiddleware, roleMiddleware(["delivery", "admin"]), paymentController.markCODCollected);

export default router;