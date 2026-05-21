/**
 * @file redis.config.js
 * @description Redis client singleton.
 *
 * Uses a lazy-initialisation pattern — the client is created once on the
 * first call to connectRedis() and reused for all subsequent calls.
 * This ensures the client is only created after dotenv has loaded.
 *
 * @requires REDIS_URL - Redis connection URL in env/.env (e.g. redis://localhost:6379)
 */

import { createClient } from "redis";

/** @type {import('redis').RedisClientType | null} */
let client = null;

/**
 * Creates and connects the Redis client if not already connected.
 * Safe to call multiple times — returns the existing client on subsequent calls.
 *
 * @returns {Promise<import('redis').RedisClientType>} Connected Redis client
 */
export async function connectRedis() {
  if (client) return client;

  client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (err) => {
    console.error("Redis error:", err.message);
  });

  await client.connect();
  console.log("Redis connected");
  return client;
}

/**
 * Returns the active Redis client.
 * Must be called after connectRedis() has resolved.
 *
 * @returns {import('redis').RedisClientType} Active Redis client
 * @throws {Error} If called before connectRedis()
 */
export function getRedisClient() {
  if (!client) {
    throw new Error("Redis not initialised — call connectRedis() first");
  }
  return client;
}

export default { connectRedis, getRedisClient };
