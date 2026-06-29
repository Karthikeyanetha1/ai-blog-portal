import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Brain, Server, Code, ShieldCheck, FileText } from 'lucide-react';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

const About: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useDocumentMetadata({
    title: 'About - Karthikeya Gurram',
    description: 'Learn about Karthikeya Gurram, studying B.Tech in Artificial Intelligence & Machine Learning. View education background, resume preview, and technical skill summaries.',
    keywords: ['About Karthikeya Gurram', 'AI Student Profile', 'St. Mary\'s Engineering College', 'Python developer', 'MERN stack student'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About Karthikeya Gurram',
      'description': 'Information about Karthikeya Gurram\'s academic background, skills, and student developer profile.',
      'mainEntity': {
        '@type': 'Person',
        'name': 'Karthikeya Gurram',
        'email': 'karthikeyanetha7@gmail.com',
        'url': window.location.origin,
        'alumniOf': 'St. Mary\'s Engineering College'
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const skillCategories = [
    {
      title: 'AI / Machine Learning',
      icon: <Brain className="h-5 w-5 text-rose-400" />,
      skills: ['Python', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'OCR (Tesseract)', 'Prompt Engineering'],
    },
    {
      title: 'Frontend Development',
      icon: <Code className="h-5 w-5 text-cyan-400" />,
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML5', 'CSS3', 'Framer Motion'],
    },
    {
      title: 'Backend & Databases',
      icon: <Server className="h-5 w-5 text-violet-400" />,
      skills: ['Node.js', 'Express.js', 'MongoDB', 'RESTful APIs', 'Mongoose'],
    },
    {
      title: 'Developer Tools',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
      skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'AWS Basics'],
    },
  ];

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/karthikeya_gurram_resume.pdf';
    link.download = 'Karthikeya_Gurram_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-16 transition-colors duration-300 dark:bg-cyber-dark font-sans text-slate-100">
      
      {/* 1. STUDENT BIOGRAPHY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyber-purple/20 bg-cyber-purple/5 px-4 py-1 text-xs font-semibold text-cyber-purple tracking-wide uppercase"
          >
            Student Developer Profile
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Karthikeya Gurram
          </h1>

          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent font-sans">
            B.Tech AI & Machine Learning Student <br />
            <span className="text-sm font-semibold text-slate-400">Full Stack Developer | AI/ML Enthusiast</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
            Hi! I am Karthikeya Gurram, a final-year B.Tech student specializing in Artificial Intelligence and Machine Learning. I enjoy building web applications, designing automation scripts, and studying dataset architectures. My tech stack centers around Python, React, and Express/MongoDB. Through my projects, I bridge the gap between logical backend databases and clean frontend dashboards, ensuring all features are built on validated, demonstrable logic.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-350">
            <span className="flex items-center gap-1.5 font-bold">
              <MapPin className="h-4 w-4 text-cyber-cyan" /> Telangana, India
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <Mail className="h-4 w-4 text-cyber-cyan" /> karthikeyanetha7@gmail.com
            </span>
          </div>

          {/* Social Profiles */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/Karthikeyanetha1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-[#111827]/40 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyber-cyan hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/karthikeya-gurram-59209726a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-[#111827]/40 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyber-cyan hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Profile Avatar representational mock */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative p-2.5 rounded-3xl border border-slate-800 bg-cyber-card-dark aspect-square w-full max-w-[280px] overflow-hidden group shadow-lg">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=karthikeya"
              alt="Karthikeya Gurram Avatar"
              className="w-full h-full object-contain bg-[#0B0F19] rounded-2xl"
            />
            <div className="absolute inset-0 border border-cyber-cyan/0 group-hover:border-cyber-cyan/35 rounded-3xl transition-all duration-300 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. DEDICATED RESUME AREA */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">Dedicated Resume & Skills</h2>
          <p className="text-sm text-slate-400">View and download my student resume credentials</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleDownloadCV}
              className="rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple px-6 py-2.5 text-xs font-bold text-white shadow hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Download Resume (PDF)
            </button>
          </div>

          {/* Printable Style Digital Resume Preview Sheet */}
          <div className="p-6 sm:p-10 rounded-3xl border border-slate-800 bg-[#0c101d] text-slate-300 shadow-2xl relative overflow-hidden font-mono text-xs space-y-6">
            
            {/* Header section */}
            <div className="border-b border-slate-800 pb-6 text-center space-y-2">
              <h3 className="text-lg font-black text-white uppercase font-display tracking-wider">Karthikeya Gurram</h3>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-500 text-[10px] font-sans">
                <span>Telangana, India</span>
                <span>•</span>
                <span>karthikeyanetha7@gmail.com</span>
                <span>•</span>
                <span>github.com/Karthikeyanetha1</span>
                <span>•</span>
                <span>linkedin.com/in/karthikeya-gurram-59209726a/</span>
              </div>
            </div>

            {/* Resume Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-sans">
              
              {/* Left Column (8 cols): Education, Projects */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Education */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-black text-cyber-cyan border-b border-slate-850 pb-1 font-mono tracking-wider">Education</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-slate-200">
                      <span>B.Tech in Artificial Intelligence & Machine Learning</span>
                      <span className="text-slate-500 text-[11px] font-light">2022 - 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-light">
                      St. Mary's Engineering College. Commenced core studies in python scripts, algorithms, ML paradigms, and databases. Expected graduation: June 2026.
                    </p>
                  </div>
                </div>

                {/* Flagship Projects */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-black text-cyber-cyan border-b border-slate-850 pb-1 font-mono tracking-wider">Core Projects</h4>
                  
                  {/* Project 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-slate-200">
                      <span>Invoice Management & Analysis System</span>
                      <span className="text-slate-500 text-[11px] font-light">Completed MVP</span>
                    </div>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-light">
                      Built a web repository using React, Express, and Multer to upload invoice images, manage folder pathways, and query monthly expenditure analytics.
                    </p>
                  </div>

                  {/* Project 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-slate-200">
                      <span>Box Cricket Booking System</span>
                      <span className="text-slate-500 text-[11px] font-light">Active Development</span>
                    </div>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-light">
                      MERN stack portal allowing customers to check time slot calendar overlaps and confirm reservations, preventing race-condition double bookings.
                    </p>
                  </div>

                  {/* Project 3 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-slate-200">
                      <span>Web Scraping & Analytics Platform</span>
                      <span className="text-slate-500 text-[11px] font-light">Completed MVP</span>
                    </div>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-light">
                      Python crawler using BeautifulSoup and Selenium browser nodes to parse dynamic product categories, clean tables, and plot distribution curves.
                    </p>
                  </div>

                </div>

              </div>

              {/* Right Column (4 cols): Coursework, Skills */}
              <div className="md:col-span-4 space-y-6">
                
                {/* Relevant Coursework */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-black text-cyber-purple border-b border-slate-850 pb-1 font-mono tracking-wider">Relevant Coursework</h4>
                  <ul className="space-y-1 text-[11px] font-light text-slate-400">
                    <li>• Data Structures & Algorithms</li>
                    <li>• Database Management Systems</li>
                    <li>• Operating Systems</li>
                    <li>• Computer Networks</li>
                    <li>• Software Engineering</li>
                    <li>• Machine Learning</li>
                    <li>• Artificial Intelligence</li>
                  </ul>
                </div>

                {/* Tech Skills */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-black text-cyber-purple border-b border-slate-850 pb-1 font-mono tracking-wider">Skills Summary</h4>
                  <div className="space-y-2 text-[11px] font-light">
                    <div>
                      <strong className="text-slate-350 font-bold block text-[10px] uppercase">AI & ML:</strong>
                      <span className="text-slate-400">Python, TensorFlow, Scikit-learn, OpenCV, OCR</span>
                    </div>
                    <div>
                      <strong className="text-slate-350 font-bold block text-[10px] uppercase">Frontend:</strong>
                      <span className="text-slate-400">React, TypeScript, Tailwind CSS, Vite</span>
                    </div>
                    <div>
                      <strong className="text-slate-350 font-bold block text-[10px] uppercase">Backend:</strong>
                      <span className="text-slate-400">Node.js, Express.js, MongoDB</span>
                    </div>
                    <div>
                      <strong className="text-slate-350 font-bold block text-[10px] uppercase">Tools:</strong>
                      <span className="text-slate-400">Git, GitHub, VS Code, Postman, AWS Basics</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. TECHNICAL SKILLS SUMMARY */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">Core Competencies</h2>
          <p className="text-sm text-slate-400">Frameworks and scripts I work with grouped by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-850 bg-cyber-card-dark space-y-4"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                {category.icon}
                <h3 className="font-display font-bold text-white text-sm">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3.5 py-1.5 rounded-full border border-slate-800 bg-[#0B0F19] text-slate-300 hover:border-slate-700 transition-colors font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. OPEN SOURCE & COMMUNITY INTERESTS */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">Open Source & Community</h2>
          <p className="text-sm text-slate-400">Contribution areas and code development interests</p>
        </div>

        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
            I am highly motivated to participate in open-source developer spaces. Participating in community codebases helps me study practical software engineering design patterns and clean repository architectures.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Full Stack Dashboard Modules', desc: 'Improving component states, responsiveness, and file structures.' },
              { title: 'Data Scraping Optimizations', desc: 'Validating cleaner parsers and studying proxy rotators.' },
              { title: 'Local OCR Configurations', desc: 'Testing client-side text pre-processing and image binarization.' },
              { title: 'APIs Integrations', desc: 'Writing clean connectors for OpenAI, Gemini, and custom web API targets.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-850 bg-[#0B0F19] space-y-1">
                <h3 className="text-xs font-bold text-slate-200">{item.title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONTACT FORM */}
      <section className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">Get In Touch</h2>
          <p className="text-sm text-slate-400">Send an inquiry, comment, or question</p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-850 bg-cyber-card-dark space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs font-bold">
                <label className="text-slate-350">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-slate-800 px-4 py-3 bg-[#0B0F19] text-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50"
                  aria-label="Your name input field"
                />
              </div>
              <div className="space-y-1.5 text-xs font-bold">
                <label className="text-slate-350">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl border border-slate-800 px-4 py-3 bg-[#0B0F19] text-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50"
                  aria-label="Your email input field"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-bold">
              <label className="text-slate-350">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full rounded-xl border border-slate-800 px-4 py-3 bg-[#0B0F19] text-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 resize-none"
                aria-label="Message text block area"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple py-3.5 text-xs font-bold text-white shadow-md shadow-cyber-cyan/15 hover:shadow-cyber-cyan/35 hover:brightness-105 transition-all duration-300 cursor-pointer"
              aria-label="Submit message button"
            >
              Send Message
            </button>
          </form>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-semibold text-center"
              >
                📬 Thank you! Your message has been simulated. Karthikeya Gurram will be notified!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
};

export default About;
