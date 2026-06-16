import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Artificial Intelligence',
        'Machine Learning',
        'NLP',
        'Generative AI',
        'Full Stack Development',
        'Web Development',
        'Career Guidance',
        'Software Engineering',
        'Cloud Computing',
        'Programming',
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      required: [true, 'Please add a featured image'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    publishedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
blogSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }

  // Handle simple slugification (removing special characters, replacing spaces with dashes)
  this.slug = this.title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
