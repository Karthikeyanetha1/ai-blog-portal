import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpDown, RefreshCw } from 'lucide-react';
import API from '../services/api';
import BlogCard from '../components/BlogCard';
import type { BlogType } from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/Skeleton';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

const categories = [
  'All',
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Programming',
  'Cloud Computing',
  'Career Guidance',
];

const BlogListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination details
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  useDocumentMetadata({
    title: 'Publications - AI/ML & Engineering Insights',
    description: 'Read the latest tutorials, research summaries, and engineering guides on Artificial Intelligence, Machine Learning, Web Development, and Cloud Computing by Karthikeya Gurram.',
    keywords: ['AI Blog', 'Machine Learning Articles', 'Web Development Tutorials', 'Programming Guides', 'Karthikeya Gurram Blog'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'Karthikeya Gurram Publications',
      'description': 'Technical blog posts and guides detailing Machine Learning and Full Stack systems.',
      'publisher': {
        '@type': 'Person',
        'name': 'Karthikeya Gurram'
      }
    }
  });

  // Sync state from query parameters
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || 'All';
  const sortQuery = searchParams.get('sort') || 'latest';

  const [searchInput, setSearchInput] = useState(searchQuery);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `/blogs?page=${currentPage}&limit=6`;
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      if (categoryQuery && categoryQuery !== 'All') {
        url += `&category=${encodeURIComponent(categoryQuery)}`;
      }
      
      if (sortQuery) {
        url += `&sort=${sortQuery}`;
      }

      const { data } = await API.get(url);
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setTotalBlogs(data.totalBlogs);
    } catch (error) {
      console.error('Error fetching blogs listing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when parameters or current page change
  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, categoryQuery, sortQuery, currentPage]);

  // Reset page to 1 when filters modify
  const updateParams = (newParams: Record<string, string>) => {
    setCurrentPage(1);
    const updated = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === '' || val === 'All') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });

    setSearchParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const handleCategorySelect = (category: string) => {
    updateParams({ category });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ sort: e.target.value });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 transition-colors duration-300 dark:bg-cyber-dark">
      
      {/* Title */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Technical Publications</h1>
        <p className="text-sm text-slate-500">Discover and search articles, design strategies, and documentation logs</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-6 relative">
          <input
            type="text"
            placeholder="Search blogs by title or tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-full border border-slate-200 pl-5 pr-12 py-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
              dark:border-slate-800 dark:bg-cyber-card-dark dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-1.5 p-2 rounded-full bg-slate-950 dark:bg-cyber-dark hover:bg-cyber-cyan dark:hover:bg-cyber-cyan text-white transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Sorting option */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <ArrowUpDown className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <select
            value={sortQuery}
            onChange={handleSortChange}
            className="w-full rounded-full border border-slate-200 px-4 py-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
              dark:border-slate-800 dark:bg-cyber-card-dark dark:text-white"
          >
            <option value="latest">Latest Publish</option>
            <option value="popular">Popular (Views)</option>
            <option value="likes">Most Liked</option>
            <option value="oldest">Oldest Publish</option>
          </select>
        </div>

        {/* Reset filters button */}
        <div className="lg:col-span-3">
          {(searchQuery || categoryQuery !== 'All') && (
            <button
              onClick={clearFilters}
              className="w-full rounded-full border border-dashed border-red-500/30 hover:border-red-500 hover:bg-red-500/5 text-red-500 font-bold py-3 text-xs flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills list */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              categoryQuery === category
                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple border-transparent text-white shadow-md shadow-cyber-cyan/15'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 dark:bg-cyber-card-dark dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Total logs count */}
      <div className="text-xs font-semibold text-slate-500">
        Showing {blogs.length} of {totalBlogs} articles
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">No articles match your filters. Try search keywords or different category tags.</p>
        </div>
      )}

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold bg-white dark:bg-cyber-card-dark text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors ${
                  currentPage === pageNum
                    ? 'border-transparent bg-cyber-cyan text-white font-extrabold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark text-slate-750 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold bg-white dark:bg-cyber-card-dark text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default BlogListing;
