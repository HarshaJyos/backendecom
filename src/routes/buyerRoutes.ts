// src/routes/buyerRoutes.ts
import express from "express";
import * as buyerController from "../controllers/buyerController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/cart", authMiddleware, roleMiddleware(["buyer"]), buyerController.getCart);
router.post("/cart", authMiddleware, roleMiddleware(["buyer"]), buyerController.addToCart);
router.patch("/cart/:itemId", authMiddleware, roleMiddleware(["buyer"]), buyerController.updateCart);
router.delete("/cart/:itemId", authMiddleware, roleMiddleware(["buyer"]), buyerController.removeFromCart);
router.get("/wishlist", authMiddleware, roleMiddleware(["buyer"]), buyerController.getWishlist);
router.post("/wishlist", authMiddleware, roleMiddleware(["buyer"]), buyerController.addToWishlist);
router.post("/checkout", authMiddleware, roleMiddleware(["buyer"]), buyerController.checkout);
router.get("/orders", authMiddleware, roleMiddleware(["buyer"]), buyerController.getOrders);
router.post("/reviews", authMiddleware, roleMiddleware(["buyer"]), buyerController.addReview);

export default router;

