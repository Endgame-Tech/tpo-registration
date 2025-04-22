// src/utils/imageResizer.js
import sharp from 'sharp';

/**
 * Resize and compress an image buffer.
 * @param {Buffer} inputBuffer – the raw file buffer from multer
 * @param {Object} [options]
 * @param {number} [options.maxWidth=1024] – max width in px
 * @param {number} [options.maxHeight=1024] – max height in px
 * @param {number} [options.quality=80] – JPEG quality (0–100)
 * @returns {Promise<Buffer>} – the processed image buffer
 */
export async function imageResizer(
  inputBuffer,
  { maxWidth = 1024, maxHeight = 1024, quality = 80 } = {}
) {
  return await sharp(inputBuffer)
    .rotate() // auto‑rotate based on EXIF
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality })
    .toBuffer();
}
