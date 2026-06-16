import Comment from '../models/Comment.js';

// @desc    Get comments for a specific blog
// @route   GET /api/comments/blog/:blogId
// @access  Public
export const getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('user', 'name email profileImage role')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a comment
// @route   POST /api/comments/blog/:blogId
// @access  Private
export const createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const blogId = req.params.blogId;

    if (!comment) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const newComment = new Comment({
      comment,
      blog: blogId,
      user: req.user._id,
    });

    const savedComment = await newComment.save();

    // Populate user info for immediate frontend update
    const populatedComment = await Comment.findById(savedComment._id).populate(
      'user',
      'name email profileImage role'
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership or admin status
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
