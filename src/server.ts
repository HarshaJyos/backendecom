// src/server.ts
import * as dotenv from "dotenv";
import app from "./app";
import http from "http";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "5000", 10);
const HOST: string = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

const signals = ["SIGTERM", "SIGINT"] as const;
signals.forEach((signal) => {
  process.on(signal, () => {
    console.log(`${signal} received. Shutting down`);
    server.close(() => process.exit(0));
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});