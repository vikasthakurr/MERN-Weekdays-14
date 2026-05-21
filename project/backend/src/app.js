import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes    from "../routes/auth.routes.js";
import productRoutes from "../routes/product.route.js";
import userRoutes    from "../routes/users.route.js";
import orderRoutes   from "../routes/order.route.js";
import errorMiddleware from "../middlewares/error.middleware.js";

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,   // allow cookies to be sent cross-origin
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
