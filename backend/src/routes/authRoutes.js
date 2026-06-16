import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Register handles optional profile picture upload
router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

export default router;
