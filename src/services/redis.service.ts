import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (error: any) => {
  console.error("Redis error:", error);
});

export async function getRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }

  return redis;
}
