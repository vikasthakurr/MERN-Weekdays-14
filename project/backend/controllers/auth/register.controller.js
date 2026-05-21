import User from "../../models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import uploadOnCloudinary from "../../utils/cloudinary.utils.js";
import { sendWelcomeEmail } from "../../config/nodemailer.config.js";
import ApiError from "../../utils/errorHandler.utils.js";

const DEFAULT_PROFILE_IMAGE =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const registerController = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await uploadOnCloudinary(DEFAULT_PROFILE_IMAGE);
  const profileImage = cloudinaryResponse
    ? cloudinaryResponse.secure_url
    : DEFAULT_PROFILE_IMAGE;

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    profileImage,
  });

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    profileImage: newUser.profileImage,
  });

  // fire-and-forget — never block the response
  sendWelcomeEmail(newUser.email, newUser.name).catch((err) => {
    console.error("Failed to send welcome email:", err.message || err);
  });
};

export default asyncHandler(registerController);
