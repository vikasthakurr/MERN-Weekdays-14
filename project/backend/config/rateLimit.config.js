/**
 * @file rateLimit.config.js
 * @description Pre-configured express-rate-limit instances for each operation type.
 *
 * All limiters use IP-based tracking and return standard RateLimit-* headers.
 * On limit breach they respond with HTTP 429 and a descriptive JSON message.
 *
 * Usage:
 * @example
 * import { loginLimiter, createLimiter } from '../config/rateLimit.config.js';
 * router.post('/login', loginLimiter, loginController);
 * router.post('/',      createLimiter, createController);
 */

import rateLimit from "express-rate-limit";

/**
 * Factory that creates a rate limiter with the given window and max requests.
 *
 * @param {number} windowMinutes - Time window in minutes
 * @param {number} max           - Max requests allowed per window per IP
 * @param {string} message       - Message returned when limit is exceeded
 * @returns {import('express-rate-limit').RateLimitRequestHandler}
 */
const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,  // sends RateLimit-* headers
    legacyHeaders: false,    // disables X-RateLimit-* headers
    handler: (_req, res) => res.status(429).json({ message }),
  });

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** 5 login attempts per IP per hour */
export const loginLimiter    = make(60,  5,  "Too many login attempts. Try again after 1 hour.");

/** 10 registrations per IP per hour */
export const registerLimiter = make(60,  10, "Too many registrations from this IP. Try again after 1 hour.");

// ─── Resource Mutations ───────────────────────────────────────────────────────

/** 20 create requests per IP per 15 minutes */
export const createLimiter   = make(15,  20, "Too many create requests. Try again after 15 minutes.");

/** 30 update requests per IP per 15 minutes */
export const updateLimiter   = make(15,  30, "Too many update requests. Try again after 15 minutes.");

/** 10 delete requests per IP per 15 minutes */
export const deleteLimiter   = make(15,  10, "Too many delete requests. Try again after 15 minutes.");

// ─── General Read ─────────────────────────────────────────────────────────────

/** 100 read requests per IP per minute — loose safety net */
export const readLimiter     = make(1,   100, "Too many requests. Try again after 1 minute.");

export default loginLimiter;
