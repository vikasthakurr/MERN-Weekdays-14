/**
 * @file order.controller.js
 * @description Order lifecycle controllers.
 *
 * User endpoints (verifyToken required):
 *  - createOrder    — place a new order; validates stock, snapshots prices,
 *                     decrements stock on success
 *  - getMyOrders    — paginated list of own orders
 *  - getMyOrderById — single order detail (own orders only)
 *  - cancelMyOrder  — cancel own order (pending/confirmed only); restores stock
 *
 * Admin endpoints (verifyToken + isAdmin required):
 *  - getAllOrders      — paginated list of all orders with user info
 *  - getOrderById     — any order detail with populated user and products
 *  - updateOrderStatus — change order status; sets deliveredAt/cancelledAt timestamps
 *  - deleteOrder       — hard delete an order record
 *
 * Price snapshot:
 *  Product price, title, and thumbnail are copied into the order at creation time
 *  so future product edits do not affect historical order records.
 */

import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/errorHandler.utils.js";

// ─── USER ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/orders
 * Places a new order.
 *
 * Validates:
 *  - All product IDs exist in the DB
 *  - Each product has sufficient stock
 *
 * On success:
 *  - Creates the order with snapshotted prices
 *  - Decrements stock for each ordered product
 *
 * @body {Array}  items           - [{ product: ObjectId, quantity: number }]
 * @body {Object} shippingAddress - { fullName, phone, street, city, postalCode, country }
 * @body {Object} payment         - { method: "razorpay"|"cod"|"card" }
 * @body {number} [shippingCharge=0]
 * @body {number} [discount=0]
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, payment, shippingCharge = 0, discount = 0 } = req.body;

  if (!items?.length)   throw new ApiError(400, "Order must have at least one item");
  if (!shippingAddress) throw new ApiError(400, "Shipping address is required");
  if (!payment?.method) throw new ApiError(400, "Payment method is required");

  // Fetch all products in one query
  const productIds = items.map((i) => i.product);
  const products   = await Product.find({ _id: { $in: productIds } }).lean();

  if (products.length !== items.length) {
    throw new ApiError(400, "One or more products not found");
  }

  const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

  // Build order items with price snapshot and stock check
  const orderItems = items.map((item) => {
    const product = productMap[item.product];
    if (!product) throw new ApiError(404, `Product ${item.product} not found`);
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.title}"`);
    }
    return {
      product:   product._id,
      title:     product.title,     // snapshot
      thumbnail: product.thumbnail, // snapshot
      price:     product.price,     // snapshot
      quantity:  item.quantity,
      subtotal:  product.price * item.quantity,
    };
  });

  const itemsTotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
  const grandTotal = itemsTotal + shippingCharge - discount;

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    payment,
    itemsTotal,
    shippingCharge,
    discount,
    grandTotal,
  });

  // Decrement stock for each product
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  res.status(201).json(order);
});

/**
 * GET /api/v1/orders/my
 * Returns the authenticated user's orders, newest first.
 *
 * @query {number} [page=1]   - Page number
 * @query {number} [limit=10] - Items per page
 * @query {string} [status]   - Filter by order status
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { user: req.user.id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    total,
    page:       Number(page),
    limit:      Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

/**
 * GET /api/v1/orders/my/:id
 * Returns a single order belonging to the authenticated user.
 * Populates product title, thumbnail, and price for each item.
 *
 * @param {string} req.params.id - Order ObjectId
 */
export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
    .populate("items.product", "title thumbnail price")
    .lean();

  if (!order) throw new ApiError(404, "Order not found");
  res.status(200).json(order);
});

/**
 * PATCH /api/v1/orders/my/:id/cancel
 * Cancels an order. Only orders with status "pending" or "confirmed" can be cancelled.
 * Restores stock for all items on successful cancellation.
 *
 * @param {string} req.params.id - Order ObjectId
 * @body {string} [reason]       - Optional cancellation reason
 */
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) throw new ApiError(404, "Order not found");

  const cancellable = ["pending", "confirmed"];
  if (!cancellable.includes(order.status)) {
    throw new ApiError(400, `Cannot cancel an order with status "${order.status}"`);
  }

  order.status       = "cancelled";
  order.cancelledAt  = new Date();
  order.cancelReason = req.body.reason || "Cancelled by user";
  await order.save();

  // Restore stock
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

  res.status(200).json({ message: "Order cancelled", order });
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/orders
 * Returns all orders (admin only), newest first, with user name and email populated.
 *
 * @query {number} [page=1]   - Page number
 * @query {number} [limit=20] - Items per page
 * @query {string} [status]   - Filter by order status
 * @query {string} [userId]   - Filter by user ObjectId
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, userId } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.user   = userId;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    total,
    page:       Number(page),
    limit:      Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

/**
 * GET /api/v1/orders/:id
 * Returns a single order with user info and product details populated.
 *
 * @param {string} req.params.id - Order ObjectId
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "title thumbnail price")
    .lean();

  if (!order) throw new ApiError(404, "Order not found");
  res.status(200).json(order);
});

/**
 * PATCH /api/v1/orders/:id/status
 * Updates the status of any order.
 * Automatically sets deliveredAt or cancelledAt timestamps when applicable.
 *
 * @param {string} req.params.id - Order ObjectId
 * @body {string} status         - New status value
 * @body {string} [reason]       - Required when status is "cancelled"
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  if (status === "delivered") order.deliveredAt = new Date();
  if (status === "cancelled") {
    order.cancelledAt  = new Date();
    order.cancelReason = req.body.reason || "Cancelled by admin";
  }

  await order.save();
  res.status(200).json({ message: "Order status updated", order });
});

/**
 * DELETE /api/v1/orders/:id
 * Hard-deletes an order record from the database.
 *
 * @param {string} req.params.id - Order ObjectId
 */
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  res.status(200).json({ message: "Order deleted successfully" });
});
