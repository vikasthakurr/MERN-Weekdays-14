import express from "express";
import register from "../controllers/auth/register.controller.js";
import login from "../controllers/auth/login.controller.js";
import { loginLimiter, registerLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login",    loginLimiter,    login);

export default router;
