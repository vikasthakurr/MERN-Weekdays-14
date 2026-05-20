import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (source) => {
  try {
    if (!source) return null;
    const response = await cloudinary.uploader.upload(source, {
      folder: "user_avatars",
      resource_type: "auto",
    });
    // only delete if it was a local file path (not a URL)
    if (!source.startsWith("http") && fs.existsSync(source)) {
      fs.unlinkSync(source);
    }
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (!source.startsWith("http") && fs.existsSync(source)) {
      fs.unlinkSync(source);
    }
    return null;
  }
};
export default uploadOnCloudinary;
