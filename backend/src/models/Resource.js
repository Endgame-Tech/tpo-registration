import mongoose from "mongoose";
const { Schema } = mongoose;

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    sub_title: { type: String },
    images_url: { type: String }, // Cloudinary image URL
    resource_url: { type: String },
    author: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", ResourceSchema);