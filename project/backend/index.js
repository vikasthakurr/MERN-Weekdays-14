import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import cloudinaryConfig from "./config/cloudinary.config.js";
import { connectRedis } from "./config/redis.config.js";

dotenv.config({ path: "./env/.env" });

cloudinaryConfig();

connectDB();
connectRedis();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
