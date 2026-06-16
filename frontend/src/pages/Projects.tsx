import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Code, Terminal, CheckCircle2, Database, Layers, Play, Info
} from 'lucide-react';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

// Real product screenshots
import invoiceDashboardImg from '../assets/invoice_dashboard.png';
import cricketDashboardImg from '../assets/cricket_dashboard.png';
import scraperDashboardImg from '../assets/scraper_dashboard.png';

interface ProjectType {
  id: number;
  title: string;
  shortTitle: string;
  category: string;
  status: 'Completed MVP' | 'Active Development' | 'Research Phase';
  techStack: string[];
  description: string;
  goal: string;
  problemStatement: string;
  architecture: string;
  challengesFaced: string;
  lessonsLearned: {
    challenges: string;
    learnings: string;
    improvements: string;
  };
  futureScope: string[];
  currentFeatures: string[];
  plannedFeatures: string[];
  github: string;
  demo: string;
  documentation: string;
  deploymentStatus: 'Completed MVP' | 'Active Development' | 'Deployment In Progress';
  gradient: string;
  screenshot: string;
  icon: React.ReactNode;
}

const projectsData: ProjectType[] = [
  {
    id: 1,
    title: 'Invoice Management & Analysis System',
    shortTitle: 'Invoice System',
    category: 'MERN Stack Web System',
    status: 'Completed MVP',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Multer'],
    description: 'A web system to upload, store, and categorize vendor invoices to track monthly operational expenses.',
    goal: 'Build a secure, local web system that lets users upload invoice files, store them on the backend filesystem, and manually organize expenses to analyze operational expenditures.',
    problemStatement: 'Small businesses and student projects waste time manually copy-pasting numbers from invoice image files into tracking spreadsheets. This project builds a file repository system as a baseline to explore invoice layout management.',
    architecture: 'A React.js frontend sends file payloads via multipart/form-data to an Express.js backend. Invoices are saved directly to uploads/, and their file paths and metadata are indexed inside a local database collection.',
    challengesFaced: 'Configuring Multer file filters to safely accept only PDF and image formats, and ensuring the React UI dynamically updates its expenditure graphs upon new file uploads.',
    lessonsLearned: {
      challenges: 'Setting up file size validation thresholds to prevent server memory crashes during bulk uploads.',
      learnings: 'Designing a structured folder-like mapping using document references in MongoDB.',
      improvements: 'Integrating an open-source OCR engine (like Tesseract.js) to automate metadata reading locally.'
    },
    futureScope: [
      'OCR Processing',
      'Automated Data Extraction',
      'AI-Powered Categorization',
      'Report Generation',
      'LLM-Based Insights'
    ],
    currentFeatures: [
      'Invoice Upload (PDF/Image file boundaries)',
      'Secure Folder-style Storage structures',
      'Monthly Expense Tracking grid',
      'Dashboard Analytics summary charts'
    ],
    plannedFeatures: [
      'OCR Document Processing (Roadmap)',
      'Automated Fields Data Extraction (Roadmap)',
      'AI-Powered Vendor Categorization (Roadmap)',
      'Automated PDF Report Generation (Roadmap)',
      'LLM-Based Financial Insights (Roadmap)'
    ],
    github: 'https://github.com/Karthikeyanetha1/InvoiceAI',
    demo: 'https://invoiceai-karthikeya.vercel.app',
    documentation: 'https://github.com/Karthikeyanetha1/InvoiceAI#readme',
    deploymentStatus: 'Completed MVP',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    screenshot: invoiceDashboardImg,
    icon: <Cpu className="h-6 w-6 text-rose-400" />
  },
  {
    id: 2,
    title: 'Box Cricket Booking System',
    shortTitle: 'Cricket Booking',
    category: 'Full Stack Booking Web Portal',
    status: 'Active Development',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    description: 'An online net court booking portal with real-time schedule checks and slot managers.',
    goal: 'Develop a MERN stack sports reservation platform where local players can browse ground schedules, verify open hours, and securely reserve time slots.',
    problemStatement: 'Cricket ground operators experience scheduling confusion, double bookings, and manual errors when registering slots over phone calls. Customers lack a live interface to see slot availability.',
    architecture: 'A React calendar scheduling view fetches booked slots from MongoDB. The Express backend verifies that requested time intervals do not overlap with existing confirmed records before creating database slots.',
    challengesFaced: 'Preventing slot race conditions where two users request the same open slot at the same time. Resolved by creating database constraint checks before slot insertion.',
    lessonsLearned: {
      challenges: 'Handling date-time conversion ranges accurately across different timezone requests from clients.',
      learnings: 'Building stateless JWT user session validation filters inside Node.js routers.',
      improvements: 'Integrating real payment gateways (such as Stripe Sandbox) and scheduling SMS slot reminders.'
    },
    futureScope: [
      'Payment Gateway Sandbox Integration',
      'SMS Slot Reminder systems',
      'Automated Court Lighting Control API'
    ],
    currentFeatures: [
      'Interactive real-time schedule grids with calendar sync',
      'JWT Authentication with customer profiles',
      'Slot availability checker API',
      'Customer dashboard with reservation history log'
    ],
    plannedFeatures: [
      'Stripe Sandbox Payment Integration (Roadmap)',
      'Twilio SMS Reminder webhooks (Roadmap)',
      'Automated lighting switch relay control (Roadmap)'
    ],
    github: 'https://github.com/Karthikeyanetha1/cricket-frontend',
    demo: 'https://cricket-booking-karthikeya.vercel.app',
    documentation: 'https://github.com/Karthikeyanetha1/cricket-frontend#readme',
    deploymentStatus: 'Active Development',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    screenshot: cricketDashboardImg,
    icon: <Code className="h-6 w-6 text-cyan-400" />
  },
  {
    id: 3,
    title: 'Web Scraping & Analytics Platform',
    shortTitle: 'Web Scraper',
    category: 'Python ETL Scripting Engine',
    status: 'Completed MVP',
    techStack: ['Python', 'BeautifulSoup4', 'Selenium', 'Pandas', 'Matplotlib'],
    description: 'An automated command-line Python crawling script parsing and charting product listings.',
    goal: 'Build an automated ETL data compilation pipeline to crawl competitor product catalogs and visualize pricing distributions locally.',
    problemStatement: 'Compiling product catalogs and pricing trends manually from massive e-commerce listings is extremely slow and tedious. This script gathers web listings into pandas dataframes for offline analysis.',
    architecture: 'A Python execution pipeline. Uses BeautifulSoup to rapidly parse static HTML pages, and spins up a Selenium headless browser node to handle dynamic single-page content, writing structured arrays to local CSV outputs.',
    challengesFaced: 'Avoiding scraping threshold blocklists. Calibrated the crawler with random sleep pauses and HTTP User-Agent rotations.',
    lessonsLearned: {
      challenges: 'Handling dynamic, asynchronous element loads where class names or tag layouts change dynamically.',
      learnings: 'Utilizing Selenium WebDriverWait filters to safely pause script steps until target tags are ready.',
      improvements: 'Deploying the scraping scripts inside a Docker container configured to run as scheduled cron tasks.'
    },
    futureScope: [
      'Distributed Headless Browser clusters',
      'Real-time price alert webhooks',
      'Dynamic predictive price forecasting charts'
    ],
    currentFeatures: [
      'Static HTML scraping with BeautifulSoup4',
      'Headless browser scraping with Selenium',
      'HTTP User-Agent rotation parameters',
      'ETL cleaning and charting using Pandas & Matplotlib'
    ],
    plannedFeatures: [
      'Distributed crawling node instances (Roadmap)',
      'Real-time price alert email webhooks (Roadmap)',
      'Predictive pricing trends forecasting charts (Roadmap)'
    ],
    github: 'https://github.com/Karthikeyanetha1/data-analysis-web-scraping',
    demo: 'https://scraper-analytics-karthikeya.vercel.app',
    documentation: 'https://github.com/Karthikeyanetha1/data-analysis-web-scraping#readme',
    deploymentStatus: 'Completed MVP',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    screenshot: scraperDashboardImg,
    icon: <Terminal className="h-6 w-6 text-violet-400" />
  }
];

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [activeDemoMock, setActiveDemoMock] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'screenshot' | 'sandbox'>('screenshot');

  useDocumentMetadata({
    title: 'Projects - Student Engineering Portfolio',
    description: 'Explore the student engineering projects built by Karthikeya Gurram: Invoice Management & Analysis System, Box Cricket Booking System, and e-commerce Web Scraper.',
    keywords: ['Karthikeya Gurram Projects', 'MERN stack projects', 'Python scrapers', 'Box cricket booking system', 'Invoice management system'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': projectsData.map((project, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': project.title,
        'description': project.description
      }))
    }
  });

  const handleTriggerDemo = (id: number) => {
    setActiveDemoMock(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. UI Concept Sandbox for Project 1
  const renderOCRVisual = () => (
    <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-4 text-xs font-mono space-y-3 relative overflow-hidden h-72 flex flex-col justify-between">
      <div className="flex justify-between items-center pb-2 border-b border-slate-850">
        <span className="text-cyber-cyan font-bold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyber-cyan animate-pulse" /> INVOICE_REPOSITORY_MVP
        </span>
        <span className="text-[10px] text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 px-2 py-0.5 rounded uppercase font-bold">Concept Preview</span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 py-2">
        <div className="border border-dashed border-slate-850 p-2.5 rounded-xl bg-slate-900/30 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 block uppercase">File Storage (uploads/)</span>
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 bg-slate-800 rounded" />
            <div className="h-2 w-5/6 bg-slate-800 rounded" />
            <div className="h-2 w-1/2 bg-slate-800 rounded" />
          </div>
          <div className="flex justify-between items-center text-[9px] text-cyber-cyan font-bold border-t border-slate-850 pt-1.5">
            <span>invoice_01.pdf</span>
            <span>Stored</span>
          </div>
        </div>

        <div className="border border-slate-850 p-2.5 rounded-xl bg-slate-900/50 space-y-2 overflow-y-auto">
          <span className="text-[9px] text-cyber-purple uppercase block font-bold">Metadata Indices</span>
          <div className="space-y-1 text-[9px]">
            <div className="flex justify-between text-slate-400">
              <span>File_Name:</span>
              <span className="text-slate-100 font-bold truncate max-w-[50px]">inv_01.pdf</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Folder:</span>
              <span className="text-slate-100 font-bold">Expenses</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Size:</span>
              <span className="text-cyber-cyan font-bold">142 KB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/25 rounded-lg text-[9px] text-yellow-500">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>Roadmap features (OCR / LLM extraction) are shown as visual placeholders.</span>
      </div>
    </div>
  );

  // 2. UI Concept Sandbox for Project 2
  const renderCalendarVisual = () => (
    <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-4 text-xs font-sans space-y-3 relative overflow-hidden h-72 flex flex-col justify-between">
      <div className="flex justify-between items-center pb-2 border-b border-slate-850">
        <span className="text-cyber-purple font-bold flex items-center gap-1.5">
          <Database className="h-4 w-4 text-cyber-purple" /> SLOT_SCHEDULER_CALENDAR
        </span>
        <span className="text-[10px] text-slate-400">June 16, 2026</span>
      </div>

      <div className="flex-grow grid grid-cols-3 gap-2 py-2">
        {[
          { time: '06:00 AM', status: 'Booked', color: 'border-slate-850 bg-slate-900/40 text-slate-500' },
          { time: '08:00 AM', status: 'Booked', color: 'border-slate-850 bg-slate-900/40 text-slate-500' },
          { time: '10:00 AM', status: 'Available', color: 'border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan font-bold hover:bg-cyber-cyan/10' },
          { time: '04:00 PM', status: 'Available', color: 'border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan font-bold hover:bg-cyber-cyan/10' },
          { time: '06:00 PM', status: 'Available', color: 'border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan font-bold hover:bg-cyber-cyan/10' },
          { time: '08:00 PM', status: 'Booked', color: 'border-slate-850 bg-slate-900/40 text-slate-500' }
        ].map((slot, idx) => (
          <div key={idx} className={`p-2 border rounded-xl flex flex-col justify-between text-center transition-all ${slot.color}`}>
            <span className="text-[10px] uppercase font-bold">{slot.time}</span>
            <span className="text-[9px] tracking-wider uppercase font-medium pt-1 opacity-85">{slot.status}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1.5 border-t border-slate-850">
        <span>Court Selection: Net A</span>
        <span className="font-bold text-cyber-purple">Subtotal: $40.00</span>
      </div>
    </div>
  );

  // 3. UI Concept Sandbox for Project 3
  const renderTerminalVisual = () => (
    <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-4 text-xs font-mono space-y-3 relative overflow-hidden h-72 flex flex-col justify-between">
      <div className="flex justify-between items-center pb-2 border-b border-slate-850">
        <span className="text-violet-400 font-bold flex items-center gap-1.5">
          <Terminal className="h-4 w-4 text-violet-400" /> headless_crawler.py
        </span>
        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
      </div>

      <div className="flex-grow p-3 bg-slate-900/50 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-350 space-y-1 overflow-y-auto">
        <p className="text-slate-500">[INFO] Spawning headless chromium instance...</p>
        <p className="text-slate-500">[INFO] Loading target search page index...</p>
        <p className="text-cyber-cyan">[SUCCESS] Tag parsed: extracted 42 items</p>
        <p className="text-emerald-400">[DATA] Appended rows to Pandas dataframe csv...</p>
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1.5 border-t border-slate-850">
        <span>Status: Process Completed</span>
        <span className="text-violet-400 font-bold">Speed: 45.2 req/sec</span>
      </div>
    </div>
  );

  const activeProject = projectsData.find(p => p.id === activeTab)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12 transition-colors duration-300 bg-cyber-dark pb-20 font-sans">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 px-4.5 py-1.5 text-xs font-semibold text-cyber-cyan tracking-wider uppercase"
        >
          <Layers className="h-3.5 w-3.5" />
          Technical Showcase
        </motion.div>
        
        <h1 className="font-display text-4xl font-extrabold text-white">
          Flagship Projects
        </h1>
        
        <p className="text-sm text-slate-400 leading-relaxed">
          Detailed reviews of my web applications, automation scripts, and database setups with clear, interview-safe boundaries.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex justify-center border-b border-slate-850 max-w-lg mx-auto">
        {projectsData.map((project) => (
          <button
            key={project.id}
            onClick={() => setActiveTab(project.id)}
            className={`flex-1 pb-4 text-xs font-bold transition-all relative border-b-2 ${
              activeTab === project.id 
                ? 'border-cyber-cyan text-cyber-cyan font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
            aria-label={`Select details for project: ${project.title}`}
          >
            <span className="hidden md:inline">{project.title}</span>
            <span className="inline md:hidden">{project.shortTitle}</span>
          </button>
        ))}
      </div>

      {/* Big Display Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
        
        {/* Left Column: Visual Mockup Showcase */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="p-1 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-850 shadow-2xl relative overflow-hidden">
            <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${activeProject.gradient} blur-3xl opacity-80 pointer-events-none`} />
            
            <div className="p-6 space-y-4 relative z-10">
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setViewMode('screenshot')}
                    className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      viewMode === 'screenshot'
                        ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan'
                        : 'border-slate-800 bg-[#0B0F19] text-slate-450 hover:text-slate-350'
                    }`}
                  >
                    Real Screenshot
                  </button>
                  <button
                    onClick={() => setViewMode('sandbox')}
                    className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      viewMode === 'sandbox'
                        ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan'
                        : 'border-slate-800 bg-[#0B0F19] text-slate-450 hover:text-slate-350'
                    }`}
                  >
                    Interactive Sandbox
                  </button>
                </div>
                {viewMode === 'sandbox' && (
                  <button
                    onClick={() => handleTriggerDemo(activeProject.id)}
                    className="flex items-center gap-1 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/35 text-cyber-cyan text-[9px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer"
                    aria-label="Simulate pipeline action"
                  >
                    <Play className="h-2.5 w-2.5 fill-current" /> Trigger Pipeline
                  </button>
                )}
              </div>

              {/* Renders the custom visual interface corresponding to selected tab & view mode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeProject.id}-${viewMode}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === 'screenshot' ? (
                    <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] overflow-hidden h-72 flex items-center justify-center relative group">
                      <img 
                        src={activeProject.screenshot} 
                        alt={`${activeProject.title} Screenshot`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-[10px] text-slate-350">Actual Screenshot of {activeProject.title}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {activeProject.id === 1 && renderOCRVisual()}
                      {activeProject.id === 2 && renderCalendarVisual()}
                      {activeProject.id === 3 && renderTerminalVisual()}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* simulated notification overlay */}
              {viewMode === 'sandbox' && activeDemoMock[activeProject.id] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center gap-2 text-emerald-400 text-[10px] font-bold"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Pipeline successfully triggered and executed locally. Check console logs!</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Architectural review & Details */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0B0F19] border border-slate-850">
                  {activeProject.icon}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{activeProject.category}</span>
                  <h2 className="font-display text-xl font-extrabold text-white">{activeProject.title}</h2>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider shrink-0 ${
                activeProject.status === 'Completed MVP' 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/35'
                  : 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/35'
              }`}>
                {activeProject.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              {activeProject.description}
            </p>

            {/* Deep dive sections */}
            <div className="space-y-3 pt-2 border-t border-slate-850/50">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Goal</span>
                <p className="text-xs text-slate-350 leading-relaxed font-light">{activeProject.goal}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Problem Statement</span>
                <p className="text-xs text-slate-350 leading-relaxed font-light">{activeProject.problemStatement}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Architecture Overview</span>
                <p className="text-xs text-slate-350 leading-relaxed font-light">{activeProject.architecture}</p>
              </div>
            </div>

            {/* Implemented vs Roadmap Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-850/50">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Features</span>
                <ul className="space-y-1">
                  {activeProject.currentFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan shrink-0 mt-1.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Planned Roadmap</span>
                <ul className="space-y-1">
                  {activeProject.plannedFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0 mt-1.5" />
                      <span className="flex items-center gap-1.5">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2 pt-2 border-t border-slate-850/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Technology Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-bold px-2.5 py-1 rounded bg-[#0B0F19] text-slate-300 border border-slate-850"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Lessons Learned Block */}
            <div className="p-4 rounded-2xl border border-slate-850 bg-[#0b0f19] space-y-2 pt-2 mt-4">
              <span className="text-[10px] font-bold text-cyber-cyan uppercase tracking-wider block">Lessons Learned</span>
              <div className="space-y-1.5 text-[11px] font-light">
                <div>
                  <strong className="text-slate-250 font-bold">Technical Challenges:</strong>{' '}
                  <span className="text-slate-400">{activeProject.lessonsLearned.challenges}</span>
                </div>
                <div>
                  <strong className="text-slate-250 font-bold">Key Learnings:</strong>{' '}
                  <span className="text-slate-400">{activeProject.lessonsLearned.learnings}</span>
                </div>
                <div>
                  <strong className="text-slate-250 font-bold">Future Improvements:</strong>{' '}
                  <span className="text-slate-400">{activeProject.lessonsLearned.improvements}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Evidence */}
          <div className="space-y-3 pt-4 border-t border-slate-850/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deployment Evidence</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-sans">GitHub:</span>
                <a 
                  href={activeProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyber-cyan hover:underline truncate max-w-[150px]"
                >
                  Source Code
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-sans">Documentation:</span>
                <a 
                  href={activeProject.documentation} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyber-cyan hover:underline truncate max-w-[150px]"
                >
                  README.md
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-sans">Live Demo:</span>
                {activeProject.demo && activeProject.demo.startsWith('http') ? (
                  <a 
                    href={activeProject.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyber-cyan hover:underline truncate max-w-[150px]"
                  >
                    Live Link
                  </a>
                ) : (
                  <span className="text-slate-450 italic">{activeProject.demo}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-sans">Deploy Status:</span>
                <span className="text-yellow-500 font-sans font-bold uppercase text-[9px] border border-yellow-500/20 bg-yellow-500/5 px-2 py-0.5 rounded">
                  {activeProject.deploymentStatus}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* What I Learned Building These Projects */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6 mt-8">
        <h2 className="font-display text-2xl font-bold text-white text-center md:text-left">
          What I Learned Building These Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Invoice Management System",
              gradient: "from-rose-500/10 to-pink-500/5 border-rose-500/20",
              bullets: [
                "Designing scalable MongoDB schemas",
                "Managing React state efficiently",
                "Building reusable dashboard components"
              ]
            },
            {
              title: "Box Cricket Booking",
              gradient: "from-cyan-500/10 to-blue-500/5 border-cyan-500/20",
              bullets: [
                "Preventing slot conflicts",
                "Authentication workflows",
                "API design patterns"
              ]
            },
            {
              title: "Web Scraping Platform",
              gradient: "from-violet-500/10 to-purple-500/5 border-violet-500/20",
              bullets: [
                "Data cleaning strategies",
                "Handling rate limits",
                "Automation pipelines"
              ]
            }
          ].map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border bg-gradient-to-br ${item.gradient} space-y-3`}>
              <h3 className="font-display font-bold text-sm text-white">{item.title}</h3>
              <ul className="space-y-2 text-xs text-slate-350">
                {item.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan shrink-0 mt-1.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Projects;
