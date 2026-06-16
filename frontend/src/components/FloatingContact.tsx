import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, FileText, X } from 'lucide-react';

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

const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadCV = () => {
    alert('Resume download is simulated! Placeholder active.');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-64 overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]/90 backdrop-blur-md p-4 shadow-xl shadow-cyber-cyan/5 text-slate-100 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-850">
              <span className="text-xs font-bold uppercase tracking-wider text-cyber-cyan">Karthikeya Gurram</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400">
              Let's build intelligent systems together. Connect with me directly:
            </p>

            <div className="flex flex-col gap-2">
              <a
                href="mailto:karthikeyanetha7@gmail.com"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-850/50 hover:bg-cyber-cyan/10 hover:text-cyber-cyan border border-slate-800 transition-all text-xs font-semibold"
              >
                <Mail className="h-4 w-4" />
                karthikeyanetha7@gmail.com
              </a>

              <a
                href="https://github.com/Karthikeyanetha1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-850/50 hover:bg-cyber-purple/10 hover:text-cyber-purple border border-slate-800 transition-all text-xs font-semibold"
              >
                <GithubIcon className="h-4 w-4" />
                Karthikeyanetha1 (GitHub)
              </a>

              <a
                href="https://www.linkedin.com/in/karthikeya-gurram-59209726a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-850/50 hover:bg-cyber-cyan/10 hover:text-cyber-cyan border border-slate-800 transition-all text-xs font-semibold"
              >
                <LinkedinIcon className="h-4 w-4" />
                Karthikeya Gurram
              </a>

              <button
                onClick={handleDownloadCV}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white hover:brightness-110 shadow-lg shadow-cyber-cyan/10 transition-all text-xs font-bold cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                Download Resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-12 w-12 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-lg shadow-cyber-cyan/25 flex items-center justify-center cursor-pointer border border-cyber-cyan/30 focus:outline-none"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="h-5.5 w-5.5" /> : <MessageSquare className="h-5.5 w-5.5" />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingContact;
