/**
 * @file cloudinary.utils.js
 * @description Helper for uploading files or URLs to Cloudinary.
 *
 * Accepts either a local file path or a remote URL.
 * After a successful upload of a local file, the temp file is deleted.
 * On failure, the temp file is also cleaned up to avoid disk leaks.
 *
 * All uploads go into the "user_avatars" folder on Cloudinary.
 *
 * @requires cloudinaryConfig() to have been called at startup
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Uploads a file or URL to Cloudinary.
 *
 * @param {string} source - Local file path (e.g. "./public/temp/avatar-123.jpg")
 *                          or a remote URL (e.g. "https://example.com/image.png")
 * @returns {Promise<import('cloudinary').UploadApiResponse | null>}
 *          Cloudinary response object on success, null on failure.
 *
 * @example
 * const result = await uploadOnCloudinary(req.file.path);
 * if (result) {
 *   user.profileImage = result.secure_url;
 * }
 */
const uploadOnCloudinary = async (source) => {
  try {
    if (!source) return null;

    const response = await cloudinary.uploader.upload(source, {
      folder: "user_avatars",
      resource_type: "auto",
    });

    // Only delete local files — not remote URLs
    if (!source.startsWith("http") && fs.existsSync(source)) {
      fs.unlinkSync(source);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Clean up temp file even on failure
    if (!source.startsWith("http") && fs.existsSync(source)) {
      fs.unlinkSync(source);
    }

    return null;
  }
};

export default uploadOnCloudinary;
