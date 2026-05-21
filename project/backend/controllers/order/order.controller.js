import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/errorHandler.utils.js";

// ─── USER ─────────────────────────────────────────────────────────────────────

// POST /api/v1/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, payment, shippingCharge = 0, discount = 0 } = req.body;

  if (!items?.length)        throw new ApiError(400, "Order must have at least one item");
  if (!shippingAddress)      throw new ApiError(400, "Shipping address is required");
  if (!payment?.method)      throw new ApiError(400, "Payment method is required");

  // Validate products and build order items
  const productIds = items.map((i) => i.product);
  const products   = await Product.find({ _id: { $in: productIds } }).lean();

  if (products.length !== items.length) {
    throw new ApiError(400, "One or more products not found");
  }

  const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

  const orderItems = items.map((item) => {
    const product = productMap[item.product];
    if (!product) throw new ApiError(404, `Product ${item.product} not found`);
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.title}"`);
    }
    const subtotal = product.price * item.quantity;
    return {
      product:   product._id,
      title:     product.title,
      thumbnail: product.thumbnail,
      price:     product.price,
      quantity:  item.quantity,
      subtotal,
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

  // Decrement stock
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  res.status(201).json(order);
});

// GET /api/v1/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { user: req.user.id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

// GET /api/v1/orders/my/:id
export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  })
    .populate("items.product", "title thumbnail price")
    .lean();

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(order);
});

// PATCH /api/v1/orders/my/:id/cancel
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

// GET /api/v1/orders?page=1&limit=20&status=pending
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
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    orders,
  });
});

// GET /api/v1/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "title thumbnail price")
    .lean();

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(order);
});

// PATCH /api/v1/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  if (status === "delivered")  order.deliveredAt = new Date();
  if (status === "cancelled") {
    order.cancelledAt  = new Date();
    order.cancelReason = req.body.reason || "Cancelled by admin";
  }

  await order.save();

  res.status(200).json({ message: "Order status updated", order });
});

// DELETE /api/v1/orders/:id
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  res.status(200).json({ message: "Order deleted successfully" });
});
