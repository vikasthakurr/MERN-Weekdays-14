import User from "../../models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/errorHandler.utils.js";
import uploadOnCloudinary from "../../utils/cloudinary.utils.js";

// ─── OWN PROFILE ─────────────────────────────────────────────────────────────

// GET /api/v1/users/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password").lean();
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(user);
});

// PATCH /api/v1/users/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // prevent role escalation through this route
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

// PATCH /api/v1/users/me/avatar
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

// PATCH /api/v1/users/me/change-password
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

// DELETE /api/v1/users/me
export const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.clearCookie("token");
  res.status(200).json({ message: "Account deleted successfully" });
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/v1/users?page=1&limit=20&role=user&search=john
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    users,
  });
});

// GET /api/v1/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean();
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(user);
});

// PATCH /api/v1/users/:id
export const updateUserById = asyncHandler(async (req, res) => {
  // admin can update name, email, role — but not password directly
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

// DELETE /api/v1/users/:id
export const deleteUserById = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, "Admins cannot delete their own account from this endpoint");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({ message: "User deleted successfully" });
});
