// src/utils/uploadToCloudinary.js
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

/**
 * Upload a buffer to Cloudinary with optional transformations.
 * @param {Buffer} buffer - The image buffer to upload.
 * @param {string} folder - Cloudinary folder name (e.g., 'profile-pictures', 'resource-images').
 * @param {Array<Object>} [transformation=[]] - Optional transformation array (e.g., resize).
 * @returns {Promise<Object>} - Cloudinary result object.
 */
export const uploadToCloudinary = (buffer, folder, transformation = []) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, transformation },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};
