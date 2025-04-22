import express from 'express';
import {
  signup,
  login,
  logout,
  confirmEmail,
  forgotPassword,
  resetPassword,
  resendConfirmation,
  getCurrentUser,         // <- our existing controller
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/confirm-email/:token', confirmEmail);
router.post('/resend-confirmation', resendConfirmation);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ← NEW ENDPOINT:
router.get('/me', authenticate, getCurrentUser);

export default router;
