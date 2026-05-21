import User from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/asyncHandler.utils.js";
// import ApiError from "../../utils/apiError.utils.js";

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  const cookieDays = parseInt(process.env.COOKIE_EXPIRES_IN, 10) || 1;
  const maxAge = cookieDays * 24 * 60 * 60 * 1000; // days to ms

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
  });
};

export default asyncHandler(loginController);
