/**
 * @file verifyToken.middle.js
 * @description JWT authentication middleware.
 *
 * Accepts the token from two sources (in priority order):
 *  1. httpOnly cookie named "token" (set by login)
 *  2. Authorization header: "Bearer <token>"
 *
 * On success, attaches the decoded payload to req.user:
 *  - req.user.id   — MongoDB ObjectId string
 *  - req.user.role — "user" | "admin"
 *  - req.user.iat  — issued-at timestamp
 *  - req.user.exp  — expiry timestamp
 *
 * On failure, forwards an ApiError to the global error middleware.
 */

import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.utils.js";

/**
 * Express middleware that verifies the JWT and populates req.user.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyToken = (req, res, next) => {
  // Prefer cookie; fall back to Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token has expired. Please log in again."));
    }
    return next(new ApiError(401, "Invalid token."));
  }
};

export default verifyToken;
