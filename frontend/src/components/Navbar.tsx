import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 transition-colors duration-300 border-b border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-cyber-dark/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wider text-slate-900 dark:text-white" aria-label="Karthikeya Gurram Portfolio Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0b0f19] text-xs font-black text-white">
                  GK
                </div>
              </div>
              <span className="text-sm font-semibold tracking-wide">
                Karthikeya Gurram
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-1 py-2 text-sm font-medium transition-colors hover:text-cyber-cyan ${
                  isActive(link.path)
                    ? 'text-cyber-cyan'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-cyber-cyan"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Admin Dashboard link */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-cyber-purple/30 bg-cyber-purple/10 text-cyber-purple hover:bg-cyber-purple/20 transition-all ${
                  isActive('/admin') ? 'ring-2 ring-cyber-purple' : ''
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            )}



            {/* Profile Dropdown / Login */}
            {user ? (
              <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="flex items-center gap-2">
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:5000${user.profileImage}`}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-cyber-cyan"
                      onError={(e) => {
                        // Fallback in case of broken image URL
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`;
                      }}
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyber-cyan/15 hover:shadow-cyber-cyan/35 hover:brightness-110 transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-dark px-4 pt-2 pb-4 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-cyber-cyan/10 text-cyber-cyan'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/admin')
                    ? 'bg-cyber-purple/10 text-cyber-purple'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 space-y-2">
                <div className="flex items-center gap-3 px-3">
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:5000${user.profileImage}`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-cyber-cyan"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-slate-850 dark:text-white">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-4 py-2.5 text-base font-semibold text-white shadow-md shadow-cyber-cyan/10"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
