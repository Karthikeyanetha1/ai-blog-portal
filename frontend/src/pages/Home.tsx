import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Cpu, Globe, Terminal, Cloud, BookOpen, Send, 
  ArrowRight, FileText, Star, Eye, Heart, 
  Award, Briefcase
} from 'lucide-react';
import API from '../services/api';
import BlogCard from '../components/BlogCard';
import type { BlogType } from '../components/BlogCard';
import { BlogCardSkeleton, ProjectCardSkeleton } from '../components/Skeleton';
import InteractiveNodes from '../components/InteractiveNodes';
import Typewriter from '../components/Typewriter';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

interface GitHubProfile {
  avatar_url: string;
  name: string;
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  bio: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  language: string;
  updated_at: string;
}

const categoryIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Artificial Intelligence': { icon: <Brain className="h-6 w-6" />, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  'Machine Learning': { icon: <Cpu className="h-6 w-6" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  'Web Development': { icon: <Globe className="h-6 w-6" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  'Programming': { icon: <Terminal className="h-6 w-6" />, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  'Cloud Computing': { icon: <Cloud className="h-6 w-6" />, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  'Career Guidance': { icon: <BookOpen className="h-6 w-6" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ value, duration = 1.2, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 30);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // GitHub States
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);

  useDocumentMetadata({
    title: 'Karthikeya Gurram | B.Tech AI & Machine Learning Student',
    description: 'Welcome to the personal portfolio of Karthikeya Gurram. Studying B.Tech in Artificial Intelligence & Machine Learning, building MERN stack projects, web scrapers, and exploring cloud infrastructures.',
    keywords: ['Karthikeya Gurram', 'B.Tech AI & ML', 'Student Portfolio', 'Full Stack Developer', 'karthikeyanetha7@gmail.com', 'MERN Stack Developer', 'Python Programmer'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Karthikeya Gurram',
      'jobTitle': 'B.Tech AI & Machine Learning Student',
      'email': 'karthikeyanetha7@gmail.com',
      'url': window.location.origin,
      'knowsAbout': ['Machine Learning', 'Artificial Intelligence', 'Full Stack Development', 'React.js', 'Node.js', 'MongoDB', 'Python']
    }
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const latestRes = await API.get('/blogs?limit=3');
        setBlogs(latestRes.data.blogs);

        const popularRes = await API.get('/blogs?sort=popular&limit=3');
        setFeaturedBlogs(popularRes.data.blogs);
      } catch (error) {
        console.error('Failed to load home page content:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGitHubData = async () => {
      try {
        const profileRes = await fetch('https://api.github.com/users/Karthikeyanetha1');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setGithubProfile(profileData);
        }
        const reposRes = await fetch('https://api.github.com/users/Karthikeyanetha1/repos?sort=updated&per_page=4');
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setGithubRepos(reposData);
        }
      } catch (err) {
        console.error('Failed to fetch GitHub stats:', err);
      } finally {
        setGithubLoading(false);
      }
    };

    fetchHomeData();
    fetchGitHubData();
  }, []);

  const handleNextFeatured = () => {
    if (featuredBlogs.length === 0) return;
    setCurrentFeatured((prev) => (prev + 1) % featuredBlogs.length);
  };

  const handlePrevFeatured = () => {
    if (featuredBlogs.length === 0) return;
    setCurrentFeatured((prev) => (prev - 1 + featuredBlogs.length) % featuredBlogs.length);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleDownloadCV = () => {
    alert('Resume download is simulated! Placeholder active.');
  };

  return (
    <div className="space-y-20 pb-20 transition-colors duration-300 bg-cyber-dark text-slate-100 relative overflow-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 md:pt-16 border-b border-slate-850/50">
        <InteractiveNodes />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/20 via-transparent to-cyber-dark pointer-events-none z-0" />
        
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 px-4.5 py-1.5 text-xs font-semibold text-cyber-cyan tracking-wider uppercase"
          >
            <Cpu className="h-4 w-4 text-cyber-cyan animate-pulse" />
            B.Tech AI & Machine Learning Student
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto"
          >
            Karthikeya Gurram <br />
            <span className="text-xl sm:text-3xl text-cyber-cyan block mt-3 font-semibold font-sans">
              <Typewriter words={['B.Tech AI & ML Student', 'Full Stack Developer', 'AI/ML Enthusiast']} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-3xl text-sm sm:text-base text-slate-400 leading-relaxed"
          >
            I build web applications, automation tools, and explore AI/ML technologies through practical projects and continuous learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-6"
          >
            <Link
              to="/projects"
              className="rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyber-cyan/15 hover:shadow-cyber-cyan/35 hover:brightness-110 transition-all duration-300"
              aria-label="Navigate to project showcase page"
            >
              View Projects
            </Link>
            <button
              onClick={handleDownloadCV}
              className="rounded-full border border-slate-800 bg-[#111827]/65 backdrop-blur px-8 py-3.5 text-xs font-bold text-white hover:bg-slate-850 hover:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              aria-label="Download student resume file"
            >
              <FileText className="h-4 w-4" /> Download Resume
            </button>
            <a
              href="https://github.com/Karthikeyanetha1"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-slate-800 bg-[#111827]/40 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
              title="GitHub Profile Link"
              aria-label="Link to user GitHub profile"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/karthikeya-gurram-59209726a/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-slate-800 bg-[#111827]/40 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
              title="LinkedIn Profile Link"
              aria-label="Link to user LinkedIn profile"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Featured Projects', val: 3, desc: 'Interview-ready systems' },
            { label: 'Specialization', isText: true, textVal: 'AI & ML', desc: 'Focus on datasets' },
            { label: 'Graduation Year', val: 2026, desc: 'Expected graduation' },
            { label: 'Tech Stack', isText: true, textVal: 'MERN & Python', desc: 'React, Node & Python' },
            { label: 'Education Stage', isText: true, textVal: 'B.Tech Student', desc: 'Years 2022 - 2026' }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-850 bg-cyber-card-dark flex flex-col justify-between space-y-2">
              <span className="text-2xl font-black text-cyber-cyan font-display">
                {stat.isText ? stat.textVal : <AnimatedCounter value={stat.val!} />}
              </span>
              <div>
                <div className="text-xs font-bold text-slate-200">{stat.label}</div>
                <div className="text-[10px] text-slate-500">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RECRUITER SEEKING & COURSEWORK SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Seeking Opportunities */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Award className="h-5.5 w-5.5 text-cyber-cyan" /> Seeking Opportunities
            </h2>
            <p className="text-xs text-slate-400">
              I am actively preparing for professional entries and look forward to contributing as an developer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Software Engineering Internships',
                'AI/ML Internships',
                'Full Stack Developer Roles',
                'Graduate Software Engineer Positions'
              ].map((role, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-850 bg-[#0B0F19] text-xs font-bold text-slate-200 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyber-cyan shrink-0" />
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Coursework */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5.5 w-5.5 text-cyber-purple" /> Relevant Coursework
            </h2>
            <p className="text-xs text-slate-400">
              Core academic syllabus completed under my B.Tech curriculum:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Data Structures & Algorithms',
                'Database Management Systems',
                'Operating Systems',
                'Computer Networks',
                'Software Engineering',
                'Machine Learning',
                'Artificial Intelligence'
              ].map((course, idx) => (
                <span key={idx} className="text-xs px-3.5 py-1.5 rounded-full border border-slate-800 bg-[#0B0F19] text-slate-300 font-semibold">
                  {course}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. CURRENTLY BUILDING & ROADMAP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Currently Building */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5.5 w-5.5 text-cyber-purple" /> Currently Building
            </h2>
            <p className="text-xs text-slate-400">
              Active engineering pipelines and sandboxes under development:
            </p>
            <div className="space-y-3">
              {[
                { title: 'Personal Portfolio & Blog Platform', desc: 'Secure full-stack MERN portal with local json backups.' },
                { title: 'Invoice Management & Analysis System', desc: 'MERN layout for file storage, metadata mapping, and basic totals summaries.' },
                { title: 'AWS Learning Projects', desc: 'Deploying basic static sites and configuring simple API server instances.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3.5 rounded-xl border border-slate-850 bg-[#0B0F19]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyber-purple/15 text-cyber-purple text-[10px] font-bold border border-cyber-purple/30 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{item.title}</h3>
                    <p className="text-[10px] text-slate-450 pt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Features (Roadmap) */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Cpu className="h-5.5 w-5.5 text-cyber-cyan" /> Upcoming Features
            </h2>
            <p className="text-xs text-slate-400">
              Technical features planned for integration after learning validations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'OCR Invoice Processing', desc: 'Extract plain text from image uploads.' },
                { title: 'AI Categorization', desc: 'Sort vendor categories using heuristics.' },
                { title: 'LLM Integrations', desc: 'Query summaries using model APIs.' },
                { title: 'Cloud Deployment', desc: 'AWS server automation configurations.' }
              ].map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-850 bg-[#0B0F19] relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1.5 pb-1">
                      <h3 className="text-xs font-bold text-slate-200">{feat.title}</h3>
                      <span className="text-[8px] px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35 uppercase font-bold tracking-wide shrink-0">
                        Roadmap
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-normal">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. LEARNING JOURNEY & TECH GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Learning Journey */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Brain className="h-5.5 w-5.5 text-cyber-cyan" /> Learning Journey
            </h2>
            <p className="text-xs text-slate-400">
              Areas of engineering I explore outside core university syllabus:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'AWS Cloud Fundamentals', desc: 'EC2, S3 bucket storage & hosting basics' },
                { name: 'Docker Basics', desc: 'Containerizing Node.js applications' },
                { name: 'System Design Foundations', desc: 'Understanding client-server load structures' },
                { name: 'MLOps Exploration', desc: 'Exploring simple dataset pipelines' }
              ].map((learn, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-850 bg-[#0B0F19] text-left">
                  <h3 className="text-xs font-bold text-slate-200">{learn.name}</h3>
                  <p className="text-[9px] text-slate-500 pt-0.5 leading-normal">{learn.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech I Enjoy Working With */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Terminal className="h-5.5 w-5.5 text-cyber-purple" /> Tech I Enjoy Working With
            </h2>
            <p className="text-xs text-slate-400">
              Frameworks and languages I am comfortable with for building systems:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'React', desc: 'Frontend UI component logic' },
                { name: 'Node.js', desc: 'API backend runtimes' },
                { name: 'MongoDB', desc: 'NoSQL analytical tables' },
                { name: 'Python', desc: 'Scripts & data processing' },
                { name: 'Express.js', desc: 'REST endpoint routing' },
                { name: 'AWS', desc: 'Hosting infrastructure basics' }
              ].map((tech, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-850 bg-[#0B0F19] text-center flex flex-col justify-center items-center">
                  <span className="text-xs font-bold text-slate-200">{tech.name}</span>
                  <span className="text-[9px] text-slate-500 pt-0.5">{tech.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. GITHUB REPOSITORY SYNC */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-extrabold text-white">GitHub Codebase Sync</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Live repository nodes synced from GitHub profile.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: GitHub Profile Info */}
          <div className="lg:col-span-4 p-6 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
            <div className="flex items-center gap-4">
              <img 
                src={githubProfile ? githubProfile.avatar_url : 'https://avatars.githubusercontent.com/u/120286395?v=4'} 
                alt="Karthikeya Gurram Avatar" 
                className="h-14 w-14 rounded-2xl border border-cyber-cyan/40 bg-slate-900 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=Karthikeya`;
                }}
              />
              <div>
                <h3 className="font-display text-sm font-bold text-white">
                  {githubProfile ? githubProfile.name : 'Karthikeya Gurram'}
                </h3>
                <span className="text-xs text-cyber-cyan">@{githubProfile ? githubProfile.login : 'karthikeya1'}</span>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                  {githubProfile ? githubProfile.bio : 'B.Tech AI & ML Student | Full Stack Developer'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-3 border-y border-slate-850/50">
              <div>
                <div className="font-black text-white">{githubProfile ? githubProfile.public_repos : 3}</div>
                <div className="text-[8px] text-slate-500 uppercase font-bold tracking-wider pt-0.5">Repositories</div>
              </div>
              <div>
                <div className="font-black text-white">{githubProfile ? githubProfile.followers : 10}</div>
                <div className="text-[8px] text-slate-500 uppercase font-bold tracking-wider pt-0.5">Followers</div>
              </div>
              <div>
                <div className="font-black text-white">{githubProfile ? githubProfile.following : 12}</div>
                <div className="text-[8px] text-slate-500 uppercase font-bold tracking-wider pt-0.5">Following</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Sync Target URL</span>
              <a 
                href={githubProfile ? githubProfile.html_url : 'https://github.com/Karthikeyanetha1'}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-bold py-2.5 rounded-xl border border-slate-800 bg-[#0B0F19] text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
              >
                github.com/Karthikeyanetha1
              </a>
            </div>
          </div>

          {/* Right: Repository Grid */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Featured Repository Nodes</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {githubLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <ProjectCardSkeleton key={idx} />
                ))
              ) : githubRepos.length > 0 ? (
                githubRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl border border-slate-850 bg-cyber-card-dark hover:border-cyber-cyan/35 hover:shadow-lg hover:shadow-cyber-cyan/5 transition-all flex flex-col justify-between h-36"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-100 hover:text-cyber-cyan transition-colors">
                        <span className="truncate max-w-[150px]">{repo.name}</span>
                        <Star className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {repo.description || 'No description provided for this project repository.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-850/50">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-cyber-cyan" />
                        {repo.language || 'Code'}
                      </span>
                      <span className="text-[9px]">
                        Updated: {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                // Fallbacks to actual projects matching Karthikeya's list
                [
                  { name: 'InvoiceAI', desc: 'MERN stack backend and frontend dashboard for uploading invoices, managing folders, and analytics.', lang: 'JavaScript', date: '6/14/2026' },
                  { name: 'cricket-frontend', desc: 'Time slot calendar scheduler with secure JWT login and ground booking dashboard structures.', lang: 'JavaScript', date: '6/13/2026' },
                  { name: 'data-analysis-web-scraping', desc: 'Python scraping pipeline using BeautifulSoup and Selenium proxy rotations to download ecommerce catalog data.', lang: 'Python', date: '6/12/2026' },
                  { name: 'personal-portfolio', desc: 'Print-friendly resume showcase and MERN seed blog platform configured for recruiter readiness.', lang: 'TypeScript', date: '6/16/2026' }
                ].map((repo) => (
                  <a
                    key={repo.name}
                    href={`https://github.com/Karthikeyanetha1/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl border border-slate-850 bg-cyber-card-dark hover:border-cyber-cyan/35 hover:shadow-lg hover:shadow-cyber-cyan/5 transition-all flex flex-col justify-between h-36"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-100">
                        <span className="truncate max-w-[150px]">{repo.name}</span>
                        <Star className="h-3.5 w-3.5 text-yellow-500" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {repo.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-850/50">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-cyber-cyan" />
                        {repo.lang}
                      </span>
                      <span className="text-[9px]">
                        Updated: {repo.date}
                      </span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 7. FEATURED CAROUSEL SECTION */}
      {featuredBlogs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-100">Featured Publications</h2>
              <p className="text-sm text-slate-500">Most discussed and viewed publications</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevFeatured}
                className="p-2 rounded-full border border-slate-800 hover:bg-slate-850 text-slate-300 transition-colors"
                aria-label="Previous Featured Blog"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <button
                onClick={handleNextFeatured}
                className="p-2 rounded-full border border-slate-800 hover:bg-slate-850 text-slate-300 transition-colors"
                aria-label="Next Featured Blog"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-850 bg-cyber-card-dark/40 p-4 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeatured}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 overflow-hidden rounded-2xl aspect-video relative">
                  <img
                    src={`http://localhost:5000${featuredBlogs[currentFeatured].featuredImage}`}
                    alt={featuredBlogs[currentFeatured].title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600';
                    }}
                  />
                  <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-cyber-dark/80 backdrop-blur-md text-cyber-cyan border border-cyber-cyan/35">
                    {featuredBlogs[currentFeatured].category}
                  </span>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white hover:text-cyber-cyan transition-colors font-sans">
                    <Link to={`/blogs/${featuredBlogs[currentFeatured].slug}`}>
                      {featuredBlogs[currentFeatured].title}
                    </Link>
                  </h3>
                  
                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {featuredBlogs[currentFeatured].content.replace(/[#*`]/g, '').slice(0, 180)}...
                  </p>

                  <div className="flex items-center justify-between pt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyber-cyan/15 text-cyber-cyan font-bold">
                        {featuredBlogs[currentFeatured].author?.name?.charAt(0).toUpperCase() || 'K'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{featuredBlogs[currentFeatured].author?.name || 'Karthikeya Gurram'}</div>
                        <div className="text-[10px] text-slate-500">{new Date(featuredBlogs[currentFeatured].publishedDate).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {featuredBlogs[currentFeatured].views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {featuredBlogs[currentFeatured].likes.length}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/blogs/${featuredBlogs[currentFeatured].slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-cyber-cyan hover:text-white transition-all duration-300"
                      aria-label="Read full text of featured publication"
                    >
                      Read Featured Post
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* 8. POPULAR CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="font-display text-2xl font-bold text-white">Explore Categories</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">Dive into specific technical disciplines and tutorials</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(categoryIcons).map(([catName, data]) => (
            <Link
              key={catName}
              to={`/blogs?category=${encodeURIComponent(catName)}`}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group
                bg-cyber-card-dark border-slate-850 hover:border-slate-700"
              aria-label={`Explore blogs in the ${catName} category`}
            >
              <div className={`p-4 rounded-full mb-3 transition-transform group-hover:scale-110 ${data.bg} ${data.color}`}>
                {data.icon}
              </div>
              <span className="font-display font-bold text-xs text-center text-slate-300 group-hover:text-cyber-cyan transition-colors">
                {catName}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. LATEST BLOG POSTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Latest Technical Articles</h2>
            <p className="text-sm text-slate-500">Freshly published insights and design guides</p>
          </div>
          <Link
            to="/blogs"
            className="flex items-center gap-1 text-sm font-bold text-cyber-cyan hover:underline"
            aria-label="View all technical articles"
          >
            All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-850">
            <p className="text-slate-500">No blog posts found. Seed the database to display content!</p>
          </div>
        )}
      </section>

      {/* 10. NEWSLETTER SUBSCRIPTION */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-slate-850 bg-gradient-to-r from-cyber-card-dark to-cyber-dark p-8 md:p-12 text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyber-cyan/10 via-transparent to-transparent opacity-80" />
          
          <div className="relative z-10 space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Stay Ahead of the Tech Curve
            </h2>
            <p className="mx-auto max-w-md text-sm text-slate-400">
              Receive updates on newly released algorithms, architecture guides, and coding best practices directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mx-auto max-w-md flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full px-5 py-3 text-sm border border-slate-800 bg-[#0B0F19] text-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50"
                aria-label="Email address for newsletter subscription"
              />
              <button
                type="submit"
                className="rounded-full bg-white text-black hover:bg-slate-100 px-6 py-3 font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-105 transition-all cursor-pointer"
                aria-label="Subscribe to newsletter button"
              >
                Subscribe
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <AnimatePresence>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-cyber-cyan font-semibold"
                >
                  🎉 Thank you! You have successfully subscribed to newsletter.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
