// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";
import { UnauthorizedError, ForbiddenError } from "./error.middleware";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

declare global {
  namespace Express {
    interface Request {
      user: { userId: string; role: string };
    }
  }
}

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) throw new UnauthorizedError("No access token provided");

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string; role: string };
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive) throw new UnauthorizedError("User not found or inactive");
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid or expired access token"));
  }
};

export const roleMiddleware = (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) throw new ForbiddenError("Insufficient permissions");
  next();
};