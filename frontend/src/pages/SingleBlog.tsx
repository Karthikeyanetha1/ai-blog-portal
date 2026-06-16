import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, Heart, MessageSquare, Share2, Link2, Trash2, ArrowLeft, Bookmark, Clock, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import BlogCard from '../components/BlogCard';
import type { BlogType } from '../components/BlogCard';
import { BlogDetailsSkeleton } from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

interface CommentType {
  _id: string;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
    role: 'user' | 'admin';
  };
}

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const categoryColors: Record<string, string> = {
  'Artificial Intelligence': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Machine Learning': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Web Development': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Programming': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Cloud Computing': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'Career Guidance': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const SingleBlog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState<BlogType[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<BlogType[]>([]);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useDocumentMetadata({
    title: blog ? blog.title : 'Loading Publication',
    description: blog ? blog.content.replace(/[#*`]/g, '').slice(0, 155) + '...' : 'Loading publication content...',
    keywords: blog ? blog.tags : ['AI', 'ML', 'Engineering'],
    ogType: 'article',
    ogImage: blog ? `http://localhost:5000${blog.featuredImage}` : undefined,
    schema: blog ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blog.title,
      'image': `http://localhost:5000${blog.featuredImage}`,
      'datePublished': blog.publishedDate,
      'dateModified': blog.updatedAt || blog.publishedDate,
      'author': {
        '@type': 'Person',
        'name': blog.author?.name || 'Karthikeya Gurram'
      },
      'publisher': {
        '@type': 'Person',
        'name': 'Karthikeya Gurram'
      },
      'description': blog.content.replace(/[#*`]/g, '').slice(0, 155)
    } : undefined
  });

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const blogRes = await API.get(`/blogs/slug/${slug}`);
      const blogData = blogRes.data;
      setBlog(blogData);
      setLikesCount(blogData.likes.length);
      
      if (user) {
        setLiked(blogData.likes.includes(user._id));
      }

      const commentsRes = await API.get(`/comments/blog/${blogData._id}`);
      setComments(commentsRes.data);

      const relatedRes = await API.get(`/blogs?category=${encodeURIComponent(blogData.category)}&limit=4`);
      const relatedFiltered = relatedRes.data.blogs.filter((p: BlogType) => p._id !== blogData._id).slice(0, 3);
      setRelatedPosts(relatedFiltered);

      const trendingRes = await API.get('/blogs?sort=popular&limit=5');
      setTrendingPosts(trendingRes.data.blogs.filter((p: BlogType) => p._id !== blogData._id).slice(0, 4));

    } catch (error: any) {
      console.error('Failed to load blog details:', error);
      if (error.response?.status === 404) {
        navigate('/blogs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug, user]);

  // Sync Bookmarks with local storage
  useEffect(() => {
    if (blog) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(blog.slug));
    }
  }, [blog]);

  const toggleBookmark = () => {
    if (!blog) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let updated;
    if (bookmarks.includes(blog.slug)) {
      updated = bookmarks.filter((s: string) => s !== blog.slug);
      setIsBookmarked(false);
    } else {
      updated = [...bookmarks, blog.slug];
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    try {
      const { data } = await API.post(`/blogs/${blog?._id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !blog) return;
    setCommentSubmitting(true);
    try {
      const { data } = await API.post(`/comments/blog/${blog._id}`, { comment: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 225);
    return `${time} min read`;
  };

  const generateTOC = () => {
    if (!blog) return [];
    const items: { id: string; text: string; level: number }[] = [];
    blog.content.split('\n\n').forEach((paragraph) => {
      const match = paragraph.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, text, level });
      }
    });
    return items;
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  if (!blog) {
    return <div className="text-center py-20 text-slate-500">Post not found.</div>;
  }

  const toc = generateTOC();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 bg-cyber-dark text-slate-100">
      
      {/* Back button */}
      <div>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Publications
        </Link>
      </div>

      {/* Grid: 8 cols main, 4 cols sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Article Body */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${categoryColors[blog.category] || 'bg-slate-800'}`}>
                  {blog.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(blog.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 border-l border-slate-800 pl-2">
                  <Clock className="h-3.5 w-3.5 text-cyber-cyan" />
                  {calculateReadingTime(blog.content)}
                </span>
              </div>

              {/* Bookmark state toggler */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full border border-slate-800 hover:bg-slate-850 hover:text-cyber-cyan transition-all cursor-pointer ${
                  isBookmarked ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/35' : 'text-slate-400'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
              >
                <Bookmark className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {blog.title}
            </h1>

            {/* Stats view & Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-850/50 py-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {blog.views} Views
                </span>
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1 hover:text-cyber-cyan transition-colors ${liked ? 'text-rose-500 font-bold' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  {likesCount} Likes
                </button>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {comments.length} Comments
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Share2 className="h-3.5 w-3.5" /> Share:
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-slate-850 text-slate-400 hover:text-cyber-cyan transition-colors"
                >
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-slate-855 text-slate-400 hover:text-cyber-cyan transition-colors"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <button
                  onClick={copyUrl}
                  className="p-1.5 rounded-full hover:bg-slate-855 text-slate-400 hover:text-cyber-cyan transition-colors relative"
                >
                  <Link2 className="h-4 w-4" />
                  {copiedLink && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="overflow-hidden rounded-3xl border border-slate-850 shadow-lg bg-[#0B0F19]">
            <img
              src={`http://localhost:5000${blog.featuredImage}`}
              alt={blog.title}
              className="w-full aspect-[16/9] md:aspect-[21/9] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800';
              }}
            />
          </div>

          {/* Blog Content body */}
          <article className="prose-custom text-slate-300">
            {blog.content.split('\n\n').map((paragraph: string, index: number) => {
              const cleanText = paragraph.replace(/^###?\s+/, '');
              const headingId = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

              if (paragraph.startsWith('### ')) {
                return <h3 id={headingId} key={index} className="text-lg font-bold text-white mt-6 mb-2 tracking-tight">{cleanText}</h3>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 id={headingId} key={index} className="text-xl font-extrabold text-white mt-8 mb-3 tracking-tight">{cleanText}</h2>;
              }
              if (paragraph.startsWith('# ')) {
                return <h1 id={headingId} key={index} className="text-2xl font-black text-white mt-10 mb-4 tracking-tight">{cleanText}</h1>;
              }
              if (paragraph.startsWith('```')) {
                const cleanCode = paragraph.replace(/```[a-z]*/, '').replace(/```$/, '');
                return (
                  <pre key={index} className="p-4 rounded-xl border border-slate-850 bg-slate-900/60 font-mono text-xs overflow-x-auto my-4 text-slate-200">
                    <code>{cleanCode}</code>
                  </pre>
                );
              }
              return <p key={index} className="leading-relaxed mb-4 text-xs sm:text-sm">{paragraph}</p>;
            })}
          </article>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-850/50">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs?search=${encodeURIComponent(tag)}`}
                  className="text-[11px] px-3 py-1 rounded-full bg-[#111827] text-slate-400 border border-slate-850 hover:bg-slate-850 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Comments */}
          <section className="space-y-6 pt-6 border-t border-slate-850/50">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cyber-cyan" /> Comments ({comments.length})
            </h3>

            {user ? (
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  placeholder="Share your thoughts on this publication..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 px-4 py-3 text-xs bg-slate-900/40 text-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={commentSubmitting || !newComment.trim()}
                    className="rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-6 py-2.5 text-xs font-bold text-white shadow hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {commentSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-2xl border border-slate-850 bg-cyber-card-dark/40 text-center text-xs">
                <span className="text-slate-450">You must be logged in to comment. </span>
                <Link to="/login" className="font-bold text-cyber-cyan hover:underline">Sign In Here</Link>
              </div>
            )}

            <div className="space-y-4">
              <AnimatePresence>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-5 rounded-2xl border border-slate-850 bg-cyber-card-dark/40 flex gap-4"
                    >
                      <div className="shrink-0">
                        {comment.user.profileImage ? (
                          <img
                            src={`http://localhost:5000${comment.user.profileImage}`}
                            alt={comment.user.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-800"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.user.name}`;
                            }}
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyber-purple/15 text-cyber-purple text-xs font-bold">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white mr-2">{comment.user.name}</span>
                            {comment.user.role === 'admin' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20 uppercase font-bold tracking-wider">Admin</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                          {comment.comment}
                        </p>
                      </div>

                      {(user?.role === 'admin' || user?._id === comment.user._id) && (
                        <div className="shrink-0 flex items-start">
                          <button
                            onClick={() => handleCommentDelete(comment._id)}
                            className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                            title="Delete Comment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">No comments yet. Be the first to start the discussion!</div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Table of Contents Widget */}
          {toc.length > 0 && (
            <div className="p-6 rounded-3xl border border-slate-855 bg-cyber-card-dark space-y-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5 pb-2.5 border-b border-slate-850">
                <List className="h-4 w-4 text-cyber-cyan" /> Table of Contents
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                {toc.map((item, index) => (
                  <li 
                    key={index}
                    style={{ paddingLeft: `${(item.level - 1) * 8}px` }}
                    className="hover:text-cyber-cyan transition-colors"
                  >
                    <button 
                      onClick={() => scrollToHeading(item.id)}
                      className="text-left hover:underline w-full cursor-pointer"
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trending Articles */}
          {trendingPosts.length > 0 && (
            <div className="p-6 rounded-3xl border border-slate-855 bg-cyber-card-dark space-y-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5 pb-2.5 border-b border-slate-855">
                <Clock className="h-4 w-4 text-cyber-purple" /> Trending Publications
              </h3>
              <div className="space-y-4">
                {trendingPosts.map((post) => (
                  <div key={post._id} className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200 hover:text-cyber-cyan leading-snug">
                      <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{post.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Related Posts Bottom Section */}
      {relatedPosts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-slate-850/50">
          <h3 className="font-display text-xl font-bold text-white">Related Publications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <BlogCard key={related._id} blog={related} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default SingleBlog;
