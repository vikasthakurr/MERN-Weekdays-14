/**
 * ==========================================
 * RATE LIMITING IN EXPRESS: A COMPREHENSIVE GUIDE
 * ==========================================
 *
 * WHAT IS RATE LIMITING?
 * Rate limiting is a strategy used to limit the number of requests a client can
 * make to a server within a specified period of time. It is a critical security
 * measure for production applications.
 *
 * WHY IS IT IMPORTANT?
 * - Prevents DoS/DDoS attacks: Stops servers from being overwhelmed by too many requests.
 * - Brute-Force Protection: Prevents attackers from guessing passwords by limiting login attempts.
 * - Cost Control: For paid APIs, it ensures users don't exceed their quotas.
 * - Resource Management: Ensures fair usage of server resources across all users.
 *
 * TYPES OF RATE LIMITING:
 *
 * 1. IP-BASED LIMITING (Default)
 *    Limits requests based on the client's IP address. This is the most common
 *    method but can be bypassable via VPNs or proxies.
 *
 * 2. USER-BASED LIMITING
 *    Limits requests based on a unique user identifier (e.g., User ID or API Key).
 *    Used for authenticated routes.
 *
 * 3. ENDPOINT-SPECIFIC LIMITING
 *    Applying different limits to different routes. For example, a '/login'
 *    route should have a much stricter limit than a '/search' route.
 *
 * 4. GLOBAL LIMITING
 *    A general limit applied to every single request coming into the application.
 *
 * 5. DISTRIBUTED LIMITING (Redis/Memcached)
 *    By default, rate limits are stored in memory (RAM). If you have multiple
 *    server instances (load balancing), you need a shared store like Redis
 *    to track limits across all instances.
 *
 * IMPLEMENTATION (express-rate-limit):
 * The 'express-rate-limit' package is the industry standard for Express.
 * Key Config Options:
 * - windowMs: The duration of the time window (in milliseconds).
 * - max: The maximum number of requests allowed per IP during windowMs.
 * - message: Custom message sent when the limit is exceeded (Status Code 429).
 * - standardHeaders: 'draft-7' (returns RateLimit-* headers).
 * - legacyHeaders: false (disables X-RateLimit-* headers).
 * ==========================================
 */

import express from "express";
import { rateLimit } from "express-rate-limit";

const app = express();

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 attempts per window
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const updateProfileLimit = rateLimit({
  windowMs: 45 * 60 * 1000, // 45 minutes
  max: 2, // Allow 2 updates per window
  message: "Too many update requests, please try again after 45 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/login", loginLimit, (req, res) => {
  res.end("login successfully");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
