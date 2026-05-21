import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.utils.js";

const verifyToken = (req, res, next) => {
  // Accept token from Authorization header OR cookie
  let token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token has expired. Please log in again."));
    }
    return next(new ApiError(401, "Invalid token."));
  }
};

export default verifyToken;
