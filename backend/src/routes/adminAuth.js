import express from 'express';
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
} from '../controllers/adminAuthController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);

router.get('/profile', authenticate, adminOnly, getAdminProfile);
router.post('/logout', authenticate, adminOnly, adminLogout);

export default router;
