import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Helper: Download image from URL and save to uploads/
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

export const seedDatabase = async () => {
  try {
    // 1. Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 2. Check if we need to seed
    const userCount = await User.countDocuments({});
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    console.log('Starting Database Seeding...');

    // 3. Download assets
    const imagesToDownload = [
      { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop', filename: 'avatar-admin.png' },
      { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', filename: 'avatar-user.png' },
      { url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&h=450&fit=crop', filename: 'seed-ai.jpg' },
      { url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=450&fit=crop', filename: 'seed-ml.jpg' },
      { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop', filename: 'seed-web.jpg' },
      { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop', filename: 'seed-cloud.jpg' },
    ];

    for (const img of imagesToDownload) {
      const dest = path.join(uploadsDir, img.filename);
      console.log(`Downloading seed image: ${img.filename}...`);
      try {
        await downloadImage(img.url, dest);
      } catch (error) {
        console.warn(`Failed to download seed image ${img.filename}, creating mock file:`, error.message);
        fs.writeFileSync(dest, '');
      }
    }

    // 4. Create Users
    console.log('Creating seed users...');
    const adminUser = await User.create({
      name: 'Karthikeya Gurram',
      email: 'karthikeyanetha7@gmail.com',
      password: 'password123',
      role: 'admin',
      profileImage: '/uploads/avatar-admin.png',
    });

    const standardUser = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user',
      profileImage: '/uploads/avatar-user.png',
    });

    // 5. Create Blogs (Student developer articles)
    console.log('Creating seed blog articles...');
    const blogsData = [
      {
        title: 'Research Notes: OCR for Invoice Automation',
        content: `## Introduction to Invoice OCR\n\nAutomating data entry from invoices is a common engineering challenge. While complete enterprise systems use proprietary cloud APIs, I wanted to understand how open-source OCR engines perform on varying document layouts.\n\n### Document Preprocessing with OpenCV\n\nBefore passing an image to an OCR engine like Tesseract, preprocessing is critical. Raw scans often have noise, bad lighting, or skew. Here is a simple Python script using OpenCV to clean up an image:\n\n\`\`\`python\nimport cv2\nimport numpy as np\n\ndef preprocess_for_ocr(image_path):\n    # Load in grayscale\n    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)\n    \n    # Resize to increase text resolution\n    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)\n    \n    # Apply adaptive thresholding\n    cleaned = cv2.adaptiveThreshold(\n        img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,\n        cv2.THRESH_BINARY, 11, 2\n    )\n    return cleaned\n\`\`\`\n\n### Key Technical Challenges\n\n* **Layout Extraction**: Invoices place tables, vendor headers, and totals in arbitrary coordinates. Without template coordinates or deep bounding-box detection, parsing key-value pairs is complex.\n* **Resolution dependency**: Tesseract performs poorly if the image resolution drops below 300 DPI.\n\n### Recruiter Interview Checklist\n\nI can demo this Python pre-processing pipeline locally. While it doesn't automatically parse 100% of new invoices without manual regex rules, it serves as a foundation for understanding computer vision document extraction.`,
        category: 'Artificial Intelligence',
        tags: ['ocr', 'opencv', 'python', 'research'],
        featuredImage: '/uploads/seed-ai.png',
        author: adminUser._id,
        views: 105,
        publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Learning JWT Authentication in MERN',
        content: `## Securing Node.js Web Applications\n\nDuring my project work on the Box Cricket Booking System, I needed to implement secure administrative controls. This article documents how I configured JSON Web Tokens (JWT) for routing security.\n\n### Express Authentication Middleware\n\nTo protect backend APIs, we extract the bearer token from the request headers and verify it against our JWT secret key:\n\n\`\`\`javascript\nimport jwt from 'jsonwebtoken';\n\nexport const protect = async (req, res, next) => {\n  let token;\n  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {\n    try {\n      token = req.headers.authorization.split(' ')[1];\n      const decoded = jwt.verify(token, process.env.JWT_SECRET);\n      req.user = decoded;\n      next();\n    } catch (error) {\n      res.status(401).json({ message: 'Not authorized, token failed' });\n    }\n  }\n  if (!token) {\n    res.status(401).json({ message: 'Not authorized, no token provided' });\n  }\n};\n\`\`\`\n\n### Key Takeaways\n\n* **State vs Stateless**: JWT provides stateless auth, meaning the server doesn't need to look up sessions in the database for every request, improving responsiveness.\n* **Client Storage**: Storing tokens in \`localStorage\` makes them vulnerable to XSS attacks. For production setups, utilizing \`httpOnly\` secure cookies is a stronger practice that I plan to implement next.`,
        category: 'Web Development',
        tags: ['jwt', 'mern', 'security', 'node'],
        featuredImage: '/uploads/seed-web.png',
        author: adminUser._id,
        views: 182,
        publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Building My First Web Scraping Pipeline',
        content: `## Introduction to Web Scraping\n\nWeb scraping is an excellent way to compile unstructured data for machine learning model training. This guide summarizes my experience building a crawler using BeautifulSoup and Selenium.\n\n### Choosing the Right Tool\n\n* **BeautifulSoup**: Ideal for static HTML pages. It parses pages in milliseconds but cannot execute JavaScript.\n* **Selenium**: Spins up a headless browser to execute script nodes and parse dynamic components. It is heavier but required for modern single-page applications.\n\n### Python Implementation Example\n\nHere is a snippet showing proxy rotation configuration to prevent IP blocklists:\n\n\`\`\`python\nimport requests\nfrom bs4 import BeautifulSoup\n\ndef fetch_with_user_agent(url):\n    headers = {\n        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'\n    }\n    response = requests.get(url, headers=headers)\n    if response.status_code == 200:\n        return BeautifulSoup(response.text, 'html.parser')\n    return None\n\`\`\`\n\n### Ethical Scraping Guidelines\n\n* Always check the website's \`robots.txt\` configuration before crawling.\n* Add sleep delays (e.g. \`time.sleep(2)\`) between requests to avoid overloading vendor servers.`,
        category: 'Programming',
        tags: ['scraping', 'beautifulsoup', 'selenium', 'python'],
        featuredImage: '/uploads/seed-ml.png',
        author: adminUser._id,
        views: 145,
        publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Understanding LLM APIs',
        content: `## Exploring Large Language Models\n\nLarge Language Models (LLMs) are transforming how we build interactive products. As an AI & ML student, understanding how to write prompts and interact with APIs is a fundamental skillset.\n\n### Prompt Engineering & Bounding Box Logic\n\nPrompting is not just writing text; it's defining precise instructions and input constraints. When building invoice parsers, the prompt must structure output strictly in JSON format to prevent application crash states:\n\n\`\`\`python\n# Simulated API call prompt\nsystem_prompt = \"Extract the Total Amount and Vendor Name. Return strictly in JSON: {'vendor': str, 'total': float}\"\n\`\`\`\n\n### Tokens and Cost Optimization\n\nEvery character sent or received incurs a token cost. To build efficient applications, developers must:\n1. Keep context windows concise by trimming historical chat data.\n2. Leverage specialized, smaller open-source models (e.g. Llama-3-8B) for simple classification tasks instead of query-heavy massive networks.`,
        category: 'Artificial Intelligence',
        tags: ['llm', 'api', 'generativeai', 'prompting'],
        featuredImage: '/uploads/seed-cloud.png',
        author: adminUser._id,
        views: 210,
        publishedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'MongoDB Aggregation Fundamentals',
        content: `## Advanced Database Querying\n\nStandard database operations (CRUD) fetch individual documents, but analytics require compiling, matching, and summarizing values across collections. This article covers the MongoDB Aggregation framework.\n\n### Pipeline Stages\n\nAn aggregation pipeline processes documents sequentially through multiple stages. The three most common stages are:\n1. **$match**: Filters documents based on conditions (equivalent to SQL \`WHERE\`).\n2. **$group**: Groups documents by a key and calculates totals or averages (equivalent to SQL \`GROUP BY\`).\n3. **$project**: Reshapes the output documents, selecting or excluding specific fields.\n\n### Code Demonstration\n\nHere is a query calculating total revenue grouped by slot booking status:\n\n\`\`\`javascript\nconst summary = await Booking.aggregate([\n  { $match: { bookingStatus: 'Confirmed' } },\n  { $group: {\n      _id: '$courtId',\n      totalRevenue: { $sum: '$pricePaid' },\n      bookingCount: { $sum: 1 }\n  } },\n  { $sort: { totalRevenue: -1 } }\n]);\n\`\`\`\n\n### Summary\n\nUtilizing aggregation stages on the database server is significantly faster than fetching all records and processing array summaries in Node.js, protecting application memory.`,
        category: 'Web Development',
        tags: ['mongodb', 'database', 'mern', 'aggregation'],
        featuredImage: '/uploads/seed-mongodb.png',
        author: adminUser._id,
        views: 156,
        publishedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Training My First Linear Regression Model',
        content: `## Introduction to Supervised Machine Learning\n\nLinear regression is the foundational algorithm of supervised machine learning. As a student learning ML, I wanted to implement a practical regression model from scratch using Scikit-Learn to predict pricing indices.\n\n### Preparing the Data with Pandas\n\nBefore training any model, loading and cleaning data is the first major pipeline step. We handle missing parameters and select key features:\n\n\`\`\`python\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\n\n# Load dataset\ndf = pd.read_csv('housing_data.csv')\nX = df[['square_feet', 'bedrooms']]\ny = df['price']\n\n# Train test split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\`\`\`\n\n### Training and Evaluating the Model\n\nWe initialize the model, train it on our training partition, and evaluate it using Root Mean Squared Error (RMSE):\n\n\`\`\`python\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Model coefficient outputs\nprint(f'Coefficients: {model.coef_}')\n\`\`\`\n\n### Practical Learnings\n\n* **Feature Scaling**: Algorithms converge faster and yield more interpretable weights when features are standardized using \`StandardScaler\`.\n* **Overfitting**: Always cross-validate models on validation subsets rather than evaluating only on the training database to protect model generalizability.`,
        category: 'Machine Learning',
        tags: ['ml', 'scikit-learn', 'python', 'regression'],
        featuredImage: '/uploads/seed-ml.png',
        author: adminUser._id,
        views: 112,
        publishedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Hosting Static Sites on Amazon S3',
        content: `## Cloud Infrastructure Fundamentals\n\nTo learn cloud deployment, I wanted to deploy my static projects on AWS instead of using local dev tools. This article documents how to host a static website on Amazon Simple Storage Service (S3).\n\n### S3 Bucket Configuration\n\n1. **Create Bucket**: Set a unique bucket name and uncheck the 'Block all public access' settings.\n2. **Enable Static Website Hosting**: Under bucket properties, configure the index document pointer to index.html.\n\n### Bucket Policy Setup\n\nTo allow public read permissions, we configure a bucket policy specifying the standard read permission statement:\n\n\`\`\`json\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"PublicReadGetObject\",\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::your-bucket-name/*\"\n    }\n  ]\n}\n\`\`\`\n\n### Deploying via AWS CLI\n\nInstead of uploading folders manually in the web console, we sync our build directories from the terminal:\n\n\`\`\`bash\naws s3 sync ./dist s3://your-bucket-name\n\`\`\`\n\nHosting portfolios on S3 costs virtually nothing and provides robust scaling guarantees without managing backend servers.`,
        category: 'Cloud Computing',
        tags: ['aws', 's3', 'cloud', 'deployment'],
        featuredImage: '/uploads/seed-cloud.png',
        author: adminUser._id,
        views: 98,
        publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Student Guide: Preparing for AI/ML Internships',
        content: `## Preparing for Technical Recruiter Interviews\n\nAs a final-year B.Tech student, getting industry internships requires structured preparation. This checklist outlines the core skills and study tracks I focused on when applying for software engineering and AI/ML intern roles.\n\n### Core Study Checklist\n\n1. **Data Structures & Algorithms**: Master array filters, binary trees, sorting, and dictionary hash lookup complexity (Big-O notation).\n2. **Database Management**: Practice writing SQL queries containing joins, indices, and MERN aggregation stages locally.\n3. **Practical Portfolio**: Host completed web systems and data crawlers on GitHub with clean README documentation showing demonstratable logic.\n\n### Interview Tips\n\n* **Explain the Trade-offs**: When asked a coding question, don't just solve it. Talk through options, space complexity, and why you chose a specific collection structure.\n* **Avoid Fake Claims**: Highlight what features are completed MVPs and what features are roadmap items. Honesty is highly valued by interview panels.`,
        category: 'Career Guidance',
        tags: ['career', 'internships', 'interviewprep', 'guide'],
        featuredImage: '/uploads/seed-web.png',
        author: adminUser._id,
        views: 245,
        publishedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      },
    ];

    const seededBlogs = [];
    for (const blog of blogsData) {
      const created = await Blog.create(blog);
      seededBlogs.push(created);
    }

    // 6. Create Comments
    console.log('Creating seed comments...');
    await Comment.create([
      {
        user: standardUser._id,
        blog: seededBlogs[0]._id,
        comment: 'Very helpful research notes. Preprocessing threshold parameters are usually hard to calibrate.',
      },
      {
        user: standardUser._id,
        blog: seededBlogs[1]._id,
        comment: 'Great summary of JWT storage security options! HTTPOnly is definitely the gold standard.',
      },
    ]);

    console.log('Database Seeding Completed Successfully! Defaults:');
    console.log('- Admin Login: karthikeyanetha7@gmail.com / password123 (Simulated)');
    console.log('- User Login: jane@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
