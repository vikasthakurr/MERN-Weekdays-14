/**
 * @file isAdmin.middleware.js
 * @description Role-based access control middleware.
 *
 * Must be used AFTER verifyToken, which populates req.user.
 * Allows the request to proceed only if req.user.role === "admin".
 *
 * @example
 * router.delete('/:id', verifyToken, isAdmin, deleteProduct);
 */

import ApiError from "../utils/errorHandler.utils.js";

/**
 * Express middleware that restricts access to admin users only.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
const isAdmin = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Access denied. Admins only."));
  }
  next();
};

export default isAdmin;
