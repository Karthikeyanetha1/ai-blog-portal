import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, FileText, MessageSquare, Heart, Eye, Plus, Edit3, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { Table, Tag, Button, Popconfirm, message } from 'antd';
import API from '../services/api';
import { DashboardStatsSkeleton } from '../components/Skeleton';

interface AnalyticsType {
  counters: {
    totalBlogs: number;
    totalUsers: number;
    totalComments: number;
    totalViews: number;
    totalLikes: number;
  };
  categoryData: Array<{ category: string; count: number; views: number }>;
  latestBlogs: Array<{ _id: string; title: string; slug: string; views: number; createdAt: string }>;
  latestComments: Array<{ _id: string; comment: string; user: { name: string }; blog: { title: string; slug: string }; createdAt: string }>;
  topBlogs: Array<{ _id: string; title: string; slug: string; views: number; category: string }>;
}

interface BlogManageItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  views: number;
  likes: string[];
  publishedDate: string;
}

interface CommentManageItem {
  _id: string;
  comment: string;
  createdAt: string;
  user: { name: string; email: string };
  blog: { title: string; slug: string };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState<'analytics' | 'blogs' | 'comments' | 'users'>('analytics');
  const [loading, setLoading] = useState(true);

  // States
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [blogsList, setBlogsList] = useState<BlogManageItem[]>([]);
  const [commentsList, setCommentsList] = useState<CommentManageItem[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editBlogId, setEditBlogId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const analyticsRes = await API.get('/admin/analytics');
      setAnalytics(analyticsRes.data);

      const blogsRes = await API.get('/blogs?limit=100'); // Fetch all blogs for list
      setBlogsList(blogsRes.data.blogs);

      const commentsRes = await API.get('/admin/comments');
      setCommentsList(commentsRes.data);

      const usersRes = await API.get('/admin/users');
      setUsersList(usersRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string) => {
    try {
      await API.put(`/admin/users/${userId}/role`);
      message.success('User role updated successfully');
      fetchDashboardData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to toggle user role');
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      await API.delete(`/admin/users/${userId}`);
      message.success('User deleted successfully');
      fetchDashboardData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setEditBlogId(null);
    setTitle('');
    setContent('');
    setCategory('Artificial Intelligence');
    setTags('');
    setFeaturedImage(null);
    setImagePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (blogId: string) => {
    setModalMode('edit');
    setEditBlogId(blogId);
    setFormError(null);
    
    try {
      const { data } = await API.get(`/blogs?limit=100`);
      const target = data.blogs.find((b: any) => b._id === blogId);
      if (target) {
        setTitle(target.title);
        setContent(target.content);
        setCategory(target.category);
        setTags(target.tags.join(', '));
        setFeaturedImage(null);
        setImagePreview(`http://localhost:5000${target.featuredImage}`);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch blog for editing:', err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags);
    if (featuredImage) {
      formData.append('featuredImage', featuredImage);
    }

    try {
      if (modalMode === 'create') {
        if (!featuredImage) {
          setFormError('Please select a featured image.');
          setSubmitting(false);
          return;
        }
        await API.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await API.put(`/blogs/${editBlogId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setIsModalOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to submit form.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlogDelete = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await API.delete(`/blogs/${blogId}`);
        fetchDashboardData();
      } catch (err) {
        console.error('Error deleting blog:', err);
      }
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await API.delete(`/comments/${commentId}`);
        fetchDashboardData();
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  if (loading && !analytics) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <DashboardStatsSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 transition-colors duration-300 dark:bg-cyber-dark">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Global analytics oversight and database CRUD settings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-5 py-2.5 text-xs font-bold text-white shadow flex items-center gap-1.5 hover:brightness-105 transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          Create Publication
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(['analytics', 'blogs', 'comments', 'users'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-bold capitalize transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? 'border-cyber-cyan text-cyber-cyan'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'blogs' ? 'publications' : tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {/* 1. ANALYTICS PANEL */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            {/* Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Views', count: analytics.counters.totalViews, icon: <Eye className="h-5 w-5 text-cyan-400" /> },
                { label: 'Total Publications', count: analytics.counters.totalBlogs, icon: <FileText className="h-5 w-5 text-violet-400" /> },
                { label: 'Total Likes', count: analytics.counters.totalLikes, icon: <Heart className="h-5 w-5 text-rose-400" /> },
                { label: 'Total Comments', count: analytics.counters.totalComments, icon: <MessageSquare className="h-5 w-5 text-emerald-400" /> },
              ].map((card, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{card.label}</span>
                    <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-1">{card.count}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-slate-50 dark:bg-cyber-dark border border-slate-100 dark:border-slate-800">
                    {card.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category distributions */}
              <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-cyber-cyan" /> Category Publications Matrix
                </h3>
                <div className="space-y-3 pt-2">
                  {analytics.categoryData.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{cat.category}</span>
                        <span className="text-slate-500">{cat.count} posts ({cat.views} views)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                          style={{ width: `${Math.min((cat.count / Math.max(...analytics.categoryData.map(c => c.count))) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {analytics.categoryData.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-4">No category stats available.</p>
                  )}
                </div>
              </div>

              {/* Popular articles */}
              <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Eye className="h-4.5 w-4.5 text-cyber-cyan" /> Top Viewed Articles
                </h3>
                <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-850">
                  {analytics.topBlogs.map((b) => (
                    <div key={b._id} className="flex items-center justify-between pt-3 first:pt-0">
                      <div>
                        <Link to={`/blogs/${b.slug}`} className="text-xs font-bold text-slate-900 dark:text-white hover:text-cyber-cyan transition-colors line-clamp-1">{b.title}</Link>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase font-semibold">{b.category}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 shrink-0">{b.views} views</span>
                    </div>
                  ))}
                  {analytics.topBlogs.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-4">No records found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANAGE BLOGS PANEL */}
        {activeTab === 'blogs' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-dark/30 font-bold text-slate-500 uppercase tracking-wide">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {blogsList.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <Link to={`/blogs/${blog.slug}`} className="hover:text-cyber-cyan line-clamp-1">{blog.title}</Link>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-dark/40 font-semibold text-[10px]">
                        {blog.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(blog.publishedDate).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold text-slate-650 dark:text-slate-350">{blog.views}</td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(blog._id)}
                        className="p-1.5 rounded-full hover:bg-cyan-500/10 text-cyan-400"
                        title="Edit Post"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleBlogDelete(blog._id)}
                        className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500"
                        title="Delete Post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {blogsList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No blog posts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. MANAGE COMMENTS PANEL */}
        {activeTab === 'comments' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-dark/30 font-bold text-slate-500 uppercase tracking-wide">
                  <th className="p-4">User</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Blog Article</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {commentsList.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{c.user?.name || 'Deleted User'}</div>
                      <div className="text-[10px] text-slate-500">{c.user?.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-slate-650 dark:text-slate-350 max-w-[200px] truncate">{c.comment}</td>
                    <td className="p-4 font-semibold">
                      {c.blog ? (
                        <Link to={`/blogs/${c.blog.slug}`} className="hover:text-cyber-cyan line-clamp-1">{c.blog.title}</Link>
                      ) : (
                        <span className="text-slate-400 italic">Deleted Article</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleCommentDelete(c._id)}
                        className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {commentsList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No comments found globally.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. MANAGE USERS PANEL */}
        {activeTab === 'users' && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark p-4 overflow-x-auto">
            <Table
              dataSource={usersList}
              rowKey="_id"
              pagination={{ pageSize: 8 }}
              scroll={{ x: 'max-content' }}
              className="dark:bg-cyber-card-dark"
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text: string, record: any) => (
                    <div className="flex items-center gap-2">
                      {record.profileImage ? (
                        <img
                          src={`http://localhost:5000${record.profileImage}`}
                          className="h-6 w-6 rounded-full object-cover border border-slate-350 dark:border-slate-850"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${record.name}`; }}
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/35 text-cyber-cyan flex items-center justify-center font-bold text-[9px]">
                          {record.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-slate-800 dark:text-slate-100">{text}</span>
                    </div>
                  )
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email',
                  render: (text: string) => <span className="text-slate-600 dark:text-slate-350">{text}</span>
                },
                {
                  title: 'Role',
                  dataIndex: 'role',
                  key: 'role',
                  render: (text: string) => (
                    <Tag color={text === 'admin' ? 'purple' : 'cyan'} className="uppercase font-bold text-[9px] tracking-wide">
                      {text}
                    </Tag>
                  )
                },
                {
                  title: 'Joined Date',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  render: (text: string) => <span className="text-slate-500">{new Date(text).toLocaleDateString()}</span>
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  align: 'center' as const,
                  render: (_: any, record: any) => {
                    const isSelf = record._id === user?._id;
                    return (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          type="link"
                          size="small"
                          disabled={isSelf}
                          className="text-cyan-400 disabled:opacity-40 hover:bg-cyan-500/10 font-semibold text-[11px]"
                          onClick={() => handleRoleToggle(record._id)}
                        >
                          Toggle Role
                        </Button>
                        <Popconfirm
                          title="Delete User"
                          description="Are you sure you want to delete this user? This action is permanent."
                          disabled={isSelf}
                          onConfirm={() => handleUserDelete(record._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            type="link"
                            size="small"
                            danger
                            disabled={isSelf}
                            className="disabled:opacity-40 hover:bg-red-500/10 font-semibold text-[11px]"
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    );
                  }
                }
              ]}
            />
          </div>
        )}
      </div>

      {/* CRUD POST MODAL FORM */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark p-6 sm:p-8 space-y-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white capitalize">
                  {modalMode === 'create' ? 'Create Publication' : 'Edit Publication'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-350">Publication Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                      dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-350">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                        dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                    >
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Programming">Programming</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Career Guidance">Career Guidance</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-350">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. nlp, neuralnetworks, fullstack"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                        dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-350">Featured Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-cyber-dark/40 justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-28 aspect-video object-cover rounded-lg border border-slate-200 dark:border-slate-800" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-slate-400">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                    
                    <label className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-cyber-cyan dark:hover:bg-cyber-cyan dark:hover:text-white px-4 py-2 font-bold cursor-pointer transition-colors whitespace-nowrap">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Content body */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-350">Markdown / Content Body</label>
                  <textarea
                    required
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write article details using paragraphs and markdown prefixes like ## headers..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                      dark:border-slate-800 dark:bg-cyber-dark dark:text-white resize-none font-mono"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full border border-slate-200 px-6 py-2.5 font-bold text-slate-650 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-6 py-2.5 font-bold text-white shadow hover:brightness-105 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Publication'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
