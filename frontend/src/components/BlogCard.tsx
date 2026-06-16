import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface BlogType {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: 'Artificial Intelligence' | 'Machine Learning' | 'Web Development' | 'Programming' | 'Cloud Computing' | 'Career Guidance' | 'NLP' | 'Generative AI' | 'Full Stack Development' | 'Software Engineering';
  tags: string[];
  featuredImage: string;
  author: {
    name: string;
    profileImage?: string;
  };
  publishedDate: string;
  updatedAt?: string;
  views: number;
  likes: string[];
}

interface BlogCardProps {
  blog: BlogType;
}

const categoryStyles: Record<string, { badge: string; border: string }> = {
  'Artificial Intelligence': { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', border: 'hover:border-rose-500/30' },
  'Machine Learning': { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', border: 'hover:border-cyan-500/30' },
  'Web Development': { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', border: 'hover:border-amber-500/30' },
  'Programming': { badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', border: 'hover:border-violet-500/30' },
  'Cloud Computing': { badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', border: 'hover:border-sky-500/30' },
  'Career Guidance': { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', border: 'hover:border-emerald-500/30' },
};

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const styles = categoryStyles[blog.category] || {
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    border: 'hover:border-slate-500/30',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${styles.border} 
        bg-white border-slate-200 shadow-sm hover:shadow-md
        dark:bg-cyber-card-dark dark:border-slate-800 dark:shadow-none`}
    >
      {/* Cover Image */}
      <Link to={`/blogs/${blog.slug}`} className="block relative overflow-hidden aspect-video">
        <img
          src={`http://localhost:5000${blog.featuredImage}`}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category & Date */}
        <div className="flex items-center justify-between text-xs">
          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wider ${styles.badge}`}>
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(blog.publishedDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold leading-snug text-slate-900 dark:text-white hover:text-cyber-cyan dark:hover:text-cyber-cyan transition-colors line-clamp-2">
          <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </h3>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-slate-200/50 dark:bg-slate-800/50" />

        {/* Footer info: Author, Views, Likes */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {blog.author?.profileImage ? (
              <img
                src={`http://localhost:5000${blog.author.profileImage}`}
                alt={blog.author.name || 'Author'}
                className="h-6 w-6 rounded-full object-cover border border-slate-250 dark:border-slate-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${blog.author?.name || 'Author'}`;
                }}
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyber-cyan/15 text-cyber-cyan text-[10px] font-bold">
                {(blog.author?.name || 'K').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
              {blog.author?.name || 'Karthikeya Gurram'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {blog.likes?.length || 0}
            </span>
          </div>
        </div>

        {/* Read More button */}
        <div className="pt-2">
          <Link
            to={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-cyber-cyan hover:text-cyber-cyan/85 group-hover:gap-2 transition-all"
          >
            Read Full Article
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
