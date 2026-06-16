import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

const NotFound: React.FC = () => {
  useDocumentMetadata({
    title: '404 - Page Not Found',
    description: 'The requested page was not found on Karthikeya Gurram\'s student engineering portfolio.',
    keywords: ['404 Page', 'Not Found', 'Karthikeya Gurram Portfolio']
  });

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 space-y-6 transition-colors duration-300 dark:bg-cyber-dark text-slate-100 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 animate-pulse"
      >
        <AlertTriangle className="h-12 w-12" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-wider">
          Node Not Found
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The requested coordinate endpoint (404) does not exist in our system records or has been removed.
        </p>
      </div>

      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-8 py-3 text-xs font-bold text-white shadow-lg shadow-cyber-cyan/15 hover:shadow-cyber-cyan/35 hover:brightness-110 transition-all duration-300"
          aria-label="Return back to the portfolio home page"
        >
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
