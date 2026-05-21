/**
 * @file error.middleware.js
 * @description Global Express error-handling middleware.
 *
 * Must be registered LAST in app.js (after all routes).
 * Catches errors forwarded via next(err) or thrown inside asyncHandler.
 *
 * Behaviour:
 *  - ApiError instances → use their statusCode and message
 *  - All other errors   → 500 Internal Server Error
 *  - Stack trace        → included in development, hidden in production
 */

import ApiError from "../utils/errorHandler.utils.js";

/**
 * Express 4-argument error handler.
 *
 * @param {Error} err
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }

  // Unhandled / unexpected errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorMiddleware;
