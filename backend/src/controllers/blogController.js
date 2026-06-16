import Blog from '../models/Blog.js';

// @desc    Get all blogs (with search, filter, sort, pagination)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 6 } = req.query;

    // Create query object
    const query = {};

    // Apply search filter (title or tags matching search text)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Determine sorting logic
    let sortOptions = { publishedDate: -1 }; // default: latest
    if (sort === 'popular') {
      sortOptions = { views: -1, createdAt: -1 };
    } else if (sort === 'likes') {
      sortOptions = { likesCount: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { publishedDate: 1 };
    }

    // Pagination setup
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // We can use aggregation to sort by likes size if needed, but for simplicity:
    // If sorting by likes, we can project likes length or sort by it.
    let blogs;
    let totalBlogs;

    if (sort === 'likes') {
      // Aggregate to sort by likes length
      const results = await Blog.aggregate([
        { $match: query },
        {
          $addFields: {
            likesCount: { $size: '$likes' },
          },
        },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: limitNum },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: '$author' },
        {
          $project: {
            'author.password': 0, // exclude password
          },
        },
      ]);

      const countResult = await Blog.countDocuments(query);
      blogs = results;
      totalBlogs = countResult;
    } else {
      blogs = await Blog.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('author', 'name email profileImage role');

      totalBlogs = await Blog.countDocuments(query);
    }

    res.json({
      blogs,
      page: pageNum,
      totalPages: Math.ceil(totalBlogs / limitNum),
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      'author',
      'name email profileImage role'
    );

    if (blog) {
      // Increment views
      blog.views += 1;
      await blog.save();

      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a featured image' });
    }

    const featuredImage = `/uploads/${req.file.filename}`;

    // Process tags (convert comma separated string or array to clean tags array)
    let processedTags = [];
    if (tags) {
      processedTags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag) => tag.trim());
    }

    const blog = new Blog({
      title,
      content,
      category,
      tags: processedTags,
      featuredImage,
      author: req.user._id,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.category = category || blog.category;

      if (tags) {
        blog.tags = Array.isArray(tags)
          ? tags
          : tags.split(',').map((tag) => tag.trim());
      }

      if (req.file) {
        blog.featuredImage = `/uploads/${req.file.filename}`;
      }

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed successfully' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike a blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user already liked the blog
    const alreadyLikedIndex = blog.likes.indexOf(req.user._id);

    if (alreadyLikedIndex !== -1) {
      // Unlike
      blog.likes.splice(alreadyLikedIndex, 1);
      await blog.save();
      res.json({ liked: false, likesCount: blog.likes.length });
    } else {
      // Like
      blog.likes.push(req.user._id);
      await blog.save();
      res.json({ liked: true, likesCount: blog.likes.length });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
