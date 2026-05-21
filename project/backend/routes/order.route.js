import express from "express";
import {
  createOrder, getMyOrders, getMyOrderById, cancelMyOrder,
  getAllOrders, getOrderById, updateOrderStatus, deleteOrder,
} from "../controllers/order/order.controller.js";
import verifyToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import { createLimiter, updateLimiter, deleteLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress, payment]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:  { type: string }
 *                     quantity: { type: integer }
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   fullName:   { type: string }
 *                   phone:      { type: string }
 *                   street:     { type: string }
 *                   city:       { type: string }
 *                   postalCode: { type: string }
 *                   country:    { type: string }
 *               payment:
 *                 type: object
 *                 properties:
 *                   method: { type: string, enum: [razorpay, cod, card] }
 *               shippingCharge: { type: number, default: 0 }
 *               discount:       { type: number, default: 0 }
 *     responses:
 *       201:
 *         description: Order placed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.post("/", verifyToken, createLimiter, createOrder);

/**
 * @swagger
 * /api/v1/orders/my:
 *   get:
 *     summary: Get own orders
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated order list
 */
router.get("/my", verifyToken, getMyOrders);

/**
 * @swagger
 * /api/v1/orders/my/{id}:
 *   get:
 *     summary: Get a specific own order
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order detail
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.get("/my/:id", verifyToken, getMyOrderById);

/**
 * @swagger
 * /api/v1/orders/my/{id}/cancel:
 *   patch:
 *     summary: Cancel own order (pending or confirmed only)
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled
 *       400:
 *         description: Order cannot be cancelled at this stage
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.patch("/my/:id/cancel", verifyToken, cancelMyOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated order list with user info
 */
router.get(    "/",           verifyToken, isAdmin, getAllOrders);
router.get(    "/:id",        verifyToken, isAdmin, getOrderById);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
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
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded]
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.patch("/:id/status", verifyToken, isAdmin, updateLimiter, updateOrderStatus);
router.delete("/:id",       verifyToken, isAdmin, deleteLimiter, deleteOrder);

export default router;
