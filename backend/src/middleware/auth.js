import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate JWT from cookie or Authorization header,
 * attach full user to req.user
 */
export async function authenticate(req, res, next) {
  try {
    // Check both user and admin cookie names
    let token =
      req.cookies?.["jwt-tpo-admin"] || req.cookies?.["jwt-tpo"];

    if (!token && req.headers.authorization) {
      const [scheme, creds] = req.headers.authorization.split(" ");
      if (scheme === "Bearer" && creds) token = creds;
    }

    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Not authenticated" });
  }
}


export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
