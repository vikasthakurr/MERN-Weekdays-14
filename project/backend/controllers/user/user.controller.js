/**
 * @file user.controller.js
 * @description User profile and admin user management controllers.
 *
 * Own profile endpoints (any authenticated user):
 *  - getMe           — get own profile
 *  - updateMe        — update own name/email (blocks role/password changes)
 *  - updateAvatar    — upload new profile image via Multer → Cloudinary
 *  - changePassword  — change own password (requires current password)
 *  - deleteMe        — delete own account and clear cookie
 *
 * Admin endpoints (verifyToken + isAdmin required):
 *  - getAllUsers      — paginated list with role/name filters
 *  - getUserById     — get any user by ID
 *  - updateUserById  — update any user's name/email/role (not password)
 *  - deleteUserById  — delete any user (cannot delete self)
 */

import User from "../../models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/errorHandler.utils.js";
import uploadOnCloudinary from "../../utils/cloudinary.utils.js";

// ─── OWN PROFILE ─────────────────────────────────────────────────────────────

/**
 * GET /api/v1/users/me
 * Returns the authenticated user's profile (password excluded).
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password").lean();
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(user);
});

/**
 * PATCH /api/v1/users/me
 * Updates the authenticated user's name and/or email.
 * Blocks attempts to change role or password through this endpoint.
 *
 * @body {string} [name]  - New display name
 * @body {string} [email] - New email address
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Guard against privilege escalation
  if (req.body.role || req.body.password) {
    throw new ApiError(400, "Use dedicated endpoints to change password or role");
  }

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { name, email } },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updated) throw new ApiError(404, "User not found");
  res.status(200).json(updated);
});

/**
 * PATCH /api/v1/users/me/avatar
 * Uploads a new profile image via Multer (field: "avatar") → Cloudinary.
 * The local temp file is deleted after upload.
 */
export const updateAvatar = asyncHandler(async (req, res) => {
  const localPath = req.file?.path;
  if (!localPath) throw new ApiError(400, "No image file provided");

  const uploaded = await uploadOnCloudinary(localPath);
  if (!uploaded) throw new ApiError(500, "Image upload failed");

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { profileImage: uploaded.secure_url } },
    { new: true }
  ).select("-password");

  res.status(200).json(updated);
});

/**
 * PATCH /api/v1/users/me/change-password
 * Changes the authenticated user's password.
 * Requires the current password for verification.
 *
 * @body {string} currentPassword - The user's existing password
 * @body {string} newPassword     - The desired new password (min 6 chars)
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "currentPassword and newPassword are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(401, "Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

/**
 * DELETE /api/v1/users/me
 * Deletes the authenticated user's account and clears the auth cookie.
 */
export const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.clearCookie("token");
  res.status(200).json({ message: "Account deleted successfully" });
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/users
 * Returns a paginated list of all users (password excluded).
 *
 * @query {number} [page=1]   - Page number
 * @query {number} [limit=20] - Items per page
 * @query {string} [role]     - Filter by role ("user" | "admin")
 * @query {string} [search]   - Case-insensitive name search
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;

  const filter = {};
  if (role)   filter.role = role;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter).select("-password").skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    total,
    page:       Number(page),
    limit:      Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    users,
  });
});

/**
 * GET /api/v1/users/:id
 * Returns a single user by MongoDB ObjectId (password excluded).
 *
 * @param {string} req.params.id - MongoDB ObjectId
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean();
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(user);
});

/**
 * PATCH /api/v1/users/:id
 * Admin can update a user's name, email, or role.
 * Password updates are blocked — use the dedicated change-password endpoint.
 *
 * @param {string} req.params.id - MongoDB ObjectId
 */
export const updateUserById = asyncHandler(async (req, res) => {
  if (req.body.password) {
    throw new ApiError(400, "Cannot update password through this endpoint");
  }

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updated) throw new ApiError(404, "User not found");
  res.status(200).json(updated);
});

/**
 * DELETE /api/v1/users/:id
 * Deletes a user by ID. Admins cannot delete their own account via this endpoint.
 *
 * @param {string} req.params.id - MongoDB ObjectId
 */
export const deleteUserById = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, "Admins cannot delete their own account from this endpoint");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({ message: "User deleted successfully" });
});
