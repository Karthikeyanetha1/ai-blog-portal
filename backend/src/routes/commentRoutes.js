import express from 'express';
import {
  getCommentsByBlog,
  createComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/blog/:blogId')
  .get(getCommentsByBlog)
  .post(protect, createComment);

router.delete('/:commentId', protect, deleteComment);

export default router;
