/**
 * @file app.js
 * @description Express application factory.
 *
 * Registers global middleware in this order:
 *  1. CORS  — allows cross-origin requests from CLIENT_URL with credentials
 *  2. cookie-parser — populates req.cookies (required by verifyToken)
 *  3. express.json / urlencoded — body parsers
 *  4. Swagger UI at /api-docs
 *  5. Domain routes
 *  6. Health check
 *  7. Global error middleware (must be last)
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import authRoutes      from "../routes/auth.routes.js";
import productRoutes   from "../routes/product.route.js";
import userRoutes      from "../routes/users.route.js";
import orderRoutes     from "../routes/order.route.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import swaggerSpec     from "../config/swagger.config.js";

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, // required so the browser sends the httpOnly JWT cookie
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Docs ─────────────────────────────────────────────────────────────────
// Interactive Swagger UI available at http://localhost:<PORT>/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth",     authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users",    userRoutes);
app.use("/api/v1/orders",   orderRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Healthy" });
});

// ─── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorMiddleware);

export default app;
