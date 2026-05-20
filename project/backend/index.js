import app from "./src/app.js";
import dotenv from "dotenv";

import connectDB from "./config/db.config.js";
dotenv.config({ path: "./env/.env" });


connectDB()

app.listen(process.env.PORT, () => {
  console.log("server started");
});
