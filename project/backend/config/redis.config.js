import { createClient } from "redis";

let client = null;

export async function connectRedis() {
  if (client) return client;

  client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (err) => console.error("Redis error:", err.message));

  await client.connect();
  console.log("Redis connected");
  return client;
}

export function getRedisClient() {
  if (!client) throw new Error("Redis not initialised — call connectRedis() first");
  return client;
}

export default { connectRedis, getRedisClient };
