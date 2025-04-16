// src/routes/userRoutes.ts
import express from "express";
import * as userController from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.patch("/profile", authMiddleware, userController.updateProfile);
router.get("/addresses", authMiddleware, userController.getAddresses);
router.post("/addresses", authMiddleware, userController.addAddress);

export default router;
