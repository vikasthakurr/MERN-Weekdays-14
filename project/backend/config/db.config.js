/**
 * @file db.config.js
 * @description MongoDB connection with automatic retry logic.
 *
 * Attempts to connect up to MAX_RETRIES times, waiting RETRY_DELAY_MS
 * between each attempt. Exits the process if all retries are exhausted.
 *
 * @requires MONGO_URI - MongoDB connection string in env/.env
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./env/.env" });

/** Maximum number of connection attempts before giving up */
const MAX_RETRIES = 5;

/** Delay in milliseconds between retry attempts */
const RETRY_DELAY_MS = 5000;

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Connects to MongoDB. Retries up to MAX_RETRIES times on failure,
 * waiting RETRY_DELAY_MS between each attempt.
 *
 * @param {number} [attempt=1] - Current attempt number (used internally for recursion)
 * @returns {Promise<void>}
 */
const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);

    if (attempt >= MAX_RETRIES) {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }

    console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    await wait(RETRY_DELAY_MS);
    return connectDB(attempt + 1);
  }
};

export default connectDB;
