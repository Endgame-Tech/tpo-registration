// src/routes/profile.js
import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /profile - retrieve user profile
router.get('/', authenticate, getProfile);

// PATCH /profile - partially update the user profile (for onboarding or later updates)
router.patch('/', authenticate, updateProfile);

export default router;
