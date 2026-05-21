/**
 * @file cloudinary.config.js
 * @description Initialises the Cloudinary v2 SDK with credentials from environment variables.
 *
 * Call cloudinaryConfig() once at application startup (before any uploads).
 *
 * @requires CLOUDINARY_CLOUD_NAME - Cloudinary cloud name
 * @requires CLOUDINARY_API_KEY    - Cloudinary API key
 * @requires CLOUDINARY_API_SECRET - Cloudinary API secret
 */

import { v2 as cloudinary } from "cloudinary";

/**
 * Configures the Cloudinary SDK.
 * Must be called before any calls to uploadOnCloudinary().
 *
 * @returns {void}
 */
const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default cloudinaryConfig;
