// src/routes/upload.js
import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { authenticate } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import { imageResizer } from '../utils/imageResizer.js';

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /upload/profile-picture - Upload and resize image, then send to Cloudinary
router.post('/profile-picture', authenticate, upload.single('image'), async (req, res) => {
  try {
    // Apply your image compression/resizing logic
    const resizedBuffer = await imageResizer(req.file.buffer); // should return a Buffer

    // Upload to Cloudinary using an upload stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'profile-pictures', transformation: [{ width: 500, crop: "limit" }] },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({ url: result.secure_url });
      }
    );
    // Convert the resizedBuffer into a stream and pipe it to Cloudinary
    Readable.from(resizedBuffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
