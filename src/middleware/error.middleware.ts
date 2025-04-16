// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export class ErrorHandler extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends ErrorHandler {
  constructor(message: string) {
    super(401, message);
  }
}

export class ForbiddenError extends ErrorHandler {
  constructor(message: string) {
    super(403, message);
  }
}

export class NotFoundError extends ErrorHandler {
  constructor(message: string) {
    super(404, message);
  }
}

export class BadRequestError extends ErrorHandler {
  constructor(message: string) {
    super(400, message);
  }
}

const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
  }

  if (statusCode >= 500) console.error(`[${new Date().toISOString()}] Error:`, err);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;

