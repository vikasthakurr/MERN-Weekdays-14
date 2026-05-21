import express from "express";
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order/order.controller.js";
import verifyToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import { createLimiter, updateLimiter, deleteLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

// ─── USER ─────────────────────────────────────────────────────────────────────
router.post(  "/",              verifyToken, createLimiter, createOrder);
router.get(   "/my",            verifyToken, getMyOrders);
router.get(   "/my/:id",        verifyToken, getMyOrderById);
router.patch( "/my/:id/cancel", verifyToken, cancelMyOrder);

// ─── ADMIN ────────────────────────────────────────────────────────────────────
router.get(   "/",          verifyToken, isAdmin, getAllOrders);
router.get(   "/:id",       verifyToken, isAdmin, getOrderById);
router.patch( "/:id/status",verifyToken, isAdmin, updateLimiter, updateOrderStatus);
router.delete("/:id",       verifyToken, isAdmin, deleteLimiter, deleteOrder);

export default router;
