// src/app.ts
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import connectDB from "./utils/db";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { checkRedisHealth } from "./config/redisClient";
import errorMiddleware from "./middleware/error.middleware";
import routes from "./routes";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === "production" }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests, please try again later",
});
app.use(limiter);

const allowedOrigins = process.env.FRONTEND_URL ? JSON.parse(process.env.FRONTEND_URL) : ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/api/v1/health", async (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  const redisStatus = (await checkRedisHealth()) ? "Connected" : "Disconnected";
  res.status(200).json({ status: "OK", database: dbStatus, redis: redisStatus });
});

connectDB();
app.use("/api/v1", routes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new Error(`Cannot find ${req.originalUrl} on this server`));
});

app.use(errorMiddleware);

export default app;
