import Product from "../../models/product.model.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import { invalidateCache } from "../../middlewares/cache.middleware.js";

// GET /api/v1/products?page=1&limit=20&category=beauty&search=lipstick
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select("-reviews -meta") // keep response lean
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

// GET /api/v1/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

// GET /api/v1/products/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");
  res.status(200).json(categories);
});
