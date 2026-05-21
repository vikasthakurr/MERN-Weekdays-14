import express from "express";
import authRoutes from "../routes/auth.routes.js";
import productRoutes from "../routes/product.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Healthy" });
});

export default app;
