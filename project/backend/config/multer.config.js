/**
 * @file multer.config.js
 * @description Multer configuration for handling file uploads.
 *
 * - Storage: disk (saves to ./uploads/)
 * - Allowed types: images only (image/*)
 * - Max file size: 5 MB
 *
 * Note: The active upload middleware used by routes is in
 * middlewares/multer.middleware.js (saves to ./public/temp).
 * This config is kept as an alternative with stricter filtering.
 */

import multer from "multer";
import path from "path";

/**
 * Disk storage engine.
 * Files are saved to ./uploads/ with a unique timestamped filename.
 */
const storage = multer.diskStorage({
  /**
   * @param {import('express').Request} req
   * @param {Express.Multer.File} file
   * @param {Function} cb
   */
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  /**
   * Generates a unique filename: fieldname-timestamp-random.ext
   * @param {import('express').Request} req
   * @param {Express.Multer.File} file
   * @param {Function} cb
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

/**
 * Rejects non-image files.
 * @param {import('express').Request} req
 * @param {Express.Multer.File} file
 * @param {Function} cb
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

export default upload;
