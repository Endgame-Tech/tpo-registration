import express from "express";
import { createResource, deleteResource, updateResource, getAllResources, searchResources } from "../controllers/resourceController.js";
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get("/", getAllResources);
router.post("/create", authenticate, adminOnly, createResource);
router.patch("/:id", authenticate, adminOnly, updateResource);
router.delete("/:id", authenticate, adminOnly, deleteResource);
router.get('/search', authenticate, adminOnly, searchResources);


// router.post(
//   '/upload-image',
//   authenticate,
//   upload.single('image'),
//   async (req, res) => {
//     try {
//       const resizedBuffer = await imageResizer(req.file.buffer);

//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: 'resource-images',
//           transformation: [{ width: 800, crop: 'limit' }], // adjust as needed
//         },
//         (error, result) => {
//           if (error) {
//             return res.status(500).json({ error: error.message });
//           }
//           res.json({ url: result.secure_url });
//         }
//       );

//       Readable.from(resizedBuffer).pipe(stream);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

export default router;