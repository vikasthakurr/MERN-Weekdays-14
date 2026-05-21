/**
 * @file cache.middleware.js
 * @description Redis-backed HTTP response cache middleware.
 *
 * How it works:
 *  1. On each request, checks Redis for a cached response keyed by the full URL.
 *  2. Cache HIT  → returns the cached JSON immediately (no DB query).
 *  3. Cache MISS → monkey-patches res.json to intercept the response,
 *                  stores it in Redis with the given TTL, then sends it.
 *
 * Redis errors are swallowed so a Redis outage never breaks the API.
 *
 * Cache key format: "cache:<originalUrl>"
 * Example:          "cache:/api/v1/products?page=1&category=beauty"
 */

import { getRedisClient } from "../config/redis.config.js";

/** Default TTL in seconds (5 minutes) */
const DEFAULT_TTL = 60 * 5;

/**
 * Returns an Express middleware that caches successful (2xx) responses in Redis.
 *
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {import('express').RequestHandler}
 *
 * @example
 * // Cache for 5 minutes (default)
 * router.get('/', cache(), getAllProducts);
 *
 * // Cache for 10 minutes
 * router.get('/categories', cache(600), getCategories);
 */
export function cache(ttl = DEFAULT_TTL) {
  return async (req, res, next) => {
    const redis = getRedisClient();
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        console.log(`[cache HIT] ${key}`);
        return res.status(200).json(JSON.parse(cached));
      }
      console.log(`[cache MISS] ${key}`);
    } catch (err) {
      // Redis failure must never block the request
      console.error("[cache] Redis read error:", err.message);
    }

    // Intercept res.json to store the response before sending it
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await redis.setEx(key, ttl, JSON.stringify(body));
        } catch (err) {
          console.error("[cache] Redis write error:", err.message);
        }
      }
      return originalJson(body);
    };

    next();
  };
}

/**
 * Deletes all Redis cache keys matching the given glob pattern.
 * Call this inside write controllers (create / update / delete) to
 * prevent stale data being served after a mutation.
 *
 * @param {string} pattern - Redis key glob pattern
 * @returns {Promise<void>}
 *
 * @example
 * await invalidateCache("cache:/api/v1/products*");
 */
export async function invalidateCache(pattern) {
  const redis = getRedisClient();
  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(keys);
    console.log(`[cache] Invalidated ${keys.length} key(s) matching "${pattern}"`);
  }
}
