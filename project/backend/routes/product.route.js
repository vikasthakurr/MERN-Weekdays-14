import express from "express";
import {
  getAllProducts,
  getProductById,
  getCategories,
} from "../controllers/product/product.controller.js";
import { cache } from "../middlewares/cache.middleware.js";

const router = express.Router();

// cache TTL: categories rarely change → 10 min, listings → 5 min, single product → 5 min
router.get("/categories", cache(600), getCategories);
router.get("/", cache(300), getAllProducts);
router.get("/:id", cache(300), getProductById);

export default router;
