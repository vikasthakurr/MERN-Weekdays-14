/**
 * @file multer.middleware.js
 * @description Multer middleware used by routes for file uploads.
 *
 * Files are temporarily saved to ./public/temp before being
 * uploaded to Cloudinary and deleted locally.
 *
 * Usage:
 * @example
 * import { upload } from '../middlewares/multer.middleware.js';
 * router.patch('/me/avatar', upload.single('avatar'), updateAvatar);
 */

import multer from "multer";

const storage = multer.diskStorage({
  // Save all uploads to the temp folder before Cloudinary upload
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },

  // Generates filename: fieldname-timestamp-random-originalname
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
