import express from 'express';
import {
  getAnalytics,
  getAllComments,
  getAllUsers,
  toggleUserRole,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All endpoints require the user to be logged in AND have an admin role
router.get('/analytics', protect, admin, getAnalytics);
router.get('/comments', protect, admin, getAllComments);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, toggleUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
