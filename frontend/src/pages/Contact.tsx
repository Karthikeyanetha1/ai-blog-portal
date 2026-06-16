import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, FileText, CheckCircle } from 'lucide-react';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

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

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useDocumentMetadata({
    title: 'Contact - Get In Touch',
    description: 'Get in touch with Karthikeya Gurram for project requests, collaborations, or professional roles. Located in Telangana, India.',
    keywords: ['Contact Karthikeya Gurram', 'karthikeyanetha7@gmail.com', 'AI ML Engineer Email', 'Full Stack Developer India'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact Karthikeya Gurram',
      'description': 'Contact page to send messages or request consultations from Karthikeya Gurram.',
      'mainEntity': {
        '@type': 'Person',
        'name': 'Karthikeya Gurram',
        'email': 'karthikeyanetha7@gmail.com',
        'jobTitle': 'B.Tech AI & Machine Learning Student',
        'location': {
          '@type': 'Place',
          'name': 'Telangana, India'
        }
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12 transition-colors duration-300 dark:bg-cyber-dark pb-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 px-4 py-1.5 text-xs font-semibold text-cyber-cyan tracking-wider uppercase"
        >
          <Mail className="h-3.5 w-3.5" />
          Get In Touch
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl font-extrabold text-slate-900 dark:text-white"
        >
          Let's Build Something Great
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          Have a project request, feedback, or collaboration proposal? Drop a line and let's align.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Info & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Glass Card Info */}
          <div className="rounded-3xl border border-slate-200 bg-white/40 backdrop-blur-md p-6 sm:p-8 space-y-6 dark:border-slate-800 dark:bg-cyber-card-dark/40 shadow-sm">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
            
            <div className="space-y-4 text-xs font-medium text-slate-650 dark:text-slate-350">
              {/* Email */}
              <a href="mailto:karthikeyanetha7@gmail.com" className="flex items-center gap-3 hover:text-cyber-cyan transition-colors">
                <div className="p-3 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/25">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Email Address</div>
                  <div className="text-xs">karthikeyanetha7@gmail.com</div>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/25">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Location</div>
                  <div className="text-xs">Telangana, India</div>
                </div>
              </div>
            </div>

            {/* Resume button */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Resume download is simulated! Placeholder active.'); }}
                className="w-full rounded-full bg-slate-950 dark:bg-white text-white dark:text-black hover:bg-cyber-cyan dark:hover:bg-cyber-cyan dark:hover:text-white py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <FileText className="h-4 w-4" />
                Download CV / Resume
              </a>
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white/40 backdrop-blur-md p-6 dark:border-slate-800 dark:bg-cyber-card-dark/40 shadow-sm flex items-center justify-around">
            <a
              href="https://github.com/Karthikeyanetha1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-cyber-cyan transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
              GitHub
            </a>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <a
              href="https://www.linkedin.com/in/karthikeya-gurram-59209726a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-cyber-cyan transition-colors"
            >
              <LinkedinIcon className="h-5 w-5" />
              LinkedIn
            </a>
          </div>

        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white/40 backdrop-blur-md p-6 sm:p-8 space-y-4 dark:border-slate-800 dark:bg-cyber-card-dark/40 shadow-sm text-xs font-bold"
          >
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Send Message</h2>
            
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-semibold flex items-center gap-2"
              >
                <CheckCircle className="h-4.5 w-4.5" />
                <span>Thank you! Your message has been sent successfully.</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-slate-600 dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                    dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-slate-600 dark:text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                    dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-slate-600 dark:text-slate-400">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Collaboration Request"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                  dark:border-slate-800 dark:bg-cyber-dark dark:text-white"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="text-slate-600 dark:text-slate-400">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let's build a project together..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50
                  dark:border-slate-800 dark:bg-cyber-dark dark:text-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:brightness-105 px-6 py-3 font-semibold text-white shadow flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer text-xs"
              >
                {sending ? 'Sending...' : 'Send Message'}
                <Send className="h-4 w-4" />
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Contact;
