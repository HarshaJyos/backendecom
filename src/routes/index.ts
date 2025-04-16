// src/routes/index.ts
import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import buyerRoutes from "./buyerRoutes";
import sellerRoutes from "./sellerRoutes";
import deliveryRoutes from "./deliveryRoutes";
import adminRoutes from "./adminRoutes";
import productRoutes from "./productRoutes";
import paymentRoutes from "./paymentRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/buyer", buyerRoutes);
router.use("/seller", sellerRoutes);
router.use("/delivery", deliveryRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/payments", paymentRoutes);

export default router;



