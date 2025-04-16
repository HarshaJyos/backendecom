// src/config/redisClient.ts
import Redis from "ioredis";
import * as dotenv from "dotenv";

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_KEY,
  tls: process.env.REDIS_TLS === "true" ? { rejectUnauthorized: false } : undefined,
  maxRetriesPerRequest: null,
  retryStrategy: (times: number) => (times > 10 ? null : Math.min(times * 100, 3000)),
  connectTimeout: 20000,
  reconnectOnError: (err: Error) => {
    console.error("Redis reconnection error:", err);
    return true;
  },
};

const redisClient = new Redis(redisConfig);

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("close", () => console.log("Redis connection closed"));

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    console.error("Redis health check failed:", error);
    return false;
  }
};

export default redisClient;