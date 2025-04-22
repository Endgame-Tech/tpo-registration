// src/controllers/referralController.js
import User from "../models/User.js";
import Referral from "../models/Referral.js";
import { sendReferralInvitationEmail } from "../emails/emailHandlers.js";

export const getMyUnit = async (req, res) => {
  try {
    const userId = req.user._id;

    // First, load the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Now, find registered users referred by me
    const members = await User.find({ referred_by: user.member_id })
      .select("personalInfo.first_name personalInfo.last_name createdAt email")
      .sort({ createdAt: -1 });

    // Find pending invites I sent
    const pending = await Referral.find({ sender_id: userId, status: "pending" })
      .select("email createdAt");

    res.json({ members, pending });
  } catch (err) {
    console.error("getMyUnit error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendReferralInvites = async (req, res) => {
  const { emails } = req.body;

  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ message: "Emails array is required" });
  }

  if (emails.length > 10) {
    return res.status(400).json({ message: "You can invite a maximum of 10 emails at once" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.member_id) {
      return res.status(404).json({ message: "User not found or missing member_id" });
    }

    const inviteLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/sign-up?ref=${user.member_id}`;
    const senderName = `${user.personalInfo?.first_name || ""} ${user.personalInfo?.last_name || ""}`;

    const invalidEmails = [];
    const alreadyRegistered = [];
    const alreadyInvited = [];

    for (const email of emails) {
      if (!email.includes("@")) {
        invalidEmails.push(email);
        continue;
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        alreadyRegistered.push(email);
        continue;
      }

      const existingReferral = await Referral.findOne({ email, sender_id: user._id });
      if (existingReferral) {
        alreadyInvited.push(email);
        continue;
      }

      // Send the invitation
      await sendReferralInvitationEmail(email, senderName, inviteLink);

      // Save referral to DB
      await Referral.create({
        sender_id: user._id,
        email,
        status: "pending",
      });
    }

    if (invalidEmails.length > 0 || alreadyRegistered.length > 0 || alreadyInvited.length > 0) {
      return res.status(400).json({
        message: "Some emails could not be invited",
        invalidEmails,
        alreadyRegistered,
        alreadyInvited,
      });
    }

    res.json({ message: "Invitations sent successfully!" });
  } catch (err) {
    console.error("sendReferralInvites error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendReferralInvite = async (req, res) => {
  const { inviteId } = req.params;

  try {
    const invite = await Referral.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    const sender = await User.findById(invite.sender_id);
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    const inviteLink = `${process.env.CLIENT_URL}/auth/sign-up?ref=${sender.member_id}`;

    const senderName = `${sender.personalInfo?.first_name || ""} ${sender.personalInfo?.last_name || ""}`;

    await sendReferralInvitationEmail(invite.email, senderName, inviteLink);

    res.json({ message: "Invitation resent successfully" });
  } catch (err) {
    console.error("resendReferralInvite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
