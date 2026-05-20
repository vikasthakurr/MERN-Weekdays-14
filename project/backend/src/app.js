import express from "express";
import authRoutes from "../routes/auth.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Healthy" });
});

export default app;
