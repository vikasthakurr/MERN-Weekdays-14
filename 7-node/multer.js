/**
 * MULTER MIDDLEWARE NOTES
 * 
 * 1. What is Multer? 
 *    Multer is a node.js middleware for handling `multipart/form-data`, 
 *    which is primarily used for uploading files.
 * 
 * 2. Why use it? 
 *    Express's built-in parsers (json, urlencoded) cannot handle multipart data. 
 *    Multer adds a `file` or `files` object to the `request` object.
 * 
 * 3. Storage Engines:
 *    - MemoryStorage: Stores files in memory as Buffer objects.
 *    - DiskStorage: Stores files on the local disk.
 * 
 * 4. Methods:
 *    - upload.single('fieldname'): For a single file upload.
 *    - upload.array('fieldname', maxCount): For multiple files under the same name.
 *    - upload.fields([{ name: 'avatar', maxCount: 1 }, ...]): For mixed files.
 */

import express, { urlencoded } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

// --- Multer Configuration: Disk Storage ---
// Configures where and how to save the uploaded files locally.
const storage = multer.diskStorage({
  // destination: specifies the folder where files will be stored.
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // filename: specifies the name of the file within the destination.
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = multer({ storage: storage });

// --- Route Handler with Multer Middleware ---
// upload.single("dp") parses the file from the "dp" field in the request.
// The file info is then available at req.file.
app.post("/api/upload", upload.single("dp"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      console.log(err);
      res.end("error");
    } else {
      console.log(result);
      res.end("file uploaded");
      fs.unlinkSync(req.file.path);
    }
  });
});

app.listen(3000, () => {
  console.log("server started");
});
