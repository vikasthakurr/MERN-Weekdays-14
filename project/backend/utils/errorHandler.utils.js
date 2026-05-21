/**
 * @file errorHandler.utils.js
 * @description Custom error class for operational API errors.
 *
 * Extends the native Error class with an HTTP status code and a success flag.
 * Thrown errors are caught by asyncHandler and forwarded to the global
 * error middleware, which formats the JSON response.
 *
 * @example
 * // In a controller:
 * if (!user) throw new ApiError(404, "User not found");
 *
 * // Results in:
 * // HTTP 404 { success: false, message: "User not found" }
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 403, 404, 409, 500)
   * @param {string} message    - Human-readable error description
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // Excludes the constructor itself from the stack trace for cleaner output
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
