import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Get dashboard analytics overview
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    // 1. Core counters
    const totalBlogs = await Blog.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalComments = await Comment.countDocuments({});

    // Calculate sum of all blog views
    const viewStats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikesCount: { $sum: { $size: '$likes' } },
        },
      },
    ]);

    const totalViews = viewStats[0]?.totalViews || 0;
    const totalLikes = viewStats[0]?.totalLikesCount || 0;

    // 2. Category distribution
    const categoryStats = await Blog.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          views: { $sum: '$views' },
        },
      },
    ]);

    // Format category stats for charts
    const categoryData = categoryStats.map((item) => ({
      category: item._id,
      count: item.count,
      views: item.views,
    }));

    // 3. Latest blogs (5 items)
    const latestBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name profileImage');

    // 4. Latest comments (5 items)
    const latestComments = await Comment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name profileImage')
      .populate('blog', 'title slug');

    // 5. Popular blogs overview (5 items)
    const topBlogs = await Blog.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views category likes');

    res.json({
      counters: {
        totalBlogs,
        totalUsers,
        totalComments,
        totalViews,
        totalLikes,
      },
      categoryData,
      latestBlogs,
      latestComments,
      topBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments (Admin management)
// @route   GET /api/admin/comments
// @access  Private/Admin
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate('user', 'name email profileImage')
      .populate('blog', 'title slug')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin management)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user role between admin and user
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from changing their own role (avoid lockout)
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }
    
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
