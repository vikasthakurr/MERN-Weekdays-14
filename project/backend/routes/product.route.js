import express from "express";
import {
  getAllProducts, getProductById, getCategories,
  createProduct, updateProduct, patchProduct,
  deleteProduct, bulkDeleteProducts,
} from "../controllers/product/product.controller.js";
import { cache } from "../middlewares/cache.middleware.js";
import verifyToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import { createLimiter, updateLimiter, deleteLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/products/categories:
 *   get:
 *     summary: Get all distinct product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Array of category strings
 *         content:
 *           application/json:
 *             schema: { type: array, items: { type: string } }
 */
router.get("/categories", cache(600), getCategories);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products (paginated)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by title
 *     responses:
 *       200:
 *         description: Paginated product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:      { type: integer }
 *                 page:       { type: integer }
 *                 limit:      { type: integer }
 *                 totalPages: { type: integer }
 *                 products:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 */
router.get("/", cache(300), getAllProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product detail with reviews
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.get("/:id", cache(300), getProductById);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a product (admin only)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       403:
 *         description: Admins only
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.post("/", verifyToken, isAdmin, createLimiter, createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Full update a product (admin only)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   patch:
 *     summary: Partial update a product (admin only)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       200:
 *         description: Patched product
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.put(   "/:id",         verifyToken, isAdmin, updateLimiter, updateProduct);
router.patch( "/:id",         verifyToken, isAdmin, updateLimiter, patchProduct);
router.delete("/bulk-delete", verifyToken, isAdmin, deleteLimiter, bulkDeleteProducts);
router.delete("/:id",         verifyToken, isAdmin, deleteLimiter, deleteProduct);

export default router;
