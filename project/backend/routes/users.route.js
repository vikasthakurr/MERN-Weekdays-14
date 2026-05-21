import express from "express";
import {
  getMe,
  updateMe,
  updateAvatar,
  changePassword,
  deleteMe,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user/user.controller.js";
import verifyToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { updateLimiter, deleteLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

// ─── OWN PROFILE (any logged-in user) ────────────────────────────────────────
router.get(   "/me",                  verifyToken, getMe);
router.patch( "/me",                  verifyToken, updateLimiter, updateMe);
router.patch( "/me/avatar",           verifyToken, upload.single("avatar"), updateAvatar);
router.patch( "/me/change-password",  verifyToken, changePassword);
router.delete("/me",                  verifyToken, deleteLimiter, deleteMe);

// ─── ADMIN ────────────────────────────────────────────────────────────────────
router.get(   "/",     verifyToken, isAdmin, getAllUsers);
router.get(   "/:id",  verifyToken, isAdmin, getUserById);
router.patch( "/:id",  verifyToken, isAdmin, updateLimiter, updateUserById);
router.delete("/:id",  verifyToken, isAdmin, deleteLimiter, deleteUserById);

export default router;
