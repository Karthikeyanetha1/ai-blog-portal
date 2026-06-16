import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, admin, upload.single('featuredImage'), createBlog);

router.route('/:id')
  .put(protect, admin, upload.single('featuredImage'), updateBlog)
  .delete(protect, admin, deleteBlog);

router.get('/slug/:slug', getBlogBySlug);
router.post('/:id/like', protect, likeBlog);

export default router;
