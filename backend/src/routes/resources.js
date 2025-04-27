import express from "express";
import { createResource, deleteResource, updateResource, getAllResources } from "../controllers/resourceController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", getAllResources);
router.post("/create", authenticate, createResource);
router.patch("/:id", authenticate, updateResource);
router.delete("/:id", authenticate, deleteResource);

router.post(
  '/upload-image',
  authenticate,
  upload.single('image'),
  async (req, res) => {
    try {
      const resizedBuffer = await imageResizer(req.file.buffer);

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'resource-images',
          transformation: [{ width: 800, crop: 'limit' }], // adjust as needed
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({ url: result.secure_url });
        }
      );

      Readable.from(resizedBuffer).pipe(stream);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;