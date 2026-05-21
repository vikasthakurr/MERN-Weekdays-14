import express from "express";
import register from "../controllers/auth/register.controller.js"
import login from "../controllers/auth/login.controller.js"
import loginLimiter from "../config/rateLimit.config.js";
import verifyToken from "../middlewares/verifyToken.middle.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",verifyToken, loginLimiter, login);

export default router;
