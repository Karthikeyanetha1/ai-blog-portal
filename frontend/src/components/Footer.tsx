import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);



const Footer: React.FC = () => {
  return (
    <footer className="transition-colors duration-300 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-cyber-dark text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
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
            <p className="text-sm">
              Personal portfolio of Karthikeya Gurram, specializing in Full Stack Web Development and AI/ML technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-cyber-cyan transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-cyber-cyan transition-colors">All Blogs</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyber-cyan transition-colors">About Karthikeya Gurram</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Core Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blogs?category=Artificial Intelligence" className="hover:text-cyber-cyan transition-colors">AI</Link>
              </li>
              <li>
                <Link to="/blogs?category=Machine Learning" className="hover:text-cyber-cyan transition-colors">Machine Learning</Link>
              </li>
              <li>
                <Link to="/blogs?category=Web Development" className="hover:text-cyber-cyan transition-colors">Web Dev</Link>
              </li>
              <li>
                <Link to="/blogs?category=Cloud Computing" className="hover:text-cyber-cyan transition-colors">Cloud Computing</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/karthikeya-gurram-59209726a/" target="_blank" rel="noopener noreferrer" className="hover:text-cyber-cyan transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="https://github.com/Karthikeyanetha1" target="_blank" rel="noopener noreferrer" className="hover:text-cyber-cyan transition-colors">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="mailto:karthikeyanetha7@gmail.com" className="hover:text-cyber-cyan transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs">
              Developed by Karthikeya Gurram
            </p>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <p>© {new Date().getFullYear()} Karthikeya Gurram. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
