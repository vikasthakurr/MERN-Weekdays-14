import rateLimit from "express-rate-limit";

// Limit login attempts to 3 per 60 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: { message: "Too many login attempts from this IP, please try again after an hour" },
  handler: (req, res) => {
    return res.status(429).json({ message: "Too many login attempts from this IP, please try again after an hour" });
  },
});

export default loginLimiter;
