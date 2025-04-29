import Resource from "../models/Resource.js";
import cloudinary from "cloudinary";

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error("Error loading resources:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchResources = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Missing search query" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive search

    const results = await Resource.find({
      $or: [
        { title: regex },
        { sub_title: regex },
        { author: regex }
      ]
    })
      .limit(5)
      .select('resource_id title sub_title author'); // only select necessary fields

    res.json(results);
  } catch (error) {
    console.error("Error searching resources:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createResource = async (req, res) => {
  try {
    const { title, sub_title, resource_url, author, image_base64 } = req.body;

    let imageUrl = "";
    if (image_base64) {
      const uploadRes = await cloudinary.v2.uploader.upload(image_base64, {
        folder: "resources",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newResource = new Resource({
      title,
      sub_title,
      resource_url,
      author,
      images_url: imageUrl,
      // created_by: req.user._id,
    });

    const saved = await newResource.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create resource error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Resource.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Resource not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update resource error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resource.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Resource not found" });

    res.json({ message: "Resource deleted" });
  } catch (err) {
    console.error("Delete resource error:", err);
    res.status(500).json({ message: "Server error" });
  }
};