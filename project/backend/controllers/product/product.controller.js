/**
 * @file product.controller.js
 * @description Product CRUD controllers.
 *
 * Public endpoints (no auth):
 *  - getAllProducts  — paginated list with optional category/search filters
 *  - getCategories  — distinct category values
 *  - getProductById — full product detail including reviews
 *
 * Admin endpoints (verifyToken + isAdmin required):
 *  - createProduct      — create a single product
 *  - updateProduct      — full replace (PUT)
 *  - patchProduct       — partial update (PATCH)
 *  - deleteProduct      — delete by ID
 *  - bulkDeleteProducts — delete by ids[] or category
 *
 * All write operations call invalidateCache() to clear stale Redis entries.
 */

import Product from "../../models/product.model.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { invalidateCache } from "../../middlewares/cache.middleware.js";

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/products
 * Returns a paginated list of products. Reviews and meta are excluded for performance.
 *
 * @query {number} [page=1]      - Page number
 * @query {number} [limit=20]    - Items per page
 * @query {string} [category]    - Filter by exact category
 * @query {string} [search]      - Case-insensitive title search
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search)   filter.title = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select("-reviews -meta")
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    total,
    page:       Number(page),
    limit:      Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    products,
  });
});

/**
 * GET /api/v1/products/categories
 * Returns an array of all distinct category strings.
 */
export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct("category");
  res.status(200).json(categories);
});

/**
 * GET /api/v1/products/:id
 * Returns a single product including reviews and meta.
 *
 * @param {string} req.params.id - MongoDB ObjectId
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json(product);
});

// ─── ADMIN CRUD ───────────────────────────────────────────────────────────────

/**
 * POST /api/v1/products
 * Creates a new product. Requires title and price at minimum.
 * Invalidates all product cache entries on success.
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { title, price } = req.body;

  if (!title || price === undefined) {
    throw new ApiError(400, "title and price are required");
  }

  const product = await Product.create(req.body);
  await invalidateCache("cache:/api/v1/products*");

  res.status(201).json(product);
});

/**
 * PUT /api/v1/products/:id
 * Full replacement update. All provided fields overwrite existing values.
 * Invalidates all product cache entries on success.
 *
 * @param {string} req.params.id - MongoDB ObjectId
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!product) throw new ApiError(404, "Product not found");

  await invalidateCache("cache:/api/v1/products*");
  res.status(200).json(product);
});

/**
 * PATCH /api/v1/products/:id
 * Partial update — only provided fields are changed.
 * Invalidates all product cache entries on success.
 *
 * @param {string} req.params.id - MongoDB ObjectId
 */
export const patchProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!product) throw new ApiError(404, "Product not found");

  await invalidateCache("cache:/api/v1/products*");
  res.status(200).json(product);
});

/**
 * DELETE /api/v1/products/:id
 * Deletes a single product by ID.
 * Invalidates all product cache entries on success.
 *
 * @param {string} req.params.id - MongoDB ObjectId
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  await invalidateCache("cache:/api/v1/products*");
  res.status(200).json({ message: "Product deleted successfully" });
});

/**
 * DELETE /api/v1/products/bulk-delete
 * Deletes multiple products matching either a list of IDs or a category.
 * At least one of ids[] or category must be provided.
 * Invalidates all product cache entries on success.
 *
 * @body {string[]} [ids]      - Array of MongoDB ObjectIds to delete
 * @body {string}   [category] - Delete all products in this category
 */
export const bulkDeleteProducts = asyncHandler(async (req, res) => {
  const { ids, category } = req.body;

  if (!ids?.length && !category) {
    throw new ApiError(400, "Provide ids[] or category to bulk delete");
  }

  const filter = {};
  if (ids?.length) filter._id = { $in: ids };
  if (category)    filter.category = category;

  const result = await Product.deleteMany(filter);

  await invalidateCache("cache:/api/v1/products*");
  res.status(200).json({ message: `${result.deletedCount} product(s) deleted` });
});
