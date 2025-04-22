// src/models/Referral.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ReferralSchema = new Schema({
  sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  inviteLink: { type: String },  // optional
  status: {
    type: String,
    enum: ['pending', 'member'],
    default: 'pending'
  },
}, { timestamps: true });


export default mongoose.model("Referral", ReferralSchema);
