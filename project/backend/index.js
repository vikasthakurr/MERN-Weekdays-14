import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import cloudinaryConfig from "./config/cloudinary.config.js";

dotenv.config({ path: "./env/.env" });

cloudinaryConfig();

connectDB()

app.listen(process.env.PORT, () => {
  console.log("server started");
});
