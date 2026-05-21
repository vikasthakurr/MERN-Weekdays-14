/**
 * @file index.js
 * @description Application entry point.
 *
 * Boot order:
 *  1. Load environment variables from env/.env
 *  2. Initialise Cloudinary SDK
 *  3. Connect to MongoDB (with retry logic)
 *  4. Connect to Redis
 *  5. Start the HTTP server
 */

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
