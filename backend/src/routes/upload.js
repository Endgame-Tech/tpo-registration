// src/routes/upload.js
import express from 'express';
import multer from 'multer';
// import { Readable } from 'stream';
import { authenticate } from '../middleware/auth.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { imageResizer } from '../utils/imageResizer.js';

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /upload/profile-picture - Upload and resize image, then send to Cloudinary
router.post('/profile-picture', authenticate, upload.single('image'), async (req, res) => {
  try {
    const resizedBuffer = await imageResizer(req.file.buffer);
    const result = await uploadToCloudinary(resizedBuffer, 'profile-pictures', [
      { width: 500, crop: 'limit' }
    ]);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /upload/resource-image - Upload and resize resource image
router.post('/resource-image', authenticate, upload.single('image'), async (req, res) => {
  try {
    const resizedBuffer = await imageResizer(req.file.buffer);
    const result = await uploadToCloudinary(resizedBuffer, 'resource-images', [
      { width: 800, crop: 'limit' }
    ]);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Resource upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
