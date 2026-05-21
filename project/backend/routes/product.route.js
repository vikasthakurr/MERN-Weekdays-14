import express from "express";
import {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  bulkDeleteProducts,
} from "../controllers/product/product.controller.js";
import { cache } from "../middlewares/cache.middleware.js";
import verifyToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import {
  createLimiter,
  updateLimiter,
  deleteLimiter,
} from "../config/rateLimit.config.js";

const router = express.Router();

// ─── PUBLIC ──────────────────────────────────────────────────────────────────
router.get("/categories", cache(600), getCategories);
router.get("/", cache(300), getAllProducts);
router.get("/:id", cache(300), getProductById);

// ─── ADMIN ───────────────────────────────────────────────────────────────────
router.post(  "/",            verifyToken, isAdmin, createLimiter,  createProduct);
router.put(   "/:id",         verifyToken, isAdmin, updateLimiter,  updateProduct);
router.patch( "/:id",         verifyToken, isAdmin, updateLimiter,  patchProduct);
router.delete("/bulk-delete", verifyToken, isAdmin, deleteLimiter,  bulkDeleteProducts);
router.delete("/:id",         verifyToken, isAdmin, deleteLimiter,  deleteProduct);

export default router;
