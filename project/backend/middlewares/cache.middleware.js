import { getRedisClient } from "../config/redis.config.js";

const DEFAULT_TTL = 60 * 5; // 5 minutes

/**
 * Cache middleware — uses the full request URL as the cache key.
 * @param {number} ttl  TTL in seconds (default 300)
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
      // Redis failure should never break the request — just skip cache
      console.error("[cache] Redis read error:", err.message);
    }

    // Monkey-patch res.json so we can intercept and store the response
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
 * Invalidate all cache keys matching a pattern.
 * e.g. invalidateCache("cache:/api/v1/products*")
 */
export async function invalidateCache(pattern) {
  const redis = getRedisClient();
  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(keys);
    console.log(`[cache] Invalidated ${keys.length} key(s) matching "${pattern}"`);
  }
}
