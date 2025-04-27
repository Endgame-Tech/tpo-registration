import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "3d" });

    res.cookie("jwt-tpo-admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.json({
      message: "Admin login successful",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie('jwt-tpo-admin');
  res.json({ message: 'Logged out' });
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-passwordHash");
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(admin);
  } catch (err) {
    console.error("Get admin profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

