import Product from "../../models/product.model.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { invalidateCache } from "../../middlewares/cache.middleware.js";

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

// GET /api/v1/products?page=1&limit=20&category=beauty&search=lipstick
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

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
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    products,
  });
});

// GET /api/v1/products/categories
export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct("category");
  res.status(200).json(categories);
});

// GET /api/v1/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json(product);
});

// ─── ADMIN CRUD ───────────────────────────────────────────────────────────────

// POST /api/v1/products
export const createProduct = asyncHandler(async (req, res) => {
  const { title, price } = req.body;

  if (!title || price === undefined) {
    throw new ApiError(400, "title and price are required");
  }

  const product = await Product.create(req.body);

  await invalidateCache("cache:/api/v1/products*");

  res.status(201).json(product);
});

// PUT /api/v1/products/:id  — full replace
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

// PATCH /api/v1/products/:id  — partial update
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

// DELETE /api/v1/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  await invalidateCache("cache:/api/v1/products*");

  res.status(200).json({ message: "Product deleted successfully" });
});

// DELETE /api/v1/products  — bulk delete by category or ids[]
export const bulkDeleteProducts = asyncHandler(async (req, res) => {
  const { ids, category } = req.body;

  if (!ids?.length && !category) {
    throw new ApiError(400, "Provide ids[] or category to bulk delete");
  }

  const filter = {};
  if (ids?.length) filter._id = { $in: ids };
  if (category) filter.category = category;

  const result = await Product.deleteMany(filter);

  await invalidateCache("cache:/api/v1/products*");

  res.status(200).json({ message: `${result.deletedCount} product(s) deleted` });
});
