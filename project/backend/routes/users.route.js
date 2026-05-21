import express from "express";
import {
  getMe, updateMe, updateAvatar, changePassword, deleteMe,
  getAllUsers, getUserById, updateUserById, deleteUserById,
} from "../controllers/user/user.controller.js";
import verifyToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { updateLimiter, deleteLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get own profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   patch:
 *     summary: Update own name / email
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:  { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *   delete:
 *     summary: Delete own account
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 */
router.get(   "/me", verifyToken, getMe);
router.patch( "/me", verifyToken, updateLimiter, updateMe);
router.delete("/me", verifyToken, deleteLimiter, deleteMe);

/**
 * @swagger
 * /api/v1/users/me/avatar:
 *   patch:
 *     summary: Upload a new profile image
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 */
router.patch("/me/avatar", verifyToken, upload.single("avatar"), updateAvatar);

/**
 * @swagger
 * /api/v1/users/me/change-password:
 *   patch:
 *     summary: Change own password
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword:     { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Current password incorrect
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.patch("/me/change-password", verifyToken, changePassword);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [user, admin] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated user list
 *       403:
 *         description: Admins only
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
router.get(   "/",    verifyToken, isAdmin, getAllUsers);
router.get(   "/:id", verifyToken, isAdmin, getUserById);
router.patch( "/:id", verifyToken, isAdmin, updateLimiter, updateUserById);
router.delete("/:id", verifyToken, isAdmin, deleteLimiter, deleteUserById);

export default router;
