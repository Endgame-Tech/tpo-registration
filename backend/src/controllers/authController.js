import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Referral from "../models/Referral.js";
import { sendConfirmationEmail, sendPasswordResetEmail } from '../emails/emailHandlers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


const generateAuthToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '3d' }
  );
};

const generatePasswordResetToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, type: 'passwordReset' },
    JWT_SECRET,
    { expiresIn: '10m' }
  );
};


export const signup = async (req, res) => {
  try {
    const { email, password, referred_by } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    let user = new User({
      email,
      passwordHash: hashedPassword,
      is_verified_user: false,
      emailVerified: false,
      has_onboarded: false,
      personalInfo: {},
      onboardingData: {},
    });

    // If they signed up with a referral link
    if (referred_by) {
      const referringUser = await User.findOne({ member_id: referred_by });
      if (referringUser) {
        user.referred_by = referringUser.member_id;
      }
    }

    user = await user.save();

    // After signup, check if this email was in a pending referral
    const referralRecord = await Referral.findOne({ email });
    if (referralRecord) {
      referralRecord.status = "member";
      await referralRecord.save();
    }

    // Generate JWT
    const authToken = generateAuthToken(user);
    res.cookie("jwt-tpo", authToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "None",           // Required for cross-site cookies (Vercel frontend & backend)
      secure: true,               // Must be true in production for SameSite=None
    });


    // Build email verification token
    const emailConfirmationToken = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const confirmationLink = `${process.env.CLIENT_URL}/auth/confirm-email/${emailConfirmationToken}`;

    res.status(201).json({ message: "User registered successfully" });

    // Send email confirmation separately
    try {
      await sendConfirmationEmail(email, confirmationLink);
      console.log("Confirmation email sent");
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password!" });

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please confirm your email to log in." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const token = generateAuthToken(user);
    res.cookie("jwt-tpo", authToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "None",           // Required for cross-site cookies (Vercel frontend & backend)
      secure: true,               // Must be true in production for SameSite=None
    });

    res.json({ message: "Logged in successfully" });

  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = (req, res) => {
  res.clearCookie("jwt-tpo");
  res.json({ message: "Logged out successfully" });
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id) // Use _id from req.user
      .select("email role has_onboarded emailVerified personalInfo onboardingData")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token and extract userId
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Update user record to mark email as verified
    const user = await User.findByIdAndUpdate(userId, { emailVerified: true }, { new: true });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    res.json({ message: "Email confirmed successfully! You can now log in." });
  } catch (error) {
    console.error("Error confirming email:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'No account found with that email' });

  const token = generatePasswordResetToken(user);
  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/auth/change-password?token=${token}`;
  await sendPasswordResetEmail(email, resetLink);

  res.json({ message: 'Password reset email sent.' });
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "passwordReset") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const user = await User.findById(decoded.userId);
    if (!user ||
      !user.passwordResetToken ||
      user.passwordResetToken !== token ||
      user.passwordResetExpires < Date.now()) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


export const resendConfirmation = async (req, res) => {
  try {
    const { email } = req.body;
    // 1. Must provide an email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account with that email" });
    }
    // 3. If already verified
    if (user.emailVerified) {
      return res
        .status(400)
        .json({ message: "This account is already verified" });
    }
    // 4. Generate a fresh confirmation token (1h expiry)
    const emailToken = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const link = `${process.env.CLIENT_URL}/auth/confirm-email/${emailToken}`;
    // 5. Send the mail
    await sendConfirmationEmail(email, link);
    // 6. Respond
    res.json({ message: "Confirmation email resent. Check your inbox." });
  } catch (err) {
    console.error("Resend confirmation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

